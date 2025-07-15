import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Property } from '../../shared/types';
import { apiClient } from '../../shared/utils/api';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      fetchProperty(Number(id));
    }
  }, [id]);

  const fetchProperty = async (propertyId: number) => {
    try {
      setLoading(true);
      const propertyData = await apiClient.getProperty(propertyId);
      setProperty(propertyData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleVRExperience = () => {
    if (property?.vr_model_url) {
      router.push(`/vr-experience?propertyId=${property.id}`);
    } else {
      Alert.alert('VR Tour', 'VR tour not available for this property');
    }
  };

  const handleContactAgent = () => {
    Alert.alert('Contact Agent', 'Contact functionality coming soon');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading property details...</Text>
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

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[currentImageIndex] || `https://picsum.photos/400/300?random=${property.id}` }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        {property.images.length > 1 && (
          <ScrollView 
            horizontal 
            style={styles.imageGallery}
            showsHorizontalScrollIndicator={false}
          >
            {property.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.thumbnail,
                  currentImageIndex === index && styles.activeThumbnail
                ]}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Property Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>${property.price.toLocaleString()}</Text>
        <Text style={styles.address}>
          {property.address}, {property.city}, {property.state} {property.zip_code}
        </Text>

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bedrooms</Text>
              <Text style={styles.detailValue}>{property.bedrooms || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bathrooms</Text>
              <Text style={styles.detailValue}>{property.bathrooms || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Square Feet</Text>
              <Text style={styles.detailValue}>
                {property.square_feet ? property.square_feet.toLocaleString() : 'N/A'}
              </Text>
            </View>
          </View>

          {property.year_built && (
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Year Built</Text>
                <Text style={styles.detailValue}>{property.year_built}</Text>
              </View>
              {property.lot_size && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Lot Size</Text>
                  <Text style={styles.detailValue}>{property.lot_size} sqft</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Description */}
        {property.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>• {feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Agent Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listed by</Text>
          <View style={styles.agentContainer}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentInitials}>
                {property.agent.first_name.charAt(0)}{property.agent.last_name.charAt(0)}
              </Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>
                {property.agent.first_name} {property.agent.last_name}
              </Text>
              <Text style={styles.agentEmail}>{property.agent.email}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleContactAgent}
        >
          <Text style={styles.primaryButtonText}>Contact Agent</Text>
        </TouchableOpacity>
        
        {property.vr_model_url && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleVRExperience}
          >
            <Text style={styles.secondaryButtonText}>VR Tour</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    backgroundColor: 'white',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  imageGallery: {
    padding: 16,
  },
  thumbnail: {
    width: 80,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#1976d2',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    width: '50%',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
  agentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  agentEmail: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
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
}); 