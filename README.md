# todo-list-frontend

Thin frontend repo for the todo API.

## Run locally

```bash
npm run dev
```

The static server runs on `http://localhost:4173`.

## API configuration

Update `scripts/config.js` to point at your backend API.

Current default:

```js
export const API_BASE_URL = 'http://localhost:3000';
```

## Notes

This repo is intentionally framework-free for now.
It uses plain HTML, CSS, and browser JavaScript so the frontend and backend can evolve independently.
