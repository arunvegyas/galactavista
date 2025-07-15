import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  Save,
  Cancel,
  Home,
  Apartment,
  Business,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../shared/utils/api';
import { PropertyCreateRequest, PropertyUpdateRequest, PropertyType, PropertyStatus } from '../shared/types';

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  year_built: number;
  lot_size: number;
  features: string[];
}

const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Check if we're in edit mode based on URL path
  const isEditing = location.pathname.includes('/properties/edit/') && id;

  console.log('PropertyFormPage - ID:', id);
  console.log('PropertyFormPage - Location pathname:', location.pathname);
  console.log('PropertyFormPage - Is editing:', isEditing);
  console.log('PropertyFormPage - User authenticated:', isAuthenticated);
  console.log('PropertyFormPage - User:', user);

  // All hooks must be called before any conditional returns
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    property_type: 'house',
    status: 'available',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 0,
    year_built: new Date().getFullYear(),
    lot_size: 0,
    features: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && id && isAuthenticated) {
      // Load existing property data
      fetchProperty(id);
    }
  }, [isEditing, id, isAuthenticated]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if still loading
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      const property = await apiClient.getProperty(parseInt(propertyId));
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || 0,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        country: property.country || 'US',
        property_type: property.property_type || 'house',
        status: property.status || 'available',
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        square_feet: property.square_feet || 0,
        year_built: property.year_built || new Date().getFullYear(),
        lot_size: property.lot_size || 0,
        features: property.features || [],
      });
    } catch (err) {
      setError('Error loading property');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && id) {
        const updateData: PropertyUpdateRequest = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          property_type: formData.property_type,
          status: formData.status,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          square_feet: formData.square_feet,
          year_built: formData.year_built,
          lot_size: formData.lot_size,
          features: formData.features.length > 0 ? formData.features : undefined,
        };
        await apiClient.updateProperty(parseInt(id), updateData);
      } else {
        const createData: PropertyCreateRequest = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          property_type: formData.property_type,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          square_feet: formData.square_feet,
          year_built: formData.year_built,
          lot_size: formData.lot_size,
          features: formData.features.length > 0 ? formData.features : undefined,
        };
        await apiClient.createProperty(createData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err instanceof Error ? err.message : 'Error saving property');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading && isEditing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Loading property...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        {isEditing ? 'Edit Property' : 'Add New Property'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Property saved successfully! Redirecting to dashboard...
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Property Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  required
                  InputProps={{
                    startAdornment: <Typography>$</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </Grid>

              {/* Property Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Property Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={formData.property_type}
                    onChange={(e) => handleInputChange('property_type', e.target.value as PropertyType)}
                    label="Property Type"
                  >
                    <MenuItem value="house">
                      <Home sx={{ mr: 1 }} />
                      House
                    </MenuItem>
                    <MenuItem value="apartment">
                      <Apartment sx={{ mr: 1 }} />
                      Apartment
                    </MenuItem>
                    <MenuItem value="condo">
                      <Business sx={{ mr: 1 }} />
                      Condo
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as PropertyStatus)}
                    label="Status"
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="sold">Sold</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  type="number"
                  value={formData.square_feet}
                  onChange={(e) => handleInputChange('square_feet', Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Year Built"
                  type="number"
                  value={formData.year_built}
                  onChange={(e) => handleInputChange('year_built', Number(e.target.value))}
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Address Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lot Size (acres)"
                  type="number"
                  value={formData.lot_size}
                  onChange={(e) => handleInputChange('lot_size', Number(e.target.value))}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<Save />}
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PropertyFormPage; 