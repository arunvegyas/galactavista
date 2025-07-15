import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Property } from 'shared/types';
import { apiClient } from 'shared/utils/api';

export default function PropertiesScreen() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProperties();
      setProperties(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => router.push(`/property-detail?id=${item.id}`)}
    >
      <Image
        source={{ uri: item.images[0] || `https://picsum.photos/300/200?random=${item.id}` }}
        style={styles.propertyImage}
        resizeMode="cover"
      />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.propertyAddress} numberOfLines={1}>
          {item.address}, {item.city}, {item.state}
        </Text>
        <Text style={styles.propertyPrice}>
          ${item.price.toLocaleString()}
        </Text>
        <View style={styles.propertyDetails}>
          <Text style={styles.propertyDetail}>
            {item.bedrooms || 0} beds
          </Text>
          <Text style={styles.propertyDetail}>
            {item.bathrooms || 0} baths
          </Text>
          {item.square_feet && (
            <Text style={styles.propertyDetail}>
              {item.square_feet.toLocaleString()} sqft
            </Text>
          )}
        </View>
        {item.vr_model_url && (
          <View style={styles.vrBadge}>
            <Text style={styles.vrBadgeText}>VR Tour</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && properties.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading properties...</Text>
      </View>
    );
  }

  if (error && properties.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No properties found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  propertyDetail: {
    fontSize: 14,
    color: '#666',
  },
  vrBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vrBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
