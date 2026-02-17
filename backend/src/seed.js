import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Business from './models/Business.js';
import Review from './models/Review.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'user123',
      role: 'user'
    });

    const regularUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@test.com',
      password: 'user123',
      role: 'user'
    });

    console.log('✅ Created test users');
    console.log('   - Admin: admin@test.com / admin123');
    console.log('   - User 1: john@test.com / user123');
    console.log('   - User 2: jane@test.com / user123');

    // Create businesses
    const businesses = [
      {
        name: 'Pizza Paradise',
        category: 'restaurant',
        description: 'Authentic Italian pizza with wood-fired oven. Family-owned since 1995. We serve the best Margherita and Pepperoni pizzas in town!',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.935242, 40.730610]
        },
        contact: {
          phone: '+1-212-555-0101',
          email: 'info@pizzaparadise.com',
          website: 'https://pizzaparadise.com'
        },
        createdBy: regularUser._id,
        averageRating: 4.5,
        totalReviews: 0
      },
      {
        name: 'Burger Boulevard',
        category: 'restaurant',
        description: 'Gourmet burgers made with 100% grass-fed beef. Try our signature bacon cheeseburger!',
        address: {
          street: '456 Oak Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.945242, 40.735610]
        },
        contact: {
          phone: '+1-212-555-0102',
          email: 'hello@burgerboulevard.com',
          website: 'https://burgerboulevard.com'
        },
        createdBy: regularUser._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Sushi Sensation',
        category: 'restaurant',
        description: 'Fresh sushi and sashimi prepared by master chefs. All-you-can-eat lunch specials available!',
        address: {
          street: '789 Park Lane',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.925242, 40.740610]
        },
        contact: {
          phone: '+1-212-555-0103',
          email: 'contact@sushisensation.com',
          website: 'https://sushisensation.com'
        },
        createdBy: regularUser2._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'The Book Nook',
        category: 'shop',
        description: 'Cozy independent bookstore with a curated selection of fiction, non-fiction, and rare books. Coffee shop inside!',
        address: {
          street: '321 Elm Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10004',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.955242, 40.745610]
        },
        contact: {
          phone: '+1-212-555-0104',
          email: 'info@booknook.com',
          website: 'https://booknook.com'
        },
        createdBy: regularUser2._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Tech Haven Electronics',
        category: 'shop',
        description: 'Latest gadgets and electronics. Expert advice and competitive prices. Authorized dealer for major brands.',
        address: {
          street: '555 Broadway',
          city: 'New York',
          state: 'NY',
          zipCode: '10005',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.965242, 40.750610]
        },
        contact: {
          phone: '+1-212-555-0105',
          email: 'support@techhaven.com',
          website: 'https://techhaven.com'
        },
        createdBy: adminUser._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Green Thumb Garden Center',
        category: 'shop',
        description: 'Everything for your garden - plants, tools, soil, and expert gardening advice. Organic options available.',
        address: {
          street: '888 Garden Road',
          city: 'New York',
          state: 'NY',
          zipCode: '10006',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.915242, 40.725610]
        },
        contact: {
          phone: '+1-212-555-0106',
          email: 'info@greenthumb.com',
          website: 'https://greenthumb.com'
        },
        createdBy: regularUser._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'QuickFix Plumbing',
        category: 'service',
        description: '24/7 emergency plumbing services. Licensed and insured. No job too big or small!',
        address: {
          street: '777 Service Drive',
          city: 'New York',
          state: 'NY',
          zipCode: '10007',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.975242, 40.755610]
        },
        contact: {
          phone: '+1-212-555-0107',
          email: 'emergency@quickfixplumbing.com',
          website: 'https://quickfixplumbing.com'
        },
        createdBy: regularUser2._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Sparkle Clean Laundry',
        category: 'service',
        description: 'Professional dry cleaning and laundry service. Same-day service available. Eco-friendly cleaning products.',
        address: {
          street: '999 Clean Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10008',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.905242, 40.720610]
        },
        contact: {
          phone: '+1-212-555-0108',
          email: 'info@sparkleclean.com',
          website: 'https://sparkleclean.com'
        },
        createdBy: adminUser._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'FitLife Gym & Wellness',
        category: 'service',
        description: 'State-of-the-art gym with personal trainers, yoga classes, and nutrition counseling. First week free!',
        address: {
          street: '444 Fitness Boulevard',
          city: 'New York',
          state: 'NY',
          zipCode: '10009',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.985242, 40.760610]
        },
        contact: {
          phone: '+1-212-555-0109',
          email: 'join@fitlifegym.com',
          website: 'https://fitlifegym.com'
        },
        createdBy: regularUser._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Coffee Corner Café',
        category: 'restaurant',
        description: 'Artisan coffee and homemade pastries. Free WiFi and cozy atmosphere perfect for working or studying.',
        address: {
          street: '222 Corner Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10010',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.895242, 40.715610]
        },
        contact: {
          phone: '+1-212-555-0110',
          email: 'hello@coffeecorner.com',
          website: 'https://coffeecorner.com'
        },
        createdBy: regularUser2._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Pet Paradise Grooming',
        category: 'service',
        description: 'Professional pet grooming for dogs and cats. Gentle care and affordable prices. Walk-ins welcome!',
        address: {
          street: '333 Pet Lane',
          city: 'New York',
          state: 'NY',
          zipCode: '10011',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.995242, 40.765610]
        },
        contact: {
          phone: '+1-212-555-0111',
          email: 'groom@petparadise.com',
          website: 'https://petparadise.com'
        },
        createdBy: regularUser._id,
        averageRating: 0,
        totalReviews: 0
      },
      {
        name: 'Community Arts Center',
        category: 'other',
        description: 'Local art gallery and community center. Art classes, exhibitions, and workshops for all ages.',
        address: {
          street: '666 Arts Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10012',
          country: 'USA'
        },
        location: {
          type: 'Point',
          coordinates: [-73.885242, 40.710610]
        },
        contact: {
          phone: '+1-212-555-0112',
          email: 'info@communityarts.org',
          website: 'https://communityarts.org'
        },
        createdBy: adminUser._id,
        averageRating: 0,
        totalReviews: 0
      }
    ];

    const createdBusinesses = await Business.insertMany(businesses);
    console.log(`✅ Created ${createdBusinesses.length} businesses`);

    // Create some sample reviews (mix of pending, approved, and rejected)
    const reviews = [
      {
        business: createdBusinesses[0]._id, // Pizza Paradise
        user: regularUser2._id,
        rating: 5,
        comment: 'Amazing pizza! The crust is perfectly crispy and the toppings are fresh. Highly recommend!',
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        business: createdBusinesses[0]._id, // Pizza Paradise
        user: regularUser._id,
        rating: 4,
        comment: 'Great pizza but the wait time was a bit long on weekends.',
        status: 'pending'
      },
      {
        business: createdBusinesses[3]._id, // The Book Nook
        user: regularUser._id,
        rating: 5,
        comment: 'Love this bookstore! The staff are knowledgeable and the coffee is excellent.',
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        business: createdBusinesses[6]._id, // QuickFix Plumbing
        user: regularUser._id,
        rating: 5,
        comment: 'Fast and professional service. Fixed my leaky faucet in no time!',
        status: 'pending'
      },
      {
        business: createdBusinesses[8]._id, // FitLife Gym
        user: regularUser2._id,
        rating: 4,
        comment: 'Great equipment and friendly trainers. Could use more yoga class times.',
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: adminUser._id
      },
      {
        business: createdBusinesses[9]._id, // Coffee Corner Café
        user: regularUser._id,
        rating: 5,
        comment: 'Perfect spot to work remotely. Great coffee and friendly atmosphere!',
        status: 'pending'
      }
    ];

    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} sample reviews`);

    // Update business ratings based on approved reviews
    const approvedReviewsForPizza = reviews.filter(r => r.business.equals(createdBusinesses[0]._id) && r.status === 'approved');
    if (approvedReviewsForPizza.length > 0) {
      const avgRating = approvedReviewsForPizza.reduce((sum, r) => sum + r.rating, 0) / approvedReviewsForPizza.length;
      await Business.findByIdAndUpdate(createdBusinesses[0]._id, {
        averageRating: avgRating,
        totalReviews: approvedReviewsForPizza.length
      });
    }

    const approvedReviewsForBookNook = reviews.filter(r => r.business.equals(createdBusinesses[3]._id) && r.status === 'approved');
    if (approvedReviewsForBookNook.length > 0) {
      const avgRating = approvedReviewsForBookNook.reduce((sum, r) => sum + r.rating, 0) / approvedReviewsForBookNook.length;
      await Business.findByIdAndUpdate(createdBusinesses[3]._id, {
        averageRating: avgRating,
        totalReviews: approvedReviewsForBookNook.length
      });
    }

    const approvedReviewsForGym = reviews.filter(r => r.business.equals(createdBusinesses[8]._id) && r.status === 'approved');
    if (approvedReviewsForGym.length > 0) {
      const avgRating = approvedReviewsForGym.reduce((sum, r) => sum + r.rating, 0) / approvedReviewsForGym.length;
      await Business.findByIdAndUpdate(createdBusinesses[8]._id, {
        averageRating: avgRating,
        totalReviews: approvedReviewsForGym.length
      });
    }

    console.log('✅ Updated business ratings');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Users: 3 (1 admin, 2 regular users)`);
    console.log(`   - Businesses: ${createdBusinesses.length}`);
    console.log(`   - Reviews: ${reviews.length} (3 approved, 3 pending)`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin:  admin@test.com / admin123');
    console.log('   User 1: john@test.com / user123');
    console.log('   User 2: jane@test.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
