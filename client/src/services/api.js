import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Network error occurred';
    console.error('API Error:', errorMessage);

    // Create a more user-friendly error object
    const enhancedError = {
      ...error,
      userMessage: errorMessage,
      statusCode: error.response?.status
    };

    return Promise.reject(enhancedError);
  }
);

// Hotel API endpoints
export const hotelsAPI = {
  // Get all hotels with optional filtering
  getHotels: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/api/hotels?${queryString}` : '/api/hotels';

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Get single hotel by ID
  getHotelById: async (id) => {
    try {
      if (!id) {
        throw new Error('Hotel ID is required');
      }

      const response = await api.get(`/api/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel:', error);
      throw error;
    }
  }
};

// Booking API endpoints
export const bookingsAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get all bookings (optional)
  getBookings: async () => {
    try {
      const response = await api.get('/api/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    try {
      if (!id) {
        throw new Error('Booking ID is required');
      }

      const response = await api.get(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
};

// Utility function to handle API errors consistently
export const handleAPIError = (error, defaultMessage = 'An unexpected error occurred') => {
  if (error.userMessage) {
    return error.userMessage;
  }

  if (error.response?.data?.details) {
    return error.response.data.details[0]?.msg || defaultMessage;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return defaultMessage;
};

// Health check function
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

export default api;