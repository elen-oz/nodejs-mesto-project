# Mesto Backend

REST API for Mesto: user profiles and photo cards, with JWT authentication.

**Stack:** TypeScript, Node.js, Express, MongoDB, Mongoose, celebrate, winston.

## Getting started

Requires MongoDB running at `mongodb://localhost:27017/mestodb`.

```bash
npm install
npm run dev     # dev server with hot reload
npm run start   # run without reload
npm run build   # compile to dist/
npm run lint    # ESLint
```

The server starts on http://localhost:3000.

## Authentication

Register via `/signup`, log in via `/signin` and get a token valid for 7 days.
Send it with every other request:

```
Authorization: Bearer <token>
```

## Routes

| Method | Route | Description |
|---|---|---|
| POST | `/signup` | Register (`email`, `password`; optional `name`, `about`, `avatar`) |
| POST | `/signin` | Log in, returns `{ token }` |
| GET | `/users` | All users |
| GET | `/users/me` | Current user |
| GET | `/users/:userId` | User by id |
| PATCH | `/users/me` | Update `name` and `about` |
| PATCH | `/users/me/avatar` | Update `avatar` |
| GET | `/cards` | All cards |
| POST | `/cards` | Create a card (`name`, `link`) |
| DELETE | `/cards/:cardId` | Delete your own card |
| PUT | `/cards/:cardId/likes` | Like a card |
| DELETE | `/cards/:cardId/likes` | Remove a like |

All routes except `/signup` and `/signin` require a token.

## Errors

| Code | When |
|---|---|
| 400 | Invalid request data or id |
| 401 | Wrong email/password, missing or invalid token |
| 403 | Deleting someone else's card |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Unexpected server error |

## Logs

Requests are written to `request.log`, errors to `error.log` (JSON, not tracked by git).