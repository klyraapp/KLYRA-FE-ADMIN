/**
 * LocationContext
 * Provides global state for service locations to avoid redundant API calls.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getActiveServiceLocations } from '@/api/serviceLocationApi';
import { useSelector } from 'react-redux';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getActiveServiceLocations();
      setLocations(response?.data || []);
    } catch (err) {
      console.error("Error fetching service locations:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLocations();
    } else {
      // Clear locations when not authenticated to prevent state leakage
      setLocations([]);
    }
  }, [isAuthenticated, fetchLocations]);

  const getLocationName = useCallback((id) => {
    if (!id) return '-';
    const location = locations.find(loc => String(loc.id) === String(id));
    return location ? location.name : id;
  }, [locations]);

  const value = {
    locations,
    isLoading,
    error,
    refreshLocations: fetchLocations,
    getLocationName
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
