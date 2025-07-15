import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Property } from 'shared/types';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // For now, we'll use a simple in-memory storage
  // In a real app, this would be stored in AsyncStorage or a database
  useEffect(() => {
    // Simulate loading favorites
    setLoading(true);
    setTimeout(() => {
      setFavorites([]); // Empty for now
      setLoading(false);
    }, 1000);
  }, []);

  const removeFavorite = (propertyId: number) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this property from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(p => p.id !== propertyId));
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => router.push(`/property-detail?id=${item.id}`)}
    >
      <Image
        source={{ uri: item.images[0] || `https://picsum.photos/300/200?random=${item.id}` }}
        style={styles.favoriteImage}
        resizeMode="cover"
      />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.favoriteAddress} numberOfLines={1}>
          {item.address}, {item.city}, {item.state}
        </Text>
        <Text style={styles.favoritePrice}>
          ${item.price.toLocaleString()}
        </Text>
        <View style={styles.favoriteDetails}>
          <Text style={styles.favoriteDetail}>
            {item.bedrooms || 0} beds
          </Text>
          <Text style={styles.favoriteDetail}>
            {item.bathrooms || 0} baths
          </Text>
          {item.square_feet && (
            <Text style={styles.favoriteDetail}>
              {item.square_feet.toLocaleString()} sqft
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} property{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Properties you favorite will appear here
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.browseButtonText}>Browse Properties</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
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
    position: 'relative',
  },
  favoriteImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteInfo: {
    padding: 16,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoriteAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  favoritePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  favoriteDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  favoriteDetail: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
}); 