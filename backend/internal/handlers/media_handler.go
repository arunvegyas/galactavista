package handlers

import (
	"net/http"
	"strconv"

	"galactavista/internal/services"

	"github.com/gin-gonic/gin"
)

// MediaHandler handles media file operations
type MediaHandler struct {
	mediaService *services.MediaService
}

// NewMediaHandler creates a new media handler
func NewMediaHandler(mediaService *services.MediaService) *MediaHandler {
	return &MediaHandler{mediaService: mediaService}
}

// UploadFile handles file upload for a property
func (h *MediaHandler) UploadFile(c *gin.Context) {
	// Get property ID from URL
	propertyIDStr := c.Param("id")
	propertyID, err := strconv.ParseUint(propertyIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid property ID",
		})
		return
	}

	// Get uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "No file uploaded",
		})
		return
	}

	// Upload file
	mediaFile, err := h.mediaService.UploadFile(uint(propertyID), file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "File uploaded successfully",
		"data":    mediaFile,
	})
}

// GetPropertyMedia returns all media files for a property
func (h *MediaHandler) GetPropertyMedia(c *gin.Context) {
	// Get property ID from URL
	propertyIDStr := c.Param("id")
	propertyID, err := strconv.ParseUint(propertyIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid property ID",
		})
		return
	}

	// Get media files
	mediaFiles, err := h.mediaService.GetPropertyMedia(uint(propertyID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    mediaFiles,
	})
}

// DeleteMediaFile deletes a media file
func (h *MediaHandler) DeleteMediaFile(c *gin.Context) {
	// Get media file ID from URL
	mediaFileIDStr := c.Param("fileId")
	mediaFileID, err := strconv.ParseUint(mediaFileIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid media file ID",
		})
		return
	}

	// Delete media file
	err = h.mediaService.DeleteMediaFile(uint(mediaFileID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Media file deleted successfully",
	})
}
