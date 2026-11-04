# Neighbourly (Client)

Neighbourly is a community platform where people create, join and track social service events in their local area, such as winter clothes distributions in Mirpur 10 or blanket drives in Mohammadpur.

**Live site:** https://YOUR-CLIENT-URL.vercel.app  <!-- replace after deploying -->
**API (server):** https://YOUR-SERVER-URL.onrender.com  <!-- replace after deploying -->

## Features

- Email and password registration and login with BetterAuth, plus Google sign in
- Password rules enforced on both client and server: an uppercase letter, a lowercase letter and at least 6 characters
- Create events with a title, description, type, thumbnail URL, location and a future-only date
- Upcoming Events page that hides past events automatically, with search and event type filters
- Event details page open to everyone; joining requires login and joins are stored with event and user data
- Joined Events page sorted by event date, and Manage Events page to update or delete only your own events
- JWT-protected Express API: the client sends a BetterAuth JWT and the server verifies it against the JWKS endpoint
- Light and dark theme toggle that restyles the whole app, with no flash on load
- Loading skeletons on every data-driven page, and profile view and update (name and photo)
- Fully responsive layout for mobile, tablet and desktop

## Tech stack

Next.js (App Router), TypeScript, Tailwind CSS, DaisyUI, BetterAuth with the MongoDB adapter and JWT plugin, react-hot-toast.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The server project (`../server`) must be running and `NEXT_PUBLIC_API_URL` must point to it.

### Google sign in

Create an OAuth client in Google Cloud Console and add this authorised redirect URI:
`{BETTER_AUTH_URL}/api/auth/callback/google` (for local development: `http://localhost:3000/api/auth/callback/google`).

## Deployment notes

- Set every variable from `.env.example` in your host (Vercel). `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be your live client URL.
- Add your live client URL to the server's `CLIENT_URL` so CORS and JWT verification work.
- Reloading any route works without extra config, and private routes check the session cookie, so a logged-in user is not sent to Login on reload.
