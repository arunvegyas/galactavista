package models

import (
	"time"

	"gorm.io/gorm"
)

// MediaFile represents a media file (image, video, etc.)
type MediaFile struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	PropertyID uint           `json:"property_id" gorm:"not null"`
	Property   Property       `json:"property" gorm:"foreignKey:PropertyID"`
	FileName   string         `json:"file_name" gorm:"not null"`
	FileURL    string         `json:"file_url" gorm:"not null"`
	FileType   string         `json:"file_type" gorm:"not null"`
	FileSize   int64          `json:"file_size"`
	IsActive   bool           `json:"is_active" gorm:"default:true"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

// MediaFileCreateRequest represents media file creation request
type MediaFileCreateRequest struct {
	PropertyID uint   `json:"property_id" binding:"required"`
	FileName   string `json:"file_name" binding:"required"`
	FileURL    string `json:"file_url" binding:"required"`
	FileType   string `json:"file_type" binding:"required"`
	FileSize   int64  `json:"file_size"`
}

// MediaFileResponse represents media file response
type MediaFileResponse struct {
	ID         uint      `json:"id"`
	PropertyID uint      `json:"property_id"`
	FileName   string    `json:"file_name"`
	FileURL    string    `json:"file_url"`
	FileType   string    `json:"file_type"`
	FileSize   int64     `json:"file_size"`
	IsActive   bool      `json:"is_active"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
