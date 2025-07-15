import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { ViewInAr, Fullscreen, Share } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const VRExperiencePage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
        VR Experience
      </Typography>
      
      <Card sx={{ height: 600, mb: 4 }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Box textAlign="center" color="white">
            <ViewInAr sx={{ fontSize: 120, mb: 2, opacity: 0.7 }} />
            <Typography variant="h4" gutterBottom>
              VR Experience Coming Soon
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              Property ID: {propertyId}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<ViewInAr />}>
          Enter VR
        </Button>
        <Button variant="outlined" startIcon={<Fullscreen />}>
          Fullscreen
        </Button>
        <Button variant="outlined" startIcon={<Share />}>
          Share
        </Button>
      </Stack>
    </Container>
  );
};

export default VRExperiencePage; 