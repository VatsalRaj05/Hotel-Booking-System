import React from 'react';
import './HotelDetails.css';

const HotelDetails = ({ hotel }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="rating">
        <div className="stars">
          {[...Array(fullStars)].map((_, i) => (
            <svg key={`full-${i}`} className="star filled" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.64 18.23L12 14.47L6.36 18.23L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"/>
            </svg>
          ))}
          {hasHalfStar && (
            <svg className="star filled" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.64 18.23L12 14.47L6.36 18.23L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"/>
            </svg>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <svg key={`empty-${i}`} className="star empty" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.64 18.23L12 14.47L6.36 18.23L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"/>
            </svg>
          ))}
        </div>
        <span className="rating-value">{rating.toFixed(1)} out of 5</span>
      </div>
    );
  };

  if (!hotel) {
    return (
      <div className="hotel-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  return (
    <div className="hotel-details">
      <div className="hotel-hero">
        <div className="hotel-image">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
            }}
          />
          {hotel.roomsAvailable <= 5 && (
            <div className="availability-badge">
              Only {hotel.roomsAvailable} rooms left!
            </div>
          )}
        </div>
      </div>

      <div className="hotel-content">
        <div className="hotel-header">
          <div className="hotel-title-section">
            <h1 className="hotel-name">{hotel.name}</h1>
            <div className="hotel-location">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.58172 6.58172 2 12 2C17.4183 2 21 5.58172 21 10Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{hotel.location.city}, {hotel.location.country}</span>
            </div>
          </div>

          <div className="hotel-rating-section">
            {renderRating(hotel.rating)}
          </div>
        </div>

        <div className="hotel-info-grid">
          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Available Rooms</h3>
              <p>{hotel.roomsAvailable} rooms ready</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Luxury Amenities</h3>
              <p>Modern facilities & services</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6569 16.6569C16.7202 17.5935 15.3818 18.1653 14 18.3266V22H10V18.3266C8.61816 18.1653 7.2798 17.5935 6.34315 16.6569C4.21895 14.5327 3.75358 11.2194 5.17157 8.62858L6.75736 5.65685L9.72893 7.24264C10.8807 7.81851 12.1193 7.81851 13.2711 7.24264L16.2426 5.65685L17.8284 8.62858C19.2464 11.2194 18.7811 14.5327 16.6569 16.6569Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="info-content">
              <h3>Prime Location</h3>
              <p>Central & accessible</p>
            </div>
          </div>
        </div>

        <div className="hotel-description-section">
          <h2>About This Hotel</h2>
          <p className="hotel-description">
            {hotel.description}
          </p>
        </div>

        <div className="hotel-booking-section">
          <div className="price-info">
            <div className="price-amount">{formatPrice(hotel.pricePerNight)}</div>
            <div className="price-period">per night</div>
          </div>

          <div className="booking-highlights">
            <div className="highlight-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Free cancellation</span>
            </div>
            <div className="highlight-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>No booking fees</span>
            </div>
            <div className="highlight-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;