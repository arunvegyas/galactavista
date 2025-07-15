import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Property, PropertySearchRequest } from 'shared/types';
import { apiClient } from 'shared/utils/api';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
  });
  const router = useRouter();

  const searchProperties = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const searchParams: PropertySearchRequest = {
        query: searchQuery,
        page: 1,
        page_size: 20,
      };

      // Add filters if they have values
      if (filters.minPrice) searchParams.min_price = parseInt(filters.minPrice);
      if (filters.maxPrice) searchParams.max_price = parseInt(filters.maxPrice);
      if (filters.propertyType) searchParams.property_type = filters.propertyType as any;
      if (filters.bedrooms) searchParams.bedrooms = parseInt(filters.bedrooms);
      if (filters.bathrooms) searchParams.bathrooms = parseInt(filters.bathrooms);

      const response = await apiClient.getProperties(searchParams);
      setProperties(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => router.push(`/property-detail?id=${item.id}`)}
    >
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchProperties}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchProperties}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.filterInput}
            placeholder="Min Price"
            value={filters.minPrice}
            onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: text }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Max Price"
            value={filters.maxPrice}
            onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: text }))}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.filterInput}
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChangeText={(text) => setFilters(prev => ({ ...prev, bedrooms: text }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Bathrooms"
            value={filters.bathrooms}
            onChangeText={(text) => setFilters(prev => ({ ...prev, bathrooms: text }))}
            keyboardType="numeric"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <Text>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No properties found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyInfo: {
    flex: 1,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 