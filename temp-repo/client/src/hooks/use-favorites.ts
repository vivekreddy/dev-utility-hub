import { useState, useEffect } from 'react';

// Local storage key
const FAVORITES_KEY = 'devutils-favorites';

export function useFavorites() {
  // Initialize state from localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  
  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);
  
  // Check if a tool is in favorites
  const isFavorite = (toolId: string): boolean => {
    return favorites.includes(toolId);
  };
  
  // Toggle a tool in favorites
  const toggleFavorite = (toolId: string): void => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(toolId)) {
        return prevFavorites.filter(id => id !== toolId);
      } else {
        return [...prevFavorites, toolId];
      }
    });
  };
  
  // Get all favorite IDs
  const getFavorites = (): string[] => {
    return favorites;
  };
  
  return {
    isFavorite,
    toggleFavorite,
    getFavorites
  };
}
