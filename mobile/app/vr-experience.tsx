import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Property } from '../../shared/types';
import { apiClient } from '../../shared/utils/api';

const { width, height } = Dimensions.get('window');

export default function VRExperienceScreen() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();

  useEffect(() => {
    if (propertyId) {
      fetchProperty(Number(propertyId));
    }
  }, [propertyId]);

  const fetchProperty = async (propertyId: number) => {
    try {
      setLoading(true);
      const propertyData = await apiClient.getProperty(propertyId);
      setProperty(propertyData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load property for VR experience');
    } finally {
      setLoading(false);
    }
  };

  const handleStartVR = () => {
    if (property?.vr_model_url) {
      // In a real app, this would launch the VR experience
      // For now, we'll show a placeholder
      Alert.alert(
        'VR Experience',
        'VR functionality will be implemented with WebXR or native VR SDKs',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } else {
      Alert.alert('VR Tour', 'VR tour not available for this property');
    }
  };

  const handleViewInBrowser = () => {
    if (property?.vr_model_url) {
      // In a real app, this would open the VR experience in a web browser
      Alert.alert('Open in Browser', 'This would open the VR experience in your browser');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading VR experience...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centered}>
        <Text>Property not found</Text>
      </View>
    );
  }

  if (!property.vr_model_url) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>VR Tour Not Available</Text>
        <Text style={styles.subtitle}>
          This property doesn't have a VR tour yet.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VR Experience</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Property Info */}
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <Text style={styles.propertyAddress}>
          {property.address}, {property.city}, {property.state}
        </Text>
        <Text style={styles.propertyPrice}>${property.price.toLocaleString()}</Text>
      </View>

      {/* VR Experience Placeholder */}
      <View style={styles.vrContainer}>
        <View style={styles.vrPlaceholder}>
          <Text style={styles.vrIcon}>🏠</Text>
          <Text style={styles.vrTitle}>Virtual Reality Tour</Text>
          <Text style={styles.vrSubtitle}>
            Experience this property in immersive 3D
          </Text>
        </View>
      </View>

      {/* VR Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton]}
          onPress={handleStartVR}
        >
          <Text style={styles.primaryButtonText}>Start VR Experience</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handleViewInBrowser}
        >
          <Text style={styles.secondaryButtonText}>View in Browser</Text>
        </TouchableOpacity>

        <View style={styles.vrInfo}>
          <Text style={styles.vrInfoTitle}>VR Experience Features:</Text>
          <Text style={styles.vrInfoItem}>• 360° property walkthrough</Text>
          <Text style={styles.vrInfoItem}>• Interactive room exploration</Text>
          <Text style={styles.vrInfoItem}>• Detailed property measurements</Text>
          <Text style={styles.vrInfoItem}>• Virtual staging options</Text>
        </View>
      </View>

      {/* Requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        <Text style={styles.requirementsItem}>• VR headset (Oculus, HTC Vive, etc.)</Text>
        <Text style={styles.requirementsItem}>• Compatible mobile device</Text>
        <Text style={styles.requirementsItem}>• Stable internet connection</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  propertyInfo: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  propertyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  propertyAddress: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  propertyPrice: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vrPlaceholder: {
    alignItems: 'center',
    padding: 40,
  },
  vrIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  vrTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  vrSubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  secondaryButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  vrInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  vrInfoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vrInfoItem: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  requirementsContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  requirementsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requirementsItem: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
}); 