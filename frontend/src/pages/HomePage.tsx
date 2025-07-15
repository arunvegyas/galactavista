import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ViewInAr,
  Search,
  Dashboard,
  Security,
  Speed,
  Support,
  LocationOn,
  Home,
  Apartment,
  Business,
  TrendingUp,
  Verified,
  Star,
  ArrowForward,
  PlayArrow,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <ViewInAr sx={{ fontSize: 40 }} />,
      title: 'Immersive VR Tours',
      description: 'Step inside properties with our cutting-edge VR technology. Experience every detail from anywhere in the world.',
      color: '#667eea',
    },
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Search',
      description: 'Find your perfect property with intelligent recommendations based on your preferences and lifestyle.',
      color: '#764ba2',
    },
    {
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      title: 'Agent Excellence',
      description: 'Comprehensive tools for real estate professionals to showcase properties and manage client relationships.',
      color: '#f093fb',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Trusted',
      description: 'Bank-level security with encrypted data protection and verified property listings.',
      color: '#4facfe',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures seamless VR experiences across all devices and networks.',
      color: '#43e97b',
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Dedicated support team available round-the-clock to assist you with any questions.',
      color: '#fa709a',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '5,000+', label: 'Happy Clients' },
    { number: '500+', label: 'VR Tours Created' },
    { number: '99.9%', label: 'Uptime' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Real Estate Agent',
      avatar: 'SJ',
      content: 'Galactavista has transformed how I showcase properties. My clients love the VR tours!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Property Buyer',
      avatar: 'MC',
      content: 'The VR experience helped me make confident decisions without visiting every property.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Property Seller',
      avatar: 'ER',
      content: 'My property sold 30% faster thanks to the immersive VR tour experience.',
      rating: 5,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
          color: 'white',
          py: { xs: 8, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="AI-Powered Platform"
                color="secondary"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              />
              <Typography 
                variant="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Experience Real Estate
                <br />
                <Box 
                  component="span" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 900,
                  }}
                >
                  Like Never Before
                </Box>
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.4,
                }}
              >
                Step into the future of real estate with our AI-powered VR technology. 
                Transform 2D photos into immersive 3D experiences that bring properties to life.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ 
                  flexWrap: 'wrap', 
                  gap: 2,
                  mb: 4,
                }}
              >
                <Button
                  component={Link}
                  to="/properties"
                  variant="contained"
                  size="large"
                  startIcon={<Search />}
                  sx={{ 
                    textTransform: 'none', 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                    color: '#1e3c72',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ffed4e, #ffd700)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Explore Properties
                </Button>
                <Button
                  component={Link}
                  to="/vr/demo"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
              
              {/* Stats */}
              <Grid container spacing={3} sx={{ mt: 4 }}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box textAlign="center">
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#ffd700',
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.8,
                          fontSize: '0.875rem',
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 3s infinite',
                  },
                }}
              >
                <ViewInAr sx={{ fontSize: 120, opacity: 0.8, zIndex: 1, position: 'relative' }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 2,
                  }}
                >
                  <Chip
                    label="AI-Powered"
                    sx={{
                      backgroundColor: 'rgba(255, 215, 0, 0.9)',
                      color: '#1e3c72',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Box textAlign="center" sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 3,
            }}
          >
            Why Choose Galactavista?
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Cutting-edge technology meets intuitive design to revolutionize how you experience real estate. 
            Our platform combines AI, VR, and real estate expertise to deliver unmatched value.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    '& .feature-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4, px: 3 }}>
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      color: feature.color, 
                      mb: 3,
                      transition: 'transform 0.3s ease',
                      display: 'inline-block',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontWeight: 300,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: { xs: 6, md: 12 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              What Our Users Say
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Join thousands of satisfied agents and buyers who trust Galactavista
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 56,
                          height: 56,
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          mr: 2,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                        color: 'text.secondary',
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#ffd700', fontSize: 20 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 3,
              }}
            >
              Ready to Transform Your Real Estate Experience?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 6,
                opacity: 0.9,
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              Join thousands of agents and buyers who are already using Galactavista 
              to revolutionize their property viewing experience. Start your journey today.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center" 
              sx={{ flexWrap: 'wrap', gap: 2 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{ 
                  textTransform: 'none', 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                  color: '#1e3c72',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ffed4e, #ffd700)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/dashboard"
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  textTransform: 'none',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'white',
                  borderColor: 'white',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Agent Dashboard
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box
        component="style"
        sx={{
          '@keyframes pulse': {
            '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.3 },
            '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.6 },
            '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.3 },
          },
        }}
      />
    </Box>
  );
};

export default HomePage; 