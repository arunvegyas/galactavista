package services

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"galactavista/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// MediaService handles media file operations
type MediaService struct {
	db *gorm.DB
}

// NewMediaService creates a new media service
func NewMediaService(db *gorm.DB) *MediaService {
	return &MediaService{db: db}
}

// UploadFile uploads a file and creates a media file record
func (s *MediaService) UploadFile(propertyID uint, file *multipart.FileHeader) (*models.MediaFileResponse, error) {
	// Validate file
	if err := s.validateFile(file); err != nil {
		return nil, err
	}

	// Generate unique filename
	fileName := s.generateFileName(file.Filename)

	// Create upload directory if it doesn't exist
	uploadDir := "uploads/properties"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Save file to disk
	filePath := filepath.Join(uploadDir, fileName)
	if err := s.saveFile(file, filePath); err != nil {
		return nil, err
	}

	// Create media file record
	mediaFile := &models.MediaFile{
		PropertyID: propertyID,
		FileName:   fileName,
		FileURL:    fmt.Sprintf("/uploads/properties/%s", fileName),
		FileType:   s.getFileType(file.Filename),
		FileSize:   file.Size,
		IsActive:   true,
	}

	if err := s.db.Create(mediaFile).Error; err != nil {
		// Clean up file if database insert fails
		os.Remove(filePath)
		return nil, fmt.Errorf("failed to create media file record: %w", err)
	}

	return s.toResponse(mediaFile), nil
}

// GetPropertyMedia returns all media files for a property
func (s *MediaService) GetPropertyMedia(propertyID uint) ([]models.MediaFileResponse, error) {
	var mediaFiles []models.MediaFile
	if err := s.db.Where("property_id = ? AND is_active = ?", propertyID, true).Find(&mediaFiles).Error; err != nil {
		return nil, err
	}

	responses := make([]models.MediaFileResponse, len(mediaFiles))
	for i, mediaFile := range mediaFiles {
		responses[i] = *s.toResponse(&mediaFile)
	}

	return responses, nil
}

// DeleteMediaFile deletes a media file
func (s *MediaService) DeleteMediaFile(mediaFileID uint) error {
	var mediaFile models.MediaFile
	if err := s.db.First(&mediaFile, mediaFileID).Error; err != nil {
		return err
	}

	// Delete file from disk
	filePath := filepath.Join("uploads/properties", mediaFile.FileName)
	if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete file from disk: %w", err)
	}

	// Delete from database
	return s.db.Delete(&mediaFile).Error
}

// validateFile validates the uploaded file
func (s *MediaService) validateFile(file *multipart.FileHeader) error {
	// Check file size (10MB limit)
	if file.Size > 10*1024*1024 {
		return fmt.Errorf("file size exceeds 10MB limit")
	}

	// Check file type
	allowedTypes := []string{".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".avi", ".mov"}
	ext := strings.ToLower(filepath.Ext(file.Filename))

	allowed := false
	for _, allowedType := range allowedTypes {
		if ext == allowedType {
			allowed = true
			break
		}
	}

	if !allowed {
		return fmt.Errorf("file type not allowed. Allowed types: %v", allowedTypes)
	}

	return nil
}

// generateFileName generates a unique filename
func (s *MediaService) generateFileName(originalName string) string {
	ext := filepath.Ext(originalName)
	uniqueID := uuid.New().String()
	return fmt.Sprintf("%s%s", uniqueID, ext)
}

// saveFile saves the uploaded file to disk
func (s *MediaService) saveFile(file *multipart.FileHeader, filePath string) error {
	src, err := file.Open()
	if err != nil {
		return fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	dst, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create destination file: %w", err)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return fmt.Errorf("failed to copy file: %w", err)
	}

	return nil
}

// getFileType determines the file type based on extension
func (s *MediaService) getFileType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))

	imageTypes := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
	videoTypes := []string{".mp4", ".avi", ".mov"}

	for _, imgType := range imageTypes {
		if ext == imgType {
			return "image"
		}
	}

	for _, vidType := range videoTypes {
		if ext == vidType {
			return "video"
		}
	}

	return "other"
}

// toResponse converts MediaFile to MediaFileResponse
func (s *MediaService) toResponse(mediaFile *models.MediaFile) *models.MediaFileResponse {
	return &models.MediaFileResponse{
		ID:         mediaFile.ID,
		PropertyID: mediaFile.PropertyID,
		FileName:   mediaFile.FileName,
		FileURL:    mediaFile.FileURL,
		FileType:   mediaFile.FileType,
		FileSize:   mediaFile.FileSize,
		IsActive:   mediaFile.IsActive,
		CreatedAt:  mediaFile.CreatedAt,
		UpdatedAt:  mediaFile.UpdatedAt,
	}
}
