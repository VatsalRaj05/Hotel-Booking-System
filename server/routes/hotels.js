const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { body, query, validationResult } = require('express-validator');

// GET /api/hotels - Fetch all hotels with optional filtering
router.get('/', [
  query('location').optional().trim(),
  query('name').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minRating').optional().isFloat({ min: 0, max: 5 })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: errors.array()
      });
    }

    const {
      location,
      name,
      minPrice,
      maxPrice,
      minRating
    } = req.query;

    // Build filter object
    let filter = {};

    // Location filter (case-insensitive)
    if (location) {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      ];
    }

    // Name filter (case-insensitive)
    if (name) {
      if (filter.$or) {
        filter.$or.push({ name: { $regex: name, $options: 'i' } });
      } else {
        filter.name = { $regex: name, $options: 'i' };
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // Query hotels with filters
    const hotels = await Hotel.find(filter)
      .sort({ rating: -1, pricePerNight: 1 })
      .lean();

    res.json({
      success: true,
      data: hotels,
      count: hotels.length
    });

  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hotels'
    });
  }
});

// GET /api/hotels/:id - Fetch single hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid hotel ID format'
      });
    }

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });

  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hotel'
    });
  }
});

module.exports = router;