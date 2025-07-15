import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  ViewInAr,
  Analytics,
  People,
  AttachMoney,
  Home,
  Visibility,
  TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import { useAuth } from '../hooks/useAuth';
import { Property } from '../shared/types';

const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { properties, loading, error, getPropertiesByAgent } = useProperties();
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    vrToursCreated: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const fetchAgentProperties = async () => {
      try {
        const response = await getPropertiesByAgent();
        const agentProperties = response.data;
        
        // Calculate dashboard stats
        const stats = {
          totalProperties: agentProperties.length,
          activeListings: agentProperties.filter((p: Property) => p.status === 'available').length,
          vrToursCreated: agentProperties.filter((p: Property) => p.vr_model_url).length,
          totalViews: 0, // TODO: Add views tracking to backend
        };
        
        setDashboardStats(stats);
      } catch (err) {
        console.error('Error fetching agent properties:', err);
      }
    };

    if (user?.role === 'agent') {
      fetchAgentProperties();
    }
  }, [user, getPropertiesByAgent]);

  if (loading && !properties.length) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const recentProperties = properties.slice(0, 5);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Agent Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {user?.first_name}! Here's your real estate overview.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/properties/new"
            sx={{ textTransform: 'none' }}
          >
            Add New Property
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewInAr />}
            component={Link}
            to="/vr/create"
            sx={{ textTransform: 'none' }}
          >
            Create VR Tour
          </Button>
          <Button
            variant="outlined"
            startIcon={<Analytics />}
            component={Link}
            to="/analytics"
            sx={{ textTransform: 'none' }}
          >
            View Analytics
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Home sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {dashboardStats.totalProperties}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Properties
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={75} sx={{ height: 4 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ViewInAr sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {dashboardStats.vrToursCreated}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    VR Tours Created
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={60} sx={{ height: 4 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Visibility sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {dashboardStats.totalViews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={45} sx={{ height: 4 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {dashboardStats.activeListings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Listings
                  </Typography>
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={dashboardStats.activeListings / Math.max(dashboardStats.totalProperties, 1) * 100} sx={{ height: 4 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Recent Properties */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Properties
                </Typography>
                <Button
                  component={Link}
                  to="/properties"
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>

              <List>
                {recentProperties.map((property) => (
                  <ListItem
                    key={property.id}
                    sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={property.images && property.images.length > 0 ? property.images[0] : undefined}
                        sx={{ width: 56, height: 56 }}
                      >
                        <Home />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={property.title}
                      secondary={`${property.address}, ${property.city}`}
                      sx={{ mr: 2 }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={property.status}
                        color={property.status === 'available' ? 'success' : 'default'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ${property.price.toLocaleString()}
                      </Typography>
                      {property.vr_model_url && (
                        <Chip
                          label="VR Tour"
                          size="small"
                          color="secondary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>

              {recentProperties.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No properties found. Add your first property to get started!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Price
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    ${properties.length > 0 
                      ? (properties.reduce((sum, p) => sum + p.price, 0) / properties.length).toLocaleString()
                      : '0'
                    }
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Properties with VR Tours
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {properties.filter(p => p.vr_model_url).length} / {properties.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {properties.length > 0 
                      ? ((properties.filter(p => p.status === 'sold').length / properties.length) * 100).toFixed(1)
                      : '0'
                    }%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AgentDashboardPage; 