import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { bannerAPI, brandAPI, carAPI, rentalAPI } from '../services/api';

// Initial state
const initialState = {
  banners: [],
  brands: [],
  cars: [],
  featuredCars: [],
  rentalCars: [],
  loading: {
    banners: false,
    brands: false,
    cars: false,
    featuredCars: false,
    rentalCars: false,
  },
  error: {
    banners: null,
    brands: null,
    cars: null,
    featuredCars: null,
    rentalCars: null,
  },
  filters: {
    search: '',
    brand: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    fuelType: '',
    transmission: '',
    sort: 'createdAt',
  },
  pagination: {
    cars: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    },
    rentalCars: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    },
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BANNERS: 'SET_BANNERS',
  SET_BRANDS: 'SET_BRANDS',
  SET_CARS: 'SET_CARS',
  SET_FEATURED_CARS: 'SET_FEATURED_CARS',
  SET_RENTAL_CARS: 'SET_RENTAL_CARS',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.type]: action.payload.error,
        },
      };

    case ActionTypes.SET_BANNERS:
      return {
        ...state,
        banners: action.payload,
      };

    case ActionTypes.SET_BRANDS:
      return {
        ...state,
        brands: action.payload,
      };

    case ActionTypes.SET_CARS:
      return {
        ...state,
        cars: action.payload,
      };

    case ActionTypes.SET_FEATURED_CARS:
      return {
        ...state,
        featuredCars: action.payload,
      };

    case ActionTypes.SET_RENTAL_CARS:
      return {
        ...state,
        rentalCars: action.payload,
      };

    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.type]: {
            ...state.pagination[action.payload.type],
            ...action.payload.data,
          },
        },
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setLoading = (type, loading) => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: { type, loading },
    });
  };

  const setError = (type, error) => {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: { type, error },
    });
  };

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading('banners', true);
      setError('banners', null);
      const response = await bannerAPI.getActive();
      dispatch({
        type: ActionTypes.SET_BANNERS,
        payload: response.data.data,
      });
    } catch (error) {
      setError('banners', error.response?.data?.message || 'Failed to fetch banners');
    } finally {
      setLoading('banners', false);
    }
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      setLoading('brands', true);
      setError('brands', null);
      const response = await brandAPI.getActive();
      dispatch({
        type: ActionTypes.SET_BRANDS,
        payload: response.data.data,
      });
    } catch (error) {
      setError('brands', error.response?.data?.message || 'Failed to fetch brands');
    } finally {
      setLoading('brands', false);
    }
  };

  // Fetch cars
  const fetchCars = async (params = {}) => {
    try {
      setLoading('cars', true);
      setError('cars', null);
      
      const queryParams = {
        ...state.filters,
        page: state.pagination.cars.page,
        limit: state.pagination.cars.limit,
        ...params,
      };

      // Remove empty values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await carAPI.getAll(queryParams);
      
      dispatch({
        type: ActionTypes.SET_CARS,
        payload: response.data.data,
      });

      dispatch({
        type: ActionTypes.SET_PAGINATION,
        payload: {
          type: 'cars',
          data: {
            total: response.data.total,
            totalPages: response.data.totalPages,
            page: response.data.currentPage,
          },
        },
      });
    } catch (error) {
      setError('cars', error.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading('cars', false);
    }
  };

  // Fetch featured cars (newest cars)
  const fetchFeaturedCars = async (limit = 6) => {
    try {
      setLoading('featuredCars', true);
      setError('featuredCars', null);
      // Fetch newest cars, sorted by creation date
      const response = await carAPI.getAll({ 
        limit, 
        page: 1,
        sort: 'createdAt',
        order: 'desc'
      });
      dispatch({
        type: ActionTypes.SET_FEATURED_CARS,
        payload: response.data.data || response.data,
      });
    } catch (error) {
      setError('featuredCars', error.response?.data?.message || 'Failed to fetch featured cars');
    } finally {
      setLoading('featuredCars', false);
    }
  };

  // Fetch rental cars
  const fetchRentalCars = async (params = {}) => {
    try {
      setLoading('rentalCars', true);
      setError('rentalCars', null);
      
      const queryParams = {
        page: state.pagination.rentalCars.page,
        limit: state.pagination.rentalCars.limit,
        ...params,
      };

      const response = await rentalAPI.getAll(queryParams);
      
      dispatch({
        type: ActionTypes.SET_RENTAL_CARS,
        payload: response.data.data,
      });

      dispatch({
        type: ActionTypes.SET_PAGINATION,
        payload: {
          type: 'rentalCars',
          data: {
            total: response.data.total,
            totalPages: response.data.totalPages,
            page: response.data.currentPage,
          },
        },
      });
    } catch (error) {
      setError('rentalCars', error.response?.data?.message || 'Failed to fetch rental cars');
    } finally {
      setLoading('rentalCars', false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    dispatch({
      type: ActionTypes.SET_FILTERS,
      payload: newFilters,
    });
  };

  // Reset filters
  const resetFilters = () => {
    dispatch({
      type: ActionTypes.RESET_FILTERS,
    });
  };

  // Update pagination
  const updatePagination = (type, data) => {
    dispatch({
      type: ActionTypes.SET_PAGINATION,
      payload: { type, data },
    });
  };

  // Load initial data
  useEffect(() => {
    fetchBanners();
    fetchBrands();
    fetchFeaturedCars();
  }, []);

  // Fetch cars when filters or pagination change
  useEffect(() => {
    fetchCars();
  }, [state.filters, state.pagination.cars.page]);

  const value = {
    ...state,
    fetchBanners,
    fetchBrands,
    fetchCars,
    fetchFeaturedCars,
    fetchRentalCars,
    updateFilters,
    resetFilters,
    updatePagination,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;