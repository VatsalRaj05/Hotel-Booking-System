const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { body, validationResult } = require('express-validator');

// POST /api/bookings - Create new booking
router.post('/', [
  body('hotelId')
    .notEmpty()
    .withMessage('Hotel ID is required')
    .isMongoId()
    .withMessage('Invalid hotel ID format'),

  body('userName')
    .trim()
    .notEmpty()
    .withMessage('User name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('User name must be between 2 and 50 characters'),

  body('checkIn')
    .notEmpty()
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Invalid check-in date format')
    .custom((value) => {
      const checkInDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),

  body('checkOut')
    .notEmpty()
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .custom((value, { req }) => {
      const checkOutDate = new Date(value);
      const checkInDate = new Date(req.body.checkIn);
      if (checkOutDate <= checkInDate) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { hotelId, userName, checkIn, checkOut } = req.body;

    // Verify hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.pricePerNight;

    // Create booking
    const booking = new Booking({
      hotelId,
      userName,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice
    });

    // Save booking (this will trigger the pre-save middleware for date overlap validation)
    await booking.save();

    // Populate hotel details for response
    await booking.populate('hotelId');

    res.status(201).json({
      success: true,
      data: {
        booking: {
          id: booking._id,
          hotel: booking.hotelId,
          userName: booking.userName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          totalPrice: booking.totalPrice,
          status: booking.status,
          createdAt: booking.createdAt,
          nights
        }
      },
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);

    // Handle specific validation errors
    if (error.message.includes('already booked for the selected dates')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// GET /api/bookings - Fetch all bookings (optional)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $ne: 'cancelled' } })
      .populate('hotelId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/:id - Fetch single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking ID format'
      });
    }

    const booking = await Booking.findById(id).populate('hotelId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

module.exports = router;