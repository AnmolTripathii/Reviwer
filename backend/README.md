# Crowdsourced Review Platform - Backend API

A robust RESTful API for a crowdsourced review platform where users can review and rate local businesses.

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Business Management (Create, Read, Update, Delete)
- ✅ Review Submission with Admin Approval Workflow
- ✅ Rating Aggregation System
- ✅ Search & Filter (by category, location, rating)
- ✅ Location-based Search (find businesses near you)
- ✅ Admin Dashboard with Statistics
- ✅ Role-based Access Control

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Business Routes (`/api/businesses`)

#### Get All Businesses (with filters)
```http
GET /api/businesses?category=restaurant&search=pizza&sortBy=rating

Query Parameters:
- category: restaurant | shop | service | other
- search: text search in name and description
- sortBy: rating | reviews | createdAt
- lat: latitude (for location-based search)
- lng: longitude (for location-based search)
- maxDistance: maximum distance in km
```

#### Get Business by ID
```http
GET /api/businesses/:id
```

#### Create Business
```http
POST /api/businesses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pizza Palace",
  "category": "restaurant",
  "description": "Best pizza in town!",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "location": {
    "type": "Point",
    "coordinates": [-73.935242, 40.730610]  // [longitude, latitude]
  },
  "contact": {
    "phone": "+1234567890",
    "email": "info@pizzapalace.com",
    "website": "https://pizzapalace.com"
  }
}
```

#### Update Business
```http
PUT /api/businesses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Business Name",
  "description": "Updated description"
}
```

#### Delete Business
```http
DELETE /api/businesses/:id
Authorization: Bearer <token>
```

### Review Routes (`/api/reviews`)

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessId": "business_id_here",
  "rating": 5,
  "comment": "Excellent service!"
}
```

#### Get Reviews for a Business
```http
GET /api/reviews/business/:businessId?status=approved
```

#### Get User's Reviews
```http
GET /api/reviews/user
Authorization: Bearer <token>
```

#### Update Review
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review"
}
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

### Admin Routes (`/api/admin`)

All admin routes require authentication and admin role.

#### Get Dashboard Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

#### Get Pending Reviews
```http
GET /api/admin/reviews/pending
Authorization: Bearer <token>
```

#### Approve Review
```http
PUT /api/admin/reviews/:id/approve
Authorization: Bearer <token>
```

#### Reject Review
```http
PUT /api/admin/reviews/:id/reject
Authorization: Bearer <token>
```

#### Get All Businesses (Admin View)
```http
GET /api/admin/businesses
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Business
```javascript
{
  name: String,
  category: 'restaurant' | 'shop' | 'service' | 'other',
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: 'Point',
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  averageRating: Number (0-5),
  totalReviews: Number,
  createdBy: ObjectId (User),
  createdAt: Date
}
```

### Review
```javascript
{
  business: ObjectId (Business),
  user: ObjectId (User),
  rating: Number (1-5),
  comment: String,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Date,
  approvedAt: Date,
  approvedBy: ObjectId (User)
}
```

## Review Workflow

1. User submits a review (status: `pending`)
2. Admin reviews the submission
3. Admin approves or rejects the review
4. If approved:
   - Review status changes to `approved`
   - Business average rating is automatically recalculated
   - Review becomes visible to public
5. If rejected:
   - Review status changes to `rejected`
   - Review is not visible to public

## Rating Aggregation

The system automatically calculates and updates the average rating for each business:
- Only approved reviews are counted
- Average is recalculated when:
  - A review is approved
  - A review is deleted
  - A review is updated
- Business documents store both `averageRating` and `totalReviews` for performance

## Location-Based Search

Businesses can be searched by proximity using geospatial queries:

```http
GET /api/businesses?lat=40.7128&lng=-74.0060&maxDistance=5

Parameters:
- lat: Latitude of search center
- lng: Longitude of search center  
- maxDistance: Search radius in kilometers
```

The API uses MongoDB's 2dsphere index for efficient geospatial queries.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "message": "Error description"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Protected routes middleware
- Input validation
- Unique constraints on critical fields

## Development

### Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## Future Enhancements (Not Implemented)

- Photo upload with reviews (Cloudinary integration ready)
- Email notifications
- Rate limiting
- API documentation with Swagger
- Review analytics
- Business claim functionality
- Multi-language support

## License

ISC
