/**
 * Helper function to get proper image URL
 * Converts relative paths to absolute URLs by prepending server URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path (starts with /uploads), prepend server URL
  if (imagePath.startsWith('/uploads')) {
    const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${serverUrl}${imagePath}`;
  }
  
  // Otherwise, assume it's a relative path and return as is
  return imagePath;
};

/**
 * Get fallback image URL for different content types
 */
export const getFallbackImage = (type = 'car') => {
  const fallbacks = {
    car: "https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg",
    brand: "https://via.placeholder.com/150x150?text=Brand+Logo",
    banner: "https://via.placeholder.com/1200x500?text=Banner+Image",
    rental: "https://cdn.pixabay.com/photo/2016/11/29/09/32/auto-1868726_1280.jpg"
  };
  
  return fallbacks[type] || fallbacks.car;
};