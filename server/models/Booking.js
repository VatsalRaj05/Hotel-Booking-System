const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minlength: [2, 'User name must be at least 2 characters'],
    maxlength: [50, 'User name cannot exceed 50 characters']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Check-in date cannot be in the past'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(value) {
        return value > this.checkIn;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
bookingSchema.index({ hotelId: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate nights and validate date overlap
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Booking = mongoose.model('Booking');

    // Check for overlapping bookings for the same hotel
    const overlappingBooking = await Booking.findOne({
      hotelId: this.hotelId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkIn: { $lte: this.checkIn },
          checkOut: { $gt: this.checkIn }
        },
        {
          checkIn: { $lt: this.checkOut },
          checkOut: { $gte: this.checkOut }
        },
        {
          checkIn: { $gte: this.checkIn },
          checkOut: { $lte: this.checkOut }
        }
      ]
    });

    if (overlappingBooking) {
      const error = new Error('Hotel is already booked for the selected dates');
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);