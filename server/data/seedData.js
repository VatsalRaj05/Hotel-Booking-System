require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');

const sampleHotels = [
  {
    name: "Luxury Grand Hotel",
    location: {
      city: "New York",
      country: "USA"
    },
    pricePerNight: 250,
    description: "Experience luxury in the heart of Manhattan with stunning city views and world-class amenities. Our hotel offers elegant rooms, a rooftop pool, and exceptional dining experiences.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    roomsAvailable: 15
  },
  {
    name: "Seaside Resort & Spa",
    location: {
      city: "Miami",
      country: "USA"
    },
    pricePerNight: 180,
    description: "Relax on the beautiful beaches of Miami at our oceanfront resort. Enjoy spa treatments, water sports, and gourmet dining with breathtaking ocean views.",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    roomsAvailable: 25
  },
  {
    name: "Mountain View Lodge",
    location: {
      city: "Aspen",
      country: "USA"
    },
    pricePerNight: 320,
    description: "Escape to the mountains for an unforgettable alpine experience. Our lodge offers ski-in/ski-out access, cozy fireplaces, and stunning mountain scenery.",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    roomsAvailable: 8
  },
  {
    name: "Urban Boutique Hotel",
    location: {
      city: "San Francisco",
      country: "USA"
    },
    pricePerNight: 150,
    description: "Modern boutique hotel in the heart of downtown San Francisco. Experience contemporary design, local art, and easy access to major attractions.",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    roomsAvailable: 20
  },
  {
    name: "Historic Plaza Hotel",
    location: {
      city: "New Orleans",
      country: "USA"
    },
    pricePerNight: 175,
    description: "Step back in time at our beautifully restored historic hotel in the French Quarter. Enjoy Southern hospitality, jazz music, and authentic Creole cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    roomsAvailable: 12
  },
  {
    name: "Desert Oasis Resort",
    location: {
      city: "Phoenix",
      country: "USA"
    },
    pricePerNight: 140,
    description: "Discover tranquility in the Arizona desert at our luxury resort. Enjoy championship golf courses, spa treatments, and stunning desert sunsets.",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707d9d618d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    roomsAvailable: 18
  },
  {
    name: "Lakeside Retreat",
    location: {
      city: "Lake Tahoe",
      country: "USA"
    },
    pricePerNight: 200,
    description: "Escape to our beautiful lakeside retreat with year-round activities. From skiing in winter to hiking and water sports in summer, there's something for everyone.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    roomsAvailable: 10
  },
  {
    name: "Coastal Inn & Suites",
    location: {
      city: "San Diego",
      country: "USA"
    },
    pricePerNight: 120,
    description: "Relax on the beautiful California coast at our charming inn. Perfect for families and couples seeking sun, sand, and comfortable accommodations.",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    roomsAvailable: 30
  },
  {
    name: "Alpine Chalet Hotel",
    location: {
      city: "Denver",
      country: "USA"
    },
    pricePerNight: 165,
    description: "Experience the Rocky Mountains from our cozy alpine chalet. Perfect for both winter skiing and summer hiking adventures.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    roomsAvailable: 14
  },
  {
    name: "Tropical Paradise Resort",
    location: {
      city: "Honolulu",
      country: "USA"
    },
    pricePerNight: 280,
    description: "Live your island dream at our beachfront resort in Hawaii. Enjoy pristine beaches, tropical gardens, and authentic Hawaiian hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673219b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    roomsAvailable: 22
  },
  {
    name: "Metropolitan Grand Hotel",
    location: {
      city: "Chicago",
      country: "USA"
    },
    pricePerNight: 190,
    description: "Sophisticated downtown hotel with stunning city views. Perfect for business travelers and tourists looking to explore the Windy City.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    roomsAvailable: 35
  },
  {
    name: "Garden Court Inn",
    location: {
      city: "Portland",
      country: "USA"
    },
    pricePerNight: 135,
    description: "Quaint inn surrounded by beautiful gardens in the heart of Portland. Experience Pacific Northwest charm and hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    roomsAvailable: 16
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('Cleared existing hotels');

    // Insert sample hotels
    const insertedHotels = await Hotel.insertMany(sampleHotels);
    console.log(`Successfully inserted ${insertedHotels.length} hotels`);

    // Display inserted hotels
    console.log('\nSample Hotels:');
    insertedHotels.forEach((hotel, index) => {
      console.log(`${index + 1}. ${hotel.name} - ${hotel.location.city}, ${hotel.location.country} - $${hotel.pricePerNight}/night`);
    });

    console.log('\nDatabase seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();