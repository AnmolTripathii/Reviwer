import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './models/User.js'
import Business from './models/Business.js'
import Review from './models/Review.js'

dotenv.config()

// If MONGODB_URI not found (running from src/), try loading parent .env
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: '../.env' })
}

const rawUri = process.env.MONGODB_URI
const uri = (typeof rawUri === 'string' && rawUri.trim().length > 0)
  ? rawUri.replace(/^"+|"+$/g, '')
  : 'mongodb://localhost:27017/reviwer'

console.log('Using MongoDB URI:', uri.startsWith('mongodb://localhost') ? 'local fallback' : 'provided in env')

async function seedFull() {
  try {
    await mongoose.connect(uri)
    console.log('Connected to DB for full seeding')

  // Ensure admin and two regular users exist (create if missing)
  async function ensureUser(u) {
    const existing = await User.findOne({ email: u.email })
    if (existing) return existing
    const created = new User(u)
    await created.save()
    console.log(`Created user ${u.email}`)
    return created
  }

  const adminUser = await ensureUser({ name: 'Admin User', email: 'admin@test.com', password: 'AdminPass123', role: 'admin' })
  const userA = await ensureUser({ name: 'John Doe', email: 'john@test.com', password: 'UserPass123', role: 'user' })
  const userB = await ensureUser({ name: 'Jane Smith', email: 'jane@test.com', password: 'UserPass123', role: 'user' })
  const fallbackUser = adminUser || userA || userB

    // Clear existing businesses and reviews
    await Review.deleteMany({})
    await Business.deleteMany({})

    const businesses = [
      {
        name: 'Pizza Paradise',
        category: 'restaurant',
        description: 'Authentic Italian pizza with wood-fired oven. Family-owned with classic recipes.',
        address: { street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.935242, 40.73061] },
        contact: { phone: '+1-212-555-0101', email: 'info@pizzaparadise.com', website: 'https://pizzaparadise.com' },
        createdBy: userA._id,
      },
      {
        name: 'Coffee Corner Café',
        category: 'restaurant',
        description: 'Artisan coffee and homemade pastries. Cozy spot for remote work.',
        address: { street: '222 Corner Street', city: 'New York', state: 'NY', zipCode: '10010', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.895242, 40.71561] },
        contact: { phone: '+1-212-555-0110', email: 'hello@coffeecorner.com', website: 'https://coffeecorner.com' },
        createdBy: userB._id,
      },
      {
        name: 'Green Grocery',
        category: 'shop',
        description: 'Local organic produce and specialty items.',
        address: { street: '50 Market Lane', city: 'New York', state: 'NY', zipCode: '10002', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.945242, 40.73561] },
        contact: { phone: '+1-212-555-0120', email: 'hello@greengrocery.com' },
        createdBy: userA._id,
      },
      {
        name: 'The Book Nook',
        category: 'shop',
        description: 'Cozy independent bookstore with curated selections and a café corner.',
        address: { street: '321 Elm Street', city: 'New York', state: 'NY', zipCode: '10004', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.955242, 40.74561] },
        contact: { phone: '+1-212-555-0130', email: 'info@booknook.com' },
        createdBy: adminUser._id,
      },
      {
        name: 'Tech Haven Electronics',
        category: 'shop',
        description: 'Latest gadgets, expert advice, and repairs.',
        address: { street: '555 Broadway', city: 'New York', state: 'NY', zipCode: '10005', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.965242, 40.75061] },
        contact: { phone: '+1-212-555-0140', email: 'support@techhaven.com' },
        createdBy: adminUser._id,
      },
      {
        name: 'QuickFix Plumbing',
        category: 'service',
        description: '24/7 emergency plumbing; licensed and insured.',
        address: { street: '777 Service Drive', city: 'New York', state: 'NY', zipCode: '10007', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.975242, 40.75561] },
        contact: { phone: '+1-212-555-0150', email: 'emergency@quickfixplumbing.com' },
        createdBy: userA._id,
      },
      {
        name: 'FitLife Gym & Wellness',
        category: 'service',
        description: 'Gym with personal trainers, classes and a wellness shop.',
        address: { street: '444 Fitness Boulevard', city: 'New York', state: 'NY', zipCode: '10009', country: 'USA' },
        location: { type: 'Point', coordinates: [-73.985242, 40.76061] },
        contact: { phone: '+1-212-555-0160', email: 'join@fitlifegym.com' },
        createdBy: userB._id,
      }
    ]

    // Ensure each business has a valid createdBy
    const withOwner = businesses.map(b => ({ ...b, createdBy: b.createdBy || fallbackUser._id }))
    const created = await Business.insertMany(withOwner)
    console.log(`Created ${created.length} businesses`)

    // Create sample reviews only if we have at least one user to attribute
    const reviews = []
    const reviewer = userB || userA || fallbackUser
    if (reviewer) {
      reviews.push({
        business: created[0]._id,
        user: reviewer._id,
        rating: { quality: 5, service: 5, value: 4, average: 4.67 },
        comment: 'Amazing pizza! Highly recommend the Margherita.',
        status: 'approved',
        approvedBy: adminUser ? adminUser._id : fallbackUser._id,
        approvedAt: new Date(),
        category: 'food'
      })
    }

    if (reviews.length > 0) {
      await Review.insertMany(reviews)
      console.log(`Created ${reviews.length} reviews`)
    } else {
      console.log('No reviewer found — skipped creating sample reviews')
    }

    console.log('Full seeding complete')
    process.exit(0)
  } catch (err) {
    console.error('Full seeding error:', err)
    process.exit(1)
  }
}

seedFull()

