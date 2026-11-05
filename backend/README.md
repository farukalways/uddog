# Neighbourly (Server)

Express, TypeScript and MongoDB API for the Neighbourly client.

## Setup

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:5000
```

Production: `npm run build && npm start`.

## Authentication

Protected routes expect `Authorization: Bearer <jwt>`. The JWT is issued by BetterAuth in the client app and verified here against `{CLIENT_URL}/api/auth/jwks`, so no shared secret is needed. The user's email in the token is stored as the event owner.

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/events` | No | Upcoming events only. Query: `limit`, `type`, `search` |
| GET | `/api/events/:id` | No | Event details with participant count |
| POST | `/api/events` | Yes | Create an event (date must be in the future) |
| GET | `/api/events/mine` | Yes | Events created by the logged-in user |
| PUT | `/api/events/:id` | Owner | Update an event |
| DELETE | `/api/events/:id` | Owner | Delete an event and its sign-ups |
| POST | `/api/events/:id/join` | Yes | Join an event (one join per user) |
| GET | `/api/events/:id/joined` | Yes | Has the current user joined this event |
| GET | `/api/joins/mine` | Yes | Events joined by the user, sorted by event date |
