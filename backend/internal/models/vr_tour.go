package models

import (
	"time"

	"gorm.io/gorm"
)

// VRTour represents a VR tour for a property
type VRTour struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	PropertyID   uint           `json:"property_id" gorm:"not null"`
	Property     Property       `json:"property" gorm:"foreignKey:PropertyID"`
	Title        string         `json:"title" gorm:"not null"`
	Description  string         `json:"description"`
	ModelURL     string         `json:"model_url" gorm:"not null"`
	ThumbnailURL string         `json:"thumbnail_url"`
	IsActive     bool           `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// VRTourCreateRequest represents VR tour creation request
type VRTourCreateRequest struct {
	PropertyID   uint   `json:"property_id" binding:"required"`
	Title        string `json:"title" binding:"required"`
	Description  string `json:"description"`
	ModelURL     string `json:"model_url" binding:"required"`
	ThumbnailURL string `json:"thumbnail_url"`
}

// VRTourResponse represents VR tour response
type VRTourResponse struct {
	ID           uint             `json:"id"`
	PropertyID   uint             `json:"property_id"`
	Property     PropertyResponse `json:"property"`
	Title        string           `json:"title"`
	Description  string           `json:"description"`
	ModelURL     string           `json:"model_url"`
	ThumbnailURL string           `json:"thumbnail_url"`
	IsActive     bool             `json:"is_active"`
	CreatedAt    time.Time        `json:"created_at"`
	UpdatedAt    time.Time        `json:"updated_at"`
}
