Rooted & Risen — Mini Blog Platform
=====================================
This package contains a ready-to-deploy starter for your daily blog:
- Frontend: React (single-file component provided as App.jsx). Tailwind classes used (you can remove or replace).
- Backend: Simple Express server with posts storage using a JSON file (development only).
- Local storage fallback: frontend saves posts locally if backend is not configured.
- Image handling: frontend stores images as data URLs (client-side).
- Auth: simple JWT-based author login (development). For production, replace with real identity provider (Auth0, Supabase Auth, Clerk, etc).
- Email subscriptions: instructions included for Mailchimp/ConvertKit integration.

What I included:
- Frontend component (App.jsx) for the canvas; integrate into a React app (Create React App, Vite, Next.js).
- Backend server (server.js) with endpoints:
  - POST /api/login  -> returns JWT for demo user (username/password in config)
  - GET /api/posts   -> list posts
  - POST /api/posts  -> create post (requires auth)
- Simple SVG logo file.

Security notice:
This starter is for development and demonstration only. Do NOT use the JSON file storage or the demo JWT secret in production. Use managed DB (Postgres), secure secrets, HTTPS, and production-ready auth.

Deployment tips in /deploy directory describe Vercel and Netlify basics and how to connect to a hosted backend (Heroku, Render, Railway, Supabase, or self-hosted).
