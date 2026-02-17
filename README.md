# Reviwer — Crowdsourced Review Platform (Frontend + Backend)

This repository contains a full-stack (separable) prototype of a crowdsourced review platform:

- Frontend: Vite + React, Tailwind, Zustand for state, react-hot-toast, lucide icons  
- Backend: Express + Mongoose (MongoDB), JWT auth, multer streaming uploads to Cloudinary

Features
- Browse businesses by category, search and filter
- Business detail pages with reviews and photos
- Submit reviews with structured ratings (quality, service, value) and photo uploads
- Admin workflow: approve/reject reviews before they are published
- Signup & login (JWT), protected admin endpoints
- Cloudinary integration for image uploads
- Persisted client state (Zustand + localStorage), toasts, loaders, and polished UI

Repository layout
- backend/ — Express API
  - src/index.js — server entry
  - src/routes/ — route definitions
  - src/controllers/ — controller logic
  - src/models/ — Mongoose models
  - src/middleware — auth, multer config
  - src/utils/cloudinary.js — Cloudinary helper
  - src/seed.js — simple seed (users)
  - src/seed_full.js — full seeder (users, businesses, reviews)
- reviwer/ — React frontend (Vite)
  - src/components — UI components (Login, Signup, Upload, etc)
  - src/stores — Zustand stores (auth, business, review, ui)
  - src/utils/api.js — axios client (reads VITE_API_URL)

Quickstart (local)
1. Clone repository and open terminal.

2. Backend setup
   - cd backend
   - npm install
   - Create `.env` in backend with at least:
     ```
     MONGODB_URI=mongodb://localhost:27017/reviwer
     PORT=5000
     JWT_SECRET=your-jwt-secret

     # Cloudinary (for uploads)
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     CLOUDINARY_FOLDER=Reviwer
     ```
   - Seed the DB:
     - Quick users only: `npm run seed` (runs `src/seed.js`)
     - Full dataset: `node src/seed_full.js` (creates users, businesses, sample reviews)
   - Start the dev server:
     - `npm run dev`

3. Frontend setup
   - cd reviwer
   - npm install
   - Create `reviwer/.env`:
     ```
     VITE_API_URL=http://localhost:5000
     ```
   - Start frontend:
     - `npm run dev`
   - Open browser at the Vite dev URL (usually http://localhost:5173)

Testing flows
- Login:
  - Use seeded accounts (if you ran the seed scripts):
    - Admin: `admin@test.com` / `AdminPass123`
    - User: `john@test.com` / `UserPass123`
    - User: `jane@test.com` / `UserPass123`
- Submit review:
  - Go to Submit page, pick a business, add scores/comment and upload a photo.
  - Photos are uploaded to Cloudinary and URLs attached to the review.
  - Reviews submitted by users are created as `pending`.
- Admin approve:
  - Log in as admin, open the Admin page or the pending section on Dashboard.
  - Approve a pending review — rating aggregation updates business average and the approved review becomes visible on the business page.

Important endpoints
- Auth:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/profile (protected)
- Businesses:
  - GET /api/businesses
  - GET /api/businesses/:id
  - POST /api/businesses (protected)
- Reviews:
  - POST /api/reviews (protected)
  - GET /api/reviews/business/:businessId
  - GET /api/admin/reviews/pending (admin)
  - PUT /api/admin/reviews/:id/approve (admin)
  - PUT /api/admin/reviews/:id/reject (admin)
- Uploads:
  - POST /api/upload (field: `file`) — uploads file to Cloudinary and returns `{url, publicId}`
  - GET /api/upload/check — returns {configured: true|false}

Troubleshooting tips
- Upload 400s:
  - Ensure frontend sends FormData without manually setting Content-Type. The frontend client is configured correctly already.
  - Ensure backend .env has CLOUDINARY_* values. Check `GET /api/upload/check`.
- CORS/preflight:
  - Backend sets Access-Control-Allow-* headers and responds to OPTIONS in the middleware. If you still see preflight failures, inspect the OPTIONS request and response headers in the browser devtools.
- Auth issues (401):
  - Ensure the token is present in the frontend store and Authorization header is included. The app initializes the auth store on startup; if you reload and token is present but header missing, refresh the page after logging in or check console logs.

Development notes & TODOs
- Improve tests and add E2E tests for critical flows (auth, upload, review approve).
- Harden file uploads (virus scan, size limits, signed uploads).
- Add pagination for business and review lists.
- Add user profiles, avatars, and richer business detail pages (maps, galleries).

If you want, I can:
- Add a single `npm run seed:full` script to backend/package.json.
- Add a troubleshooting script to verify Cloudinary and MongoDB connectivity.

Enjoy — tell me which part you want me to expand (README changes, npm scripts, or adding more UI polish).

