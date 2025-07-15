package services

import (
	"errors"
	"galactavista/internal/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthService handles authentication operations
type AuthService struct {
	db     *gorm.DB
	jwtKey []byte
}

// NewAuthService creates a new auth service
func NewAuthService(db *gorm.DB, jwtKey string) *AuthService {
	return &AuthService{
		db:     db,
		jwtKey: []byte(jwtKey),
	}
}

// Claims represents JWT claims
type Claims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// Register registers a new user
func (s *AuthService) Register(req *models.UserRegisterRequest) (*models.UserResponse, error) {
	// Check if user already exists
	var existingUser models.User
	if err := s.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	user := models.User{
		Email:     req.Email,
		Password:  string(hashedPassword),
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      req.Role,
		Phone:     req.Phone,
		IsActive:  true,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return s.toUserResponse(&user), nil
}

// Login authenticates a user and returns a JWT token
func (s *AuthService) Login(req *models.UserLoginRequest) (string, *models.UserResponse, error) {
	var user models.User
	if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	// Check if user is active
	if !user.IsActive {
		return "", nil, errors.New("account is deactivated")
	}

	// Generate JWT token
	token, err := s.generateJWT(&user)
	if err != nil {
		return "", nil, err
	}

	return token, s.toUserResponse(&user), nil
}

// ValidateToken validates a JWT token and returns user claims
func (s *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return s.jwtKey, nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// GetUserByID gets a user by ID
func (s *AuthService) GetUserByID(userID uint) (*models.UserResponse, error) {
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return nil, err
	}

	return s.toUserResponse(&user), nil
}

// generateJWT generates a JWT token for a user
func (s *AuthService) generateJWT(user *models.User) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   string(user.Role),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtKey)
}

// toUserResponse converts a User to UserResponse
func (s *AuthService) toUserResponse(user *models.User) *models.UserResponse {
	return &models.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Role:      user.Role,
		Phone:     user.Phone,
		Avatar:    user.Avatar,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}
