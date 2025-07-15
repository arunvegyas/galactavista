import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Avatar,
  IconButton,
  Rating,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import {
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  CalendarToday,
  Phone,
  Email,
  Home,
  ViewInAr,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  Verified,
  Star,
  TrendingUp,
  Security,
  Speed,
  Support,
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import { Property } from '../shared/types';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchProperty, loading, error } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);

  // Redirect to PropertyFormPage if ID is "new"
  useEffect(() => {
    console.log('PropertyDetailPage - ID received:', id);
    if (id === 'new') {
      console.log('Redirecting to PropertyFormPage');
      navigate('/properties/new', { replace: true });
      return;
    }
  }, [id, navigate]);

  // Fetch property data
  useEffect(() => {
    if (id && id !== 'new' && !isNaN(parseInt(id))) {
      const propertyId = parseInt(id);
      fetchProperty(propertyId)
        .then((fetchedProperty) => {
          setProperty(fetchedProperty);
        })
        .catch((err) => {
          console.error('Error fetching property:', err);
        });
    } else if (id && id !== 'new') {
      // Invalid ID parameter
      console.error('Invalid property ID:', id);
    }
  }, [id, fetchProperty]);

  // Early return if ID is "new" to prevent further execution
  if (id === 'new') {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Loading Property Details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="error" sx={{ mb: 2, fontWeight: 600 }}>
            {!id || isNaN(parseInt(id)) ? 'Invalid Property ID' : (error || 'Property not found')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {!id || isNaN(parseInt(id)) ? 'The property ID in the URL is invalid.' : 'The property you are looking for could not be found.'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/properties')}
            sx={{ textTransform: 'none' }}
          >
            Back to Properties
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink 
            component={Link} 
            to="/properties" 
            color="inherit" 
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Properties
          </MuiLink>
          <Typography color="text.primary">{property.title}</Typography>
        </Breadcrumbs>

        {/* Header */}
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {property.title}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 300,
                }}
              >
                <LocationOn sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                {property.address}, {property.city}, {property.state} {property.zip_code}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <FavoriteBorder />
              </IconButton>
              <IconButton sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Share />
              </IconButton>
            </Stack>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Typography 
              variant="h3" 
              color="primary" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ${property.price.toLocaleString()}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip 
                label={property.status} 
                color="success" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={property.property_type} 
                variant="outlined" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                icon={<Verified />}
                label="Verified" 
                color="primary" 
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Images and Details */}
          <Grid item xs={12} lg={8}>
            {/* Main Image */}
            <Card 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Box
                component="img"
                src={property.images && property.images.length > 0 ? property.images[0] : 'https://picsum.photos/800/500?random=' + property.id}
                alt={property.title}
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 500 },
                  objectFit: 'cover',
                }}
              />
            </Card>

            {/* Property Stats */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                mb: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Property Overview
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      mb: 2,
                    }}>
                      <Bed sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      {property.bedrooms || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Bedrooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      mb: 2,
                    }}>
                      <Bathtub sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      {property.bathrooms || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Bathrooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      mb: 2,
                    }}>
                      <SquareFoot sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      {property.square_feet ? property.square_feet.toLocaleString() : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Square Feet
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      color: 'white',
                      mb: 2,
                    }}>
                      <CalendarToday sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      {property.year_built || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Year Built
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Property Description */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                mb: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                About This Property
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                }}
              >
                {property.description || 'No description available.'}
              </Typography>

              {property.features && property.features.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                    Features & Amenities
                  </Typography>
                  <Grid container spacing={2}>
                    {property.features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'rgba(30, 60, 114, 0.05)',
                          border: '1px solid rgba(30, 60, 114, 0.1)',
                        }}>
                          <Home sx={{ color: 'primary.main', mr: 2 }} />
                          <Typography sx={{ fontWeight: 500 }}>
                            {feature}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Agent Info and Actions */}
          <Grid item xs={12} lg={4}>
            {/* Agent Card */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                mb: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Listed by
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={property.agent?.avatar || undefined}
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  }}
                >
                  {property.agent ? `${property.agent.first_name[0]}${property.agent.last_name[0]}` : 'AG'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {property.agent ? `${property.agent.first_name} ${property.agent.last_name}` : 'Agent'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Real Estate Agent
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                      5.0 (24 reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Stack spacing={2}>
                {property.agent?.phone && (
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    fullWidth
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1.5,
                    }}
                  >
                    {property.agent.phone}
                  </Button>
                )}
                {property.agent?.email && (
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    fullWidth
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1.5,
                    }}
                  >
                    {property.agent.email}
                  </Button>
                )}
              </Stack>
            </Paper>

            {/* Action Buttons */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Take Action
              </Typography>
              <Stack spacing={3}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    py: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2a5298 0%, #1e3c72 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(30, 60, 114, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Schedule Viewing
                </Button>
                {property.vr_model_url && (
                  <Button
                    component={Link}
                    to={`/vr/${property.id}`}
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<ViewInAr />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      py: 2,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View VR Tour
                  </Button>
                )}
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    py: 2,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Request Information
                </Button>
              </Stack>
            </Paper>

            {/* Property Highlights */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                mt: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Property Highlights
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Verified sx={{ color: 'success.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Verified Property Listing
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ color: 'primary.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Secure Transaction Process
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Speed sx={{ color: 'primary.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Fast Response Time
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Support sx={{ color: 'primary.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    24/7 Customer Support
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetailPage; 