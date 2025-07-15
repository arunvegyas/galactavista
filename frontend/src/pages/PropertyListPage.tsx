import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Rating,
  Avatar,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  ViewInAr,
  FilterList,
  Favorite,
  FavoriteBorder,
  Star,
  ArrowForward,
  Home,
  Apartment,
  Business,
  TrendingUp,
  Verified,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import { PropertySearchRequest } from '../shared/types';

const PropertyListPage: React.FC = () => {
  const { properties, loading, error, pagination, searchProperties } = useProperties();
  const [searchParams, setSearchParams] = useState<PropertySearchRequest>({
    page: 1,
    page_size: 12,
  });

  const handleSearch = () => {
    searchProperties(searchParams);
  };

  const handleSearchChange = (field: keyof PropertySearchRequest, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page when search changes
    }));
  };

  useEffect(() => {
    searchProperties(searchParams);
  }, []);

  const propertyTypes = [
    { value: 'house', label: 'House', icon: <Home /> },
    { value: 'apartment', label: 'Apartment', icon: <Apartment /> },
    { value: 'condo', label: 'Condo', icon: <Business /> },
    { value: 'loft', label: 'Loft', icon: <Apartment /> },
  ];

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-300000', label: 'Under $300k' },
    { value: '300000-500000', label: '$300k - $500k' },
    { value: '500000-750000', label: '$500k - $750k' },
    { value: '750000-999999999', label: 'Over $750k' },
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header Section */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Discover Your Dream Home
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 300,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Explore our curated collection of premium properties with immersive VR tours and AI-powered recommendations.
          </Typography>
        </Box>
        
        {/* Search and Filters */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 4 },
            mb: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Search & Filters
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by location, property name..."
                value={searchParams.query || ''}
                onChange={(e) => handleSearchChange('query', e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select 
                  label="Property Type" 
                  value={searchParams.property_type || ''}
                  onChange={(e) => handleSearchChange('property_type', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {propertyTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {type.icon}
                        <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select 
                  label="Price Range" 
                  value={searchParams.max_price ? `${searchParams.min_price || 0}-${searchParams.max_price}` : ''}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    handleSearchChange('min_price', min);
                    handleSearchChange('max_price', max);
                  }}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  {priceRanges.map((range) => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Bedrooms</InputLabel>
                <Select 
                  label="Bedrooms" 
                  value={searchParams.bedrooms || ''}
                  onChange={(e) => handleSearchChange('bedrooms', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                  }}
                >
                  {bedroomOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSearch}
                disabled={loading}
                sx={{ 
                  height: 56, 
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2a5298 0%, #1e3c72 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(30, 60, 114, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: 'error.main',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Property Grid */}
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'white',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    '& .property-image': {
                      transform: 'scale(1.05)',
                    },
                    '& .property-actions': {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={property.images && property.images.length > 0 ? property.images[0] : 'https://picsum.photos/400/300?random=' + property.id}
                    alt={property.title}
                    className="property-image"
                    sx={{
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  
                  {/* Property Actions Overlay */}
                  <Box 
                    className="property-actions"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <IconButton
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      <FavoriteBorder />
                    </IconButton>
                  </Box>

                  {/* Property Type Badge */}
                  <Chip
                    label={property.property_type || 'Property'}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />

                  {/* VR Tour Badge */}
                  {property.vr_model_url && (
                    <Chip
                      icon={<ViewInAr />}
                      label="VR Tour"
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        backgroundColor: 'rgba(30, 60, 114, 0.9)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Verified sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                      Verified Property
                    </Typography>
                  </Box>

                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      lineHeight: 1.3,
                      mb: 1,
                    }}
                  >
                    {property.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 300,
                    }}
                  >
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                    {property.address}, {property.city}, {property.state}
                  </Typography>
                  
                  <Typography 
                    variant="h4" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 2,
                      background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ${property.price.toLocaleString()}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Chip
                      icon={<Bed />}
                      label={`${property.bedrooms || 0} bed`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<Bathtub />}
                      label={`${property.bathrooms || 0} bath`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    {property.square_feet && (
                      <Chip
                        icon={<SquareFoot />}
                        label={`${property.square_feet.toLocaleString()} sqft`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Stack>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Stack direction="row" spacing={1}>
                    {property.id ? (
                      <Button
                        component={Link}
                        to={`/properties/${property.id}`}
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          flex: 1, 
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{ 
                          flex: 1, 
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        No Details
                      </Button>
                    )}
                    {property.vr_model_url && property.id && (
                      <Button
                        component={Link}
                        to={`/vr/${property.id}`}
                        variant="contained"
                        size="small"
                        startIcon={<ViewInAr />}
                        sx={{ 
                          flex: 1, 
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2a5298, #1e3c72)',
                          },
                        }}
                      >
                        VR Tour
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Loading State */}
        {loading && properties.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
          <Paper 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
            }}
          >
            <Home sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No properties found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria to find more properties.
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                disabled={pagination.page <= 1}
                onClick={() => searchProperties({ ...searchParams, page: pagination.page - 1 })}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Previous
              </Button>
              
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                Page {pagination.page} of {pagination.total_pages}
              </Typography>
              
              <Button
                variant="outlined"
                disabled={pagination.page >= pagination.total_pages}
                onClick={() => searchProperties({ ...searchParams, page: pagination.page + 1 })}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Next
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PropertyListPage; 