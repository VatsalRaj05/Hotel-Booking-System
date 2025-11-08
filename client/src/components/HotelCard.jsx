import React from 'react';
import { Link } from 'react-router-dom';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
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
            <svg key={`full-${i}`} className="star filled" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.64 18.23L12 14.47L6.36 18.23L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"/>
            </svg>
          ))}
          {hasHalfStar && (
            <svg className="star filled" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.64 18.23L12 14.47L6.36 18.23L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"/>
            </svg>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <svg key={`empty-${i}`} className="star empty" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L14.09 8.26L20.18 8.27L15.54 11.97L17.64 18.23L12 14.47L6.36 18.23L8.46 11.97L3.82 8.27L9.91 8.26L12 2Z"/>
            </svg>
          ))}
        </div>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Link to={`/hotels/${hotel._id}`} className="hotel-card-link">
      <div className="hotel-card">
        <div className="hotel-image">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            }}
          />
          {hotel.roomsAvailable <= 5 && (
            <div className="availability-badge">
              Only {hotel.roomsAvailable} rooms left
            </div>
          )}
        </div>

        <div className="hotel-content">
          <div className="hotel-header">
            <h3 className="hotel-name">{hotel.name}</h3>
            {renderRating(hotel.rating)}
          </div>

          <div className="hotel-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.58172 6.58172 2 12 2C17.4183 2 21 5.58172 21 10Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{hotel.location.city}, {hotel.location.country}</span>
          </div>

          <p className="hotel-description">
            {hotel.description.length > 100
              ? `${hotel.description.substring(0, 100)}...`
              : hotel.description
            }
          </p>

          <div className="hotel-footer">
            <div className="hotel-price">
              <span className="price-amount">{formatPrice(hotel.pricePerNight)}</span>
              <span className="price-period">/ night</span>
            </div>

            <button className="book-button">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;