package models

import (
	"time"
)

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// PaginationRequest represents pagination parameters
type PaginationRequest struct {
	Page     int `json:"page" form:"page" binding:"min=1"`
	PageSize int `json:"page_size" form:"page_size" binding:"min=1,max=100"`
}

// PaginationResponse represents pagination response
type PaginationResponse struct {
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
	Total      int64       `json:"total"`
	TotalPages int         `json:"total_pages"`
	Data       interface{} `json:"data"`
}

// PropertySearchRequest represents property search parameters
type PropertySearchRequest struct {
	PaginationRequest
	Query        string          `json:"query" form:"query"`
	MinPrice     *float64        `json:"min_price" form:"min_price"`
	MaxPrice     *float64        `json:"max_price" form:"max_price"`
	PropertyType *PropertyType   `json:"property_type" form:"property_type"`
	Bedrooms     *int            `json:"bedrooms" form:"bedrooms"`
	Bathrooms    *float64        `json:"bathrooms" form:"bathrooms"`
	City         string          `json:"city" form:"city"`
	State        string          `json:"state" form:"state"`
	Status       *PropertyStatus `json:"status" form:"status"`
}

// VRExperience represents a VR experience for a property
type VRExperience struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	PropertyID   uint      `json:"property_id" gorm:"not null"`
	Property     Property  `json:"property" gorm:"foreignKey:PropertyID"`
	ModelURL     string    `json:"model_url" gorm:"not null"`
	ThumbnailURL string    `json:"thumbnail_url"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// VRExperienceCreateRequest represents VR experience creation request
type VRExperienceCreateRequest struct {
	PropertyID   uint   `json:"property_id" binding:"required"`
	ModelURL     string `json:"model_url" binding:"required"`
	ThumbnailURL string `json:"thumbnail_url"`
}

// VRExperienceResponse represents VR experience response
type VRExperienceResponse struct {
	ID           uint             `json:"id"`
	PropertyID   uint             `json:"property_id"`
	Property     PropertyResponse `json:"property"`
	ModelURL     string           `json:"model_url"`
	ThumbnailURL string           `json:"thumbnail_url"`
	IsActive     bool             `json:"is_active"`
	CreatedAt    time.Time        `json:"created_at"`
	UpdatedAt    time.Time        `json:"updated_at"`
}
