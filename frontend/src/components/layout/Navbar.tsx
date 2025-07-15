import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Chip,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  ViewInAr as VRIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Verified,
  Star,
  TrendingUp,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Properties', icon: <SearchIcon />, path: '/properties' },
    { text: 'VR Experience', icon: <VRIcon />, path: '/vr/demo' },
  ];

  // Add dashboard for authenticated users
  if (isAuthenticated && user?.role === 'agent') {
    menuItems.push({ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' });
  }

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 3, mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Galactavista
        </Typography>
        <Chip 
          icon={<Verified />} 
          label="AI-Powered" 
          size="small" 
          sx={{ 
            mt: 1,
            backgroundColor: 'rgba(30, 60, 114, 0.1)',
            color: 'primary.main',
            fontWeight: 600,
          }}
        />
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ 
              cursor: 'pointer',
              mx: 2,
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(30, 60, 114, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <Divider sx={{ my: 2, mx: 2 }} />
            <ListItem
              onClick={() => {
                navigate('/profile');
                setMobileOpen(false);
              }}
              sx={{ 
                cursor: 'pointer',
                mx: 2,
                mb: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(30, 60, 114, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}><PersonIcon /></ListItemIcon>
              <ListItemText 
                primary="Profile" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
            <ListItem
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              sx={{ 
                cursor: 'pointer',
                mx: 2,
                mb: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(30, 60, 114, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}><LogoutIcon /></ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'text.primary',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mr: 2,
                }}
              >
                Galactavista
              </Typography>
              <Chip 
                icon={<Verified />} 
                label="AI-Powered" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(30, 60, 114, 0.1)',
                  color: 'primary.main',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'flex' },
                }}
              />
            </Box>

            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  backgroundColor: 'rgba(30, 60, 114, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 60, 114, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(30, 60, 114, 0.05)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <IconButton
                      onClick={handleMenu}
                      sx={{ 
                        ml: 1,
                        backgroundColor: 'rgba(30, 60, 114, 0.05)',
                        '&:hover': {
                          backgroundColor: 'rgba(30, 60, 114, 0.1)',
                        },
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                          fontWeight: 600,
                        }}
                      >
                        {user?.first_name?.charAt(0) || <AccountCircleIcon />}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          borderRadius: 2,
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      <MenuItem 
                        onClick={() => { navigate('/profile'); handleClose(); }}
                        sx={{ 
                          px: 3, 
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'rgba(30, 60, 114, 0.05)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography sx={{ fontWeight: 600 }}>Profile</Typography>
                      </MenuItem>
                      <Divider />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{ 
                          px: 3, 
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.05)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'error.main' }}>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography sx={{ fontWeight: 600 }}>Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      variant="outlined"
                      component={Link}
                      to="/login"
                      startIcon={<LoginIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          backgroundColor: 'rgba(30, 60, 114, 0.05)',
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      component={Link}
                      to="/register"
                      startIcon={<PersonIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #2a5298 0%, #1e3c72 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 8px 25px rgba(30, 60, 114, 0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 