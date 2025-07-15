import { useState, useEffect, useCallback } from 'react';
import { Property, PropertySearchRequest, PaginationResponse } from '../shared/types';
import { apiClient } from '../shared/utils/api';

interface UsePropertiesState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  } | null;
}

export const useProperties = (initialParams?: PropertySearchRequest) => {
  const [state, setState] = useState<UsePropertiesState>({
    properties: [],
    loading: false,
    error: null,
    pagination: null,
  });

  const fetchProperties = useCallback(async (params?: PropertySearchRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response: PaginationResponse<Property> = await apiClient.getProperties(params);
      
      setState({
        properties: response.data,
        loading: false,
        error: null,
        pagination: {
          page: response.page,
          page_size: response.page_size,
          total: response.total,
          total_pages: response.total_pages,
        },
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
      }));
    }
  }, []);

  const fetchProperty = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const property = await apiClient.getProperty(id);
      
      setState(prev => ({
        ...prev,
        properties: [property],
        loading: false,
        error: null,
      }));
      
      return property;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property',
      }));
      throw error;
    }
  }, []);

  const createProperty = useCallback(async (propertyData: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const newProperty = await apiClient.createProperty(propertyData);
      
      setState(prev => ({
        ...prev,
        properties: [newProperty, ...prev.properties],
        loading: false,
        error: null,
      }));
      
      return newProperty;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create property',
      }));
      throw error;
    }
  }, []);

  const updateProperty = useCallback(async (id: number, propertyData: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedProperty = await apiClient.updateProperty(id, propertyData);
      
      setState(prev => ({
        ...prev,
        properties: prev.properties.map(p => p.id === id ? updatedProperty : p),
        loading: false,
        error: null,
      }));
      
      return updatedProperty;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update property',
      }));
      throw error;
    }
  }, []);

  const deleteProperty = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await apiClient.deleteProperty(id);
      
      setState(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete property',
      }));
      throw error;
    }
  }, []);

  const searchProperties = useCallback(async (searchParams: PropertySearchRequest) => {
    await fetchProperties(searchParams);
  }, [fetchProperties]);

  const getPropertiesByAgent = useCallback(async (params?: { page?: number; page_size?: number }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response: PaginationResponse<Property> = await apiClient.getPropertiesByAgent(params);
      
      setState({
        properties: response.data,
        loading: false,
        error: null,
        pagination: {
          page: response.page,
          page_size: response.page_size,
          total: response.total,
          total_pages: response.total_pages,
        },
      });
      
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch agent properties',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    if (initialParams) {
      fetchProperties(initialParams);
    }
  }, [fetchProperties, initialParams]);

  return {
    ...state,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    searchProperties,
    getPropertiesByAgent,
    clearError,
  };
}; 