package models

import (
	"time"

	"gorm.io/gorm"
)

// Property represents a real estate property
type Property struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	Title        string         `json:"title" gorm:"not null"`
	Description  string         `json:"description"`
	Price        float64        `json:"price" gorm:"not null"`
	Address      string         `json:"address" gorm:"not null"`
	City         string         `json:"city" gorm:"not null"`
	State        string         `json:"state" gorm:"not null"`
	ZipCode      string         `json:"zip_code" gorm:"not null"`
	Country      string         `json:"country" gorm:"not null;default:'US'"`
	PropertyType PropertyType   `json:"property_type" gorm:"not null"`
	Status       PropertyStatus `json:"status" gorm:"not null;default:'available'"`
	Bedrooms     int            `json:"bedrooms"`
	Bathrooms    float64        `json:"bathrooms"`
	SquareFeet   int            `json:"square_feet"`
	YearBuilt    int            `json:"year_built"`
	LotSize      float64        `json:"lot_size"`
	Features     []string       `json:"features" gorm:"type:json"`
	Images       []string       `json:"images" gorm:"type:json"`
	VRModelURL   string         `json:"vr_model_url"`
	AgentID      uint           `json:"agent_id" gorm:"not null"`
	Agent        User           `json:"agent" gorm:"foreignKey:AgentID"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// PropertyType represents the type of property
type PropertyType string

const (
	PropertyTypeHouse      PropertyType = "house"
	PropertyTypeCondo      PropertyType = "condo"
	PropertyTypeTownhouse  PropertyType = "townhouse"
	PropertyTypeApartment  PropertyType = "apartment"
	PropertyTypeLand       PropertyType = "land"
	PropertyTypeCommercial PropertyType = "commercial"
)

// PropertyStatus represents the status of a property
type PropertyStatus string

const (
	PropertyStatusAvailable PropertyStatus = "available"
	PropertyStatusSold      PropertyStatus = "sold"
	PropertyStatusPending   PropertyStatus = "pending"
	PropertyStatusRented    PropertyStatus = "rented"
)

// PropertyCreateRequest represents property creation request
type PropertyCreateRequest struct {
	Title        string       `json:"title" binding:"required"`
	Description  string       `json:"description"`
	Price        float64      `json:"price" binding:"required"`
	Address      string       `json:"address" binding:"required"`
	City         string       `json:"city" binding:"required"`
	State        string       `json:"state" binding:"required"`
	ZipCode      string       `json:"zip_code" binding:"required"`
	Country      string       `json:"country"`
	PropertyType PropertyType `json:"property_type" binding:"required"`
	Bedrooms     int          `json:"bedrooms"`
	Bathrooms    float64      `json:"bathrooms"`
	SquareFeet   int          `json:"square_feet"`
	YearBuilt    int          `json:"year_built"`
	LotSize      float64      `json:"lot_size"`
	Features     []string     `json:"features"`
	Images       []string     `json:"images"`
}

// PropertyUpdateRequest represents property update request
type PropertyUpdateRequest struct {
	Title        *string         `json:"title"`
	Description  *string         `json:"description"`
	Price        *float64        `json:"price"`
	Address      *string         `json:"address"`
	City         *string         `json:"city"`
	State        *string         `json:"state"`
	ZipCode      *string         `json:"zip_code"`
	Country      *string         `json:"country"`
	PropertyType *PropertyType   `json:"property_type"`
	Status       *PropertyStatus `json:"status"`
	Bedrooms     *int            `json:"bedrooms"`
	Bathrooms    *float64        `json:"bathrooms"`
	SquareFeet   *int            `json:"square_feet"`
	YearBuilt    *int            `json:"year_built"`
	LotSize      *float64        `json:"lot_size"`
	Features     []string        `json:"features"`
	Images       []string        `json:"images"`
	VRModelURL   *string         `json:"vr_model_url"`
}

// PropertyResponse represents property response
type PropertyResponse struct {
	ID           uint           `json:"id"`
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	Price        float64        `json:"price"`
	Address      string         `json:"address"`
	City         string         `json:"city"`
	State        string         `json:"state"`
	ZipCode      string         `json:"zip_code"`
	Country      string         `json:"country"`
	PropertyType PropertyType   `json:"property_type"`
	Status       PropertyStatus `json:"status"`
	Bedrooms     int            `json:"bedrooms"`
	Bathrooms    float64        `json:"bathrooms"`
	SquareFeet   int            `json:"square_feet"`
	YearBuilt    int            `json:"year_built"`
	LotSize      float64        `json:"lot_size"`
	Features     []string       `json:"features"`
	Images       []string       `json:"images"`
	VRModelURL   string         `json:"vr_model_url"`
	Agent        UserResponse   `json:"agent"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}
