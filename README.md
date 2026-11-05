# Uddog

Uddog helps neighbours organise and join community service events—from donation drives and cleanups to tree plantations and health camps. Browse upcoming events, find one nearby, and keep track of the events you organise or join.

## Live Demo

[Open the live application](https://uddog-6n9g.vercel.app)

## Key Features

- Browse upcoming community events and search by title or location.
- Filter events by type and view event details, location, date, and participant count.
- Register and sign in with email and password or Google.
- Create, update, and delete events you organise.
- Join events and view your joined events.
- Manage your profile and profile photo.
- Switch between light and dark themes.
- Keep past events out of the upcoming-events list.

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, daisyUI 5 |
| Backend | Node.js, Express 5 |
| Authentication | Better Auth, JWT |
| Database | MongoDB |
| Tools | npm, ESLint, Git |

## Prerequisites

- Node.js 20.9 or newer
- npm
- MongoDB database (local or hosted)
- Git
- Google OAuth credentials if you want to enable Google sign-in

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/farukalways/uddog.git
cd uddog
```

### 2. Install dependencies

Install the backend and frontend dependencies separately:

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 3. Configure environment variables

Create `frontend/.env.local` and `backend/.env` using the templates below. Set the same MongoDB connection string in both files. Use a securely generated value for `BETTER_AUTH_SECRET`.

### 4. Start the backend

In a terminal from the repository root:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:5000` by default.

### 5. Start the frontend

In a second terminal from the repository root:

```bash
cd frontend
npm run dev
```

Open [https://uddog-6n9g.vercel.app](https://uddog-6n9g.vercel.app).

### Useful frontend commands

Run these from the `frontend` directory:

```bash
npm run lint
npm run build
npm run start
```

## Folder Structure

```text
uddog/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── lib/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── events.js
│   │       └── joins.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── api/auth/[...all]/route.ts
    │   │   ├── create-event/
    │   │   ├── events/
    │   │   ├── joined-events/
    │   │   ├── login/
    │   │   ├── manage-events/
    │   │   ├── profile/
    │   │   └── register/
    │   ├── components/
    │   ├── lib/
    │   └── proxy.ts
    └── package.json
```

## Environment Variables

### `frontend/.env.local`

```env
# Express API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend URL used by Better Auth
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Better Auth signing secret: replace with a securely generated secret
BETTER_AUTH_SECRET=<your-secure-secret>

# MongoDB connection used by Better Auth
MONGODB_URI=<your-mongodb-connection-string>
MONGODB_DB=social_events

# Google OAuth credentials (needed for Google sign-in)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### `backend/.env`

```env
PORT=5000
CLIENT_URL=http://localhost:3000

# Use the same MongoDB connection string as the frontend
MONGODB_URI=<your-mongodb-connection-string>
DB_NAME=social_events
```

`MONGODB_DB` configures the Better Auth database; `DB_NAME` configures the API database. Both default to `social_events`.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/events` | List upcoming events; supports `limit`, `type`, and `search` query parameters |
| `GET` | `/api/events/:id` | Get event details |
| `POST` | `/api/events` | Create an event (authentication required) |
| `GET` | `/api/events/mine` | List events created by the signed-in user |
| `PUT` | `/api/events/:id` | Update an event you own |
| `DELETE` | `/api/events/:id` | Delete an event you own and its sign-ups |
| `POST` | `/api/events/:id/join` | Join an event |
| `GET` | `/api/events/:id/joined` | Check whether you joined an event |
| `GET` | `/api/joins/mine` | List events you joined |

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch for your change.
2. Make your changes, keeping the frontend and backend conventions in mind.
3. Run the relevant checks, such as `npm run lint` and `npm run build` in `frontend`.
4. Open a pull request describing the change.

## License

This project is distributed under the MIT License.
