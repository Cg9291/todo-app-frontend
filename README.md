# todo-list-frontend

Thin frontend repo for the todo API.

## Run locally

```bash
npm install
npm run dev
```

Vite runs on `http://localhost:4173` in this repo so it matches the backend's local CORS configuration.

## API configuration

Set `VITE_API_BASE_URL` in a local `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

For production, set the same variable in your host's environment configuration.

## Build

```bash
npm run build
```

Built assets are generated in `dist/`.

## Notes

This repo is intentionally framework-free for now.
It uses Vite for development, build output, and env injection while keeping the UI itself plain HTML, CSS, and browser JavaScript.
