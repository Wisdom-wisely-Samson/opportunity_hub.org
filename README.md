# Opportunity Hub

A production-ready platform connecting refugees and underserved communities to jobs, scholarships, grants, training programs, fellowships, and internships.

## Tech Stack

**Backend:** Node.js · Express.js · MongoDB (Mongoose) · JWT Auth · Cloudinary · Nodemailer  
**Frontend:** Vue 3 (Composition API) · Vite · Pinia · Vue Router 4 · TailwindCSS v3 · Axios

## Project Structure

```
Hub project/
├── backend/          # Express API server
│   ├── config/       # DB, Cloudinary, Email config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, upload, error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   ├── seeds/        # Database seed script
│   ├── services/     # Email & upload services
│   ├── utils/        # Helpers, pagination, response utils
│   ├── validators/   # express-validator rules
│   ├── app.js
│   └── server.js
└── frontend/         # Vue 3 SPA
    ├── public/
    └── src/
        ├── assets/       # Global CSS (Tailwind + custom components)
        ├── components/   # Reusable UI components
        ├── composables/  # useToast
        ├── layouts/      # Default, Auth, Refugee, Org, Admin layouts
        ├── pages/        # Route-level page components
        ├── router/       # Vue Router config + navigation guards
        ├── services/     # Axios API service modules
        ├── stores/       # Pinia auth store
        └── utils/        # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)
- Email SMTP credentials (Gmail / Mailtrap)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values (see below)
npm run dev
```

**.env variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opportunity-hub
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Seed Database

```bash
cd backend
npm run seed
```

This creates sample data including:
- 1 admin account
- 3 organizations (all verified)
- 3 refugee accounts
- 10 sample opportunities across all categories

**Seed credentials are printed to the console after seeding.**

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## User Roles

| Role | Access |
|------|--------|
| **Refugee** | Browse & apply for opportunities, manage profile & CV, track applications |
| **Organization** | Post & manage opportunities, review applicants, manage org profile |
| **Admin** | Verify organizations, manage all users/opportunities, view reports |

## API Endpoints

| Resource | Base Path |
|----------|-----------|
| Auth | `POST /api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/forgot-password`, `/api/auth/reset-password/:token`, `/api/auth/verify-email/:token` |
| Users | `GET/PUT /api/users/profile`, `POST /api/users/upload-avatar`, `POST /api/users/upload-cv`, saved opportunities, notifications |
| Organizations | `GET /api/organizations`, `GET/POST/PUT /api/organizations/profile`, `POST /api/organizations/upload-logo` |
| Opportunities | `GET /api/opportunities`, `GET /api/opportunities/:id`, `POST/PUT/DELETE /api/opportunities/:id` |
| Applications | `POST /api/applications`, `GET /api/applications`, `PUT /api/applications/:id/status`, `DELETE /api/applications/:id` |
| Admin | `GET /api/admin/dashboard`, `/api/admin/users`, `/api/admin/organizations`, `/api/admin/reports` |

## Deployment

### Frontend → Netlify / Vercel

1. Build: `npm run build` in `/frontend`
2. Publish directory: `frontend/dist`
3. Set env var: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Add redirect rule: `/* → /index.html` (for SPA routing)

### Backend → Render

1. Connect your GitHub repo
2. Build command: `npm install`
3. Start command: `node server.js`
4. Root directory: `backend`
5. Add all environment variables from `.env`

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render's dynamic IPs
3. Set `MONGODB_URI` to the Atlas connection string

## Branding

- **Primary color:** `#01596D` (teal)
- **Accent color:** `#F3D646` (yellow)
- **Font:** Trebuchet MS
