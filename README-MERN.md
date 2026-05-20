# Nanma Properties — MERN Frontend (React + Admin CMS)

This is the React app for the Nanma Properties website.
The companion **backend** lives at `../nanma-backend` and exposes the REST API + Cloudinary integration that this app talks to.

---

## What's in this repo

```
nanma-realestate/
├── public/
├── .env.example          ← copy to .env.local
└── src/
    ├── components/       Public-site UI (layout, sections, project cards…)
    ├── pages/            Public routes (Home, Projects, About, Gallery, Contact)
    ├── animations/       BlurText, SplitText, TextReveal, Magnetic, Counter
    ├── data/             Static demo content (kept as fallback for dev)
    └── admin/
        ├── api/          axios client + endpoint helpers
        ├── context/      AuthContext (JWT + localStorage persistence)
        ├── components/   Sidebar, ProtectedRoute, Toast, Repeater, RichText, ui primitives
        └── pages/        Login, Dashboard, ProjectsList, ProjectForm, GalleryAdmin, EnquiriesAdmin
```

## Quick start

```bash
# 1. Install deps
npm install

# 2. Configure env
cp .env.example .env.local
# Edit .env.local — point REACT_APP_API_URL at your backend (default http://localhost:5000)

# 3. Start the backend (separate terminal)
cd ../nanma-backend && npm run dev

# 4. Start the frontend
npm start
```

The site opens at **http://localhost:3001**.

| Path | What |
|---|---|
| `/` | Public home (hero slider, featured projects, …) |
| `/projects` | Project listing with status tabs |
| `/projects/:slug` | Project detail page |
| `/about` | About / story / team |
| `/gallery` | Masonry gallery + lightbox |
| `/contact` | Contact form (posts to backend `/api/enquiries`) |
| `/admin/login` | Admin sign in |
| `/admin` | Dashboard (protected) |
| `/admin/projects` | List + create + edit projects |
| `/admin/gallery` | Manage gallery (images, videos, YouTube) |
| `/admin/enquiries` | View and manage incoming enquiries |

## Environment variables (frontend)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SITE_URL=http://localhost:3001
REACT_APP_WHATSAPP=919999999999
PORT=3001
```

CRA only exposes vars prefixed with `REACT_APP_`. After editing `.env.local`, restart `npm start`.

## How the admin authenticates

1. `POST /api/auth/login` with email + password → backend returns a JWT.
2. Token is stored in `localStorage` under `nanma_token`.
3. Every API call sets `Authorization: Bearer <token>` via an axios interceptor.
4. Any `401` response automatically clears the token and bounces back to `/admin/login`.

Full setup steps for MongoDB Atlas + Cloudinary live in the **backend README**.
