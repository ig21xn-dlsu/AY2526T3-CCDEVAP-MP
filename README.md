# PadPal — Local Development Setup

This guide walks through setting up the PadPal project locally: a React (Vite) frontend and an Express + MongoDB backend.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later (this project has been run on v24)
- npm (comes with Node)
- Access to a MongoDB database (Atlas cluster or local `mongod` instance)
- Git

## 1. Clone the repository

```bash
git clone `repo-url`
cd `/repo-folder`
```

## 2. Backend setup (`/server`)

### Install dependencies

```bash
cd server
npm install
```

### Create `server/.env`

Create a file named `.env` inside the `server/` folder with the following keys:

```env
MONGO_URI=<your MongoDB connection string>
PORT=6767
SECRET=<a long, random string used to sign JWTs>
```
Along with the submission on canvas is a txt file instead of a script file. 

Our Project is ran through the free version of MongoDB Atlas, it is a cloud service that allows us as a team to work on the same database during the development without the need of passing databse scripts for continuity. Due to this, a script file is no longer needed as sample data is stored in this cloud database along with the new sample data that will be created during our 
group's live demonstration. With these credentials you will be given access to the cloud and be able to access the same data we all have in your local server instance. 

**What each variable is for:**

| Variable     | Purpose                                                                 |
|--------------|--------------------------------------------------------------------------|
| `MONGO_URI`  | Full connection string to your MongoDB database (Atlas or local).       |
| `PORT`       | The port the Express server listens on. `6767` is used throughout this project's frontend config — keep it consistent, or update `VITE_API_URL` (see below) to match whatever you choose. |
| `SECRET`     | Used by `jsonwebtoken` to sign and verify auth tokens. Any long random string works — generate one with `openssl rand -hex 32` or similar. |


### Run the backend

```bash
npm start
```

You should see something like:
```
Server running on port 6767
MongoDB connected
```

If you don't see `MongoDB connected`, double check `MONGO_URI` — a common mistake is forgetting to URL-encode special characters in your password.

## 3. Frontend setup (`/client`)

### Install dependencies

```bash
cd client
npm install
```

### Create `client/.env`

```env
VITE_API_URL=http://localhost:6767
```

This tells the frontend where to send API requests. It must match whatever `PORT` you set in `server/.env`.

> Vite only reads `.env` files at startup — if you change this value, restart the dev server (stopping and re-running `npm run dev` isn't enough to hot-reload env changes).

### Run the frontend

```bash
npm run dev
```

This starts the Vite dev server, typically at `http://localhost:5173`.

## 4. Verify everything is connected

1. Open `http://localhost:5173` in your browser.
2. Try registering/logging in — this confirms the frontend can reach the backend and MongoDB is responding.
3. Open your browser's DevTools → Network tab and confirm requests are going to `http://localhost:6767/api/...` and returning `200`/`201` responses, not CORS errors or 500s.

## Troubleshooting

### "Port already in use" / changes aren't taking effect after editing backend files

Plain `node server.js` does **not** hot-reload. If you edit any backend file (routes, models, middleware) and don't see the change take effect, you likely still have an old server process running in the background.

Check what's using your port:
```bash
lsof -i :6767
```

Kill it and restart:
```bash
kill -9 $(lsof -t -i :6767)
npm start
```

**Recommended fix:** install `nodemon` so this stops being an issue:
```bash
npm install --save-dev nodemon
```
Then update `server/package.json`:
```json
"scripts": {
  "start": "nodemon server.js"
}
```
This automatically restarts the server on every file save.

### CORS errors in the browser console

Make sure `server.js` has CORS configured with the correct frontend origin:
```js
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```
If your frontend runs on a different port, update `origin` to match.

### `401 Unauthorized` on requests that should be logged in

Check that the frontend is actually sending an `Authorization: Bearer <token>` header. In DevTools → Network tab, click the failing request → Headers → Request Headers, and confirm the header is present. If it's missing, check how/where the token is stored in `localStorage` after login and make sure the code reading it uses the same key.

### `500 Internal Server Error` with no useful browser message

The browser never shows backend stack traces (by design). Check the terminal running `npm start` / `node server.js` — the actual error and stack trace print there.

### Getting HTML back instead of JSON on an error (`Unexpected token '<'... is not valid JSON`)

This happens when the backend crashes without a JSON error handler, so Express falls back to its default HTML error page. Add a catch-all JSON error handler at the bottom of `server.js`, right before `app.listen(...)`:

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Something went wrong." });
});
```

## Project structure (high level)

```
/client
  /src
    /pages          → route-level components
    /components     → reusable UI pieces
    /hook           → custom React hooks (data fetching, auth, etc.)
    /context        → React context providers (e.g. AuthContext)
    /stylesheets    → CSS files
  .env              → VITE_API_URL

/server
  /routes           → Express route definitions
  /models           → Mongoose schemas
  /middleware       → auth middleware, etc.
  server.js         → app entry point
  .env              → MONGO_URI, PORT, SECRET
```
