const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    maxlength: [100, 'Hotel name cannot exceed 100 characters'],
    trim: true
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    }
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price per night cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  roomsAvailable: {
    type: Number,
    required: [true, 'Number of available rooms is required'],
    min: [0, 'Available rooms cannot be negative']
  }
}, {
  timestamps: true
});

// Add index for search functionality
hotelSchema.index({ 'location.city': 'text', name: 'text', description: 'text' });
hotelSchema.index({ pricePerNight: 1 });
hotelSchema.index({ rating: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);