import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './models/User.js'


dotenv.config()

const rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/reviwer'
const uri = typeof rawUri === 'string' ? rawUri.replace(/^"+|"+$/g, '') : rawUri

async function seed() {
  try {
    await mongoose.connect(uri)
    console.log('Connected to DB for seeding')

    const users = [
      { name: 'Admin User', email: 'admin@test.com', password: 'AdminPass123', role: 'admin' },
      { name: 'Regular User', email: 'user@test.com', password: 'UserPass123', role: 'user' }
    ]

    for (const u of users) {
      const existing = await User.findOne({ email: u.email })
      if (existing) {
        console.log(`User ${u.email} already exists — skipping`)
        if (existing.role !== u.role) {
          existing.role = u.role
          await existing.save()
          console.log(`Updated role for ${u.email} to ${u.role}`)
        }
      } else {
        const created = new User(u)
        await created.save()
        console.log(`Created user ${u.email} (${u.role})`)
      }
    }

    console.log('Seeding complete')
    process.exit(0)
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
}

seed()





