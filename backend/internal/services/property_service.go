package services

import (
	"errors"
	"galactavista/internal/models"

	"gorm.io/gorm"
)

// PropertyService handles property operations
type PropertyService struct {
	db *gorm.DB
}

// NewPropertyService creates a new property service
func NewPropertyService(db *gorm.DB) *PropertyService {
	return &PropertyService{db: db}
}

// CreateProperty creates a new property
func (s *PropertyService) CreateProperty(req *models.PropertyCreateRequest, agentID uint) (*models.PropertyResponse, error) {
	property := models.Property{
		Title:        req.Title,
		Description:  req.Description,
		Price:        req.Price,
		Address:      req.Address,
		City:         req.City,
		State:        req.State,
		ZipCode:      req.ZipCode,
		Country:      req.Country,
		PropertyType: req.PropertyType,
		Status:       models.PropertyStatusAvailable,
		Bedrooms:     req.Bedrooms,
		Bathrooms:    req.Bathrooms,
		SquareFeet:   req.SquareFeet,
		YearBuilt:    req.YearBuilt,
		LotSize:      req.LotSize,
		Features:     req.Features,
		Images:       req.Images,
		AgentID:      agentID,
	}

	if err := s.db.Create(&property).Error; err != nil {
		return nil, err
	}

	return s.getPropertyResponse(&property), nil
}

// GetProperty gets a property by ID
func (s *PropertyService) GetProperty(id uint) (*models.PropertyResponse, error) {
	var property models.Property
	if err := s.db.Preload("Agent").First(&property, id).Error; err != nil {
		return nil, err
	}

	return s.getPropertyResponse(&property), nil
}

// UpdateProperty updates a property
func (s *PropertyService) UpdateProperty(id uint, req *models.PropertyUpdateRequest, agentID uint) (*models.PropertyResponse, error) {
	var property models.Property
	if err := s.db.First(&property, id).Error; err != nil {
		return nil, err
	}

	// Check if user is the agent or admin
	if property.AgentID != agentID {
		return nil, errors.New("unauthorized")
	}

	// Update fields if provided
	if req.Title != nil {
		property.Title = *req.Title
	}
	if req.Description != nil {
		property.Description = *req.Description
	}
	if req.Price != nil {
		property.Price = *req.Price
	}
	if req.Address != nil {
		property.Address = *req.Address
	}
	if req.City != nil {
		property.City = *req.City
	}
	if req.State != nil {
		property.State = *req.State
	}
	if req.ZipCode != nil {
		property.ZipCode = *req.ZipCode
	}
	if req.Country != nil {
		property.Country = *req.Country
	}
	if req.PropertyType != nil {
		property.PropertyType = *req.PropertyType
	}
	if req.Status != nil {
		property.Status = *req.Status
	}
	if req.Bedrooms != nil {
		property.Bedrooms = *req.Bedrooms
	}
	if req.Bathrooms != nil {
		property.Bathrooms = *req.Bathrooms
	}
	if req.SquareFeet != nil {
		property.SquareFeet = *req.SquareFeet
	}
	if req.YearBuilt != nil {
		property.YearBuilt = *req.YearBuilt
	}
	if req.LotSize != nil {
		property.LotSize = *req.LotSize
	}
	if req.Features != nil {
		property.Features = req.Features
	}
	if req.Images != nil {
		property.Images = req.Images
	}
	if req.VRModelURL != nil {
		property.VRModelURL = *req.VRModelURL
	}

	if err := s.db.Save(&property).Error; err != nil {
		return nil, err
	}

	return s.getPropertyResponse(&property), nil
}

// DeleteProperty deletes a property
func (s *PropertyService) DeleteProperty(id uint, agentID uint) error {
	var property models.Property
	if err := s.db.First(&property, id).Error; err != nil {
		return err
	}

	// Check if user is the agent or admin
	if property.AgentID != agentID {
		return errors.New("unauthorized")
	}

	return s.db.Delete(&property).Error
}

// SearchProperties searches properties with filters
func (s *PropertyService) SearchProperties(req *models.PropertySearchRequest) (*models.PaginationResponse, error) {
	var properties []models.Property
	var total int64

	query := s.db.Preload("Agent")

	// Apply filters
	if req.Query != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ? OR address ILIKE ?",
			"%"+req.Query+"%", "%"+req.Query+"%", "%"+req.Query+"%")
	}
	if req.MinPrice != nil {
		query = query.Where("price >= ?", *req.MinPrice)
	}
	if req.MaxPrice != nil {
		query = query.Where("price <= ?", *req.MaxPrice)
	}
	if req.PropertyType != nil {
		query = query.Where("property_type = ?", *req.PropertyType)
	}
	if req.Bedrooms != nil {
		query = query.Where("bedrooms >= ?", *req.Bedrooms)
	}
	if req.Bathrooms != nil {
		query = query.Where("bathrooms >= ?", *req.Bathrooms)
	}
	if req.City != "" {
		query = query.Where("city ILIKE ?", "%"+req.City+"%")
	}
	if req.State != "" {
		query = query.Where("state ILIKE ?", "%"+req.State+"%")
	}
	if req.Status != nil {
		query = query.Where("status = ?", *req.Status)
	}

	// Count total
	if err := query.Model(&models.Property{}).Count(&total).Error; err != nil {
		return nil, err
	}

	// Apply pagination
	offset := (req.Page - 1) * req.PageSize
	if err := query.Offset(offset).Limit(req.PageSize).Find(&properties).Error; err != nil {
		return nil, err
	}

	// Convert to responses
	var responses []models.PropertyResponse
	for _, property := range properties {
		responses = append(responses, *s.getPropertyResponse(&property))
	}

	totalPages := int((total + int64(req.PageSize) - 1) / int64(req.PageSize))

	return &models.PaginationResponse{
		Page:       req.Page,
		PageSize:   req.PageSize,
		Total:      total,
		TotalPages: totalPages,
		Data:       responses,
	}, nil
}

// GetPropertiesByAgent gets properties by agent ID
func (s *PropertyService) GetPropertiesByAgent(agentID uint, req *models.PaginationRequest) (*models.PaginationResponse, error) {
	var properties []models.Property
	var total int64

	query := s.db.Preload("Agent").Where("agent_id = ?", agentID)

	// Count total
	if err := query.Model(&models.Property{}).Count(&total).Error; err != nil {
		return nil, err
	}

	// Apply pagination
	offset := (req.Page - 1) * req.PageSize
	if err := query.Offset(offset).Limit(req.PageSize).Find(&properties).Error; err != nil {
		return nil, err
	}

	// Convert to responses
	var responses []models.PropertyResponse
	for _, property := range properties {
		responses = append(responses, *s.getPropertyResponse(&property))
	}

	totalPages := int((total + int64(req.PageSize) - 1) / int64(req.PageSize))

	return &models.PaginationResponse{
		Page:       req.Page,
		PageSize:   req.PageSize,
		Total:      total,
		TotalPages: totalPages,
		Data:       responses,
	}, nil
}

// getPropertyResponse converts Property to PropertyResponse
func (s *PropertyService) getPropertyResponse(property *models.Property) *models.PropertyResponse {
	agentResponse := models.UserResponse{
		ID:        property.Agent.ID,
		Email:     property.Agent.Email,
		FirstName: property.Agent.FirstName,
		LastName:  property.Agent.LastName,
		Role:      property.Agent.Role,
		Phone:     property.Agent.Phone,
		Avatar:    property.Agent.Avatar,
		IsActive:  property.Agent.IsActive,
		CreatedAt: property.Agent.CreatedAt,
		UpdatedAt: property.Agent.UpdatedAt,
	}

	return &models.PropertyResponse{
		ID:           property.ID,
		Title:        property.Title,
		Description:  property.Description,
		Price:        property.Price,
		Address:      property.Address,
		City:         property.City,
		State:        property.State,
		ZipCode:      property.ZipCode,
		Country:      property.Country,
		PropertyType: property.PropertyType,
		Status:       property.Status,
		Bedrooms:     property.Bedrooms,
		Bathrooms:    property.Bathrooms,
		SquareFeet:   property.SquareFeet,
		YearBuilt:    property.YearBuilt,
		LotSize:      property.LotSize,
		Features:     property.Features,
		Images:       property.Images,
		VRModelURL:   property.VRModelURL,
		Agent:        agentResponse,
		CreatedAt:    property.CreatedAt,
		UpdatedAt:    property.UpdatedAt,
	}
}
