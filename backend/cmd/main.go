package main

import (
	"log"
	"os"

	"galactavista/internal/handlers"
	"galactavista/internal/middleware"
	"galactavista/internal/models"
	"galactavista/internal/services"
	"galactavista/pkg/config"
	"galactavista/pkg/database"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate database models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Property{},
		&models.VRTour{},
		&models.MediaFile{},
	); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize services
	authService := services.NewAuthService(db, cfg.JWTSecret)
	propertyService := services.NewPropertyService(db)
	mediaService := services.NewMediaService(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	propertyHandler := handlers.NewPropertyHandler(propertyService)
	mediaHandler := handlers.NewMediaHandler(mediaService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Initialize router
	router := gin.Default()

	// Add middleware
	router.Use(middleware.CORSMiddleware())

	// API routes
	api := router.Group("/api/v1")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.GET("/profile", authMiddleware.Authenticate(), authHandler.GetProfile)
			auth.PUT("/profile", authMiddleware.Authenticate(), authHandler.UpdateProfile)
		}

		// Property routes
		properties := api.Group("/properties")
		{
			properties.GET("/", propertyHandler.SearchProperties)
			properties.GET("/:id", propertyHandler.GetProperty)
			properties.POST("/", authMiddleware.Authenticate(), propertyHandler.CreateProperty)
			properties.PUT("/:id", authMiddleware.Authenticate(), propertyHandler.UpdateProperty)
			properties.DELETE("/:id", authMiddleware.Authenticate(), propertyHandler.DeleteProperty)
			properties.GET("/agent", authMiddleware.Authenticate(), propertyHandler.GetPropertiesByAgent)
		}

		// Media routes
		media := api.Group("/properties")
		{
			media.POST("/:id/upload", authMiddleware.Authenticate(), mediaHandler.UploadFile)
			media.GET("/:id/media", mediaHandler.GetPropertyMedia)
			media.DELETE("/:id/media/:fileId", authMiddleware.Authenticate(), mediaHandler.DeleteMediaFile)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Galactavista server on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
