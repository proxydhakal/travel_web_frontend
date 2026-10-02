# Frontend

The public site and the admin screens. Vite, React, and TypeScript. Pages call `/api` on the same origin. In development, Vite forwards those calls to the API on port 8000.

## Setup

You need Node.js 22.

```bash
cd frontend
npm install
```

Start the API from the `backend` folder first, then:

```bash
npm run dev
```

Open http://localhost:5173. The admin screens are at http://localhost:5173/admin.

Other commands:

```bash
npm run build
npm run preview
```

`npm run build` checks TypeScript and writes the static site to `dist`.

## Docker

The image in this folder builds that static site and serves it with Nginx. It does not publish a port of its own. The Compose file at the root of the project puts this container behind the shared Nginx proxy, together with the API, Postgres, and Redis.

From the project root:

```bash
docker compose up --build
```

Then open http://localhost:8080.
