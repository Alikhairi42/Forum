## Overview

NexusForum is a lightweight full-stack forum prototype designed to demonstrate a clean separation between frontend and backend responsibilities while keeping the development experience simple and beginner-friendly. The frontend is a polished single-page application with animated UI and route-based navigation, while the backend exposes a REST API for authentication, post management, comments, and reactions.

## Purpose

The project was created to provide:

- a full-stack forum example with JWT-based session handling
- a simple and practical CRUD flow for community content
- a reusable structure that can be extended into a larger social platform
- a portfolio-ready implementation that demonstrates both frontend and backend engineering

## Features

The current codebase implements the following features:

- User registration with email uniqueness validation
- User login with password verification
- JWT authentication for protected routes
- Create, read, update, and delete posts
- Create, read, update, and delete comments
- Toggle reactions on posts using `LIKE` and `DISLIKE`
- Live post feed sorted by newest first
- Responsive React UI with animated transitions
- API base URL configuration through environment variables

## Screenshots

> Placeholder screenshots for the project homepage, login page, and post feed.

<p align="center">
  <img src="https://via.placeholder.com/1200x700?text=Homepage+Screenshot+Placeholder" alt="Homepage screenshot placeholder" width="1200" />
</p>

<p align="center">
  <img src="https://via.placeholder.com/1200x700?text=Login+Page+Screenshot+Placeholder" alt="Login screenshot placeholder" width="1200" />
</p>

<p align="center">
  <img src="https://via.placeholder.com/1200x700?text=Forum+Feed+Screenshot+Placeholder" alt="Forum feed screenshot placeholder" width="1200" />
</p>

## Architecture

The application follows a simple three-layer architecture:

1. Frontend
   - Built with React, TypeScript, and Vite
   - Handles page rendering, authentication state, and API calls
   - Uses animated components and route-based navigation

2. Backend
   - Built with Express.js
   - Exposes REST endpoints for auth, posts, comments, and reactions
   - Validates requests and protects sensitive routes using JWT middleware

3. Data Layer
   - Prisma is used as the ORM layer
   - MySQL is the configured datasource
   - Prisma schema defines the `User`, `Post`, `Comment`, and `React` models

### Request flow

```text
React frontend -> Axios API client -> Express backend -> Prisma ORM -> MySQL database
```

## Project Structure

```text
forum/
├── README.md
├── forum-backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   └── views/
└── forum-frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
```

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcryptjs
- dotenv
- CORS
- Nodemon

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- Framer Motion
- lucide-react
- Tailwind CSS (via Vite plugin)

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js 18+ or newer
- npm or yarn
- MySQL server
- Git

## Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

## Installation

### Backend dependencies

```bash
cd forum-backend
npm install
```

### Frontend dependencies

```bash
cd ../forum-frontend
npm install
```

## Environment Configuration

### Backend `.env`

A backend `.env` file is already present in the repository with sample values:

```env
PORT=5000
JWT_SECRET=1234ali
DATABASE_URL="mysql://root:1234@localhost:3306/forum_db"
```

Important notes:

- Replace the values with your own local or deployment-safe secrets.
- `DATABASE_URL` must point to a valid MySQL instance.
- `JWT_SECRET` should be long and unique in production.

### Frontend `.env`

The frontend reads an optional API URL from `VITE_API_URL`:

```env
VITE_API_URL=http://localhost:5000/api
```

If this variable is not provided, the frontend defaults to `http://localhost:5000/api`.

## Database Configuration

The project uses Prisma with MySQL.

### Schema overview

The schema currently defines the following models:

- `User`
- `Post`
- `Comment`
- `React`

The Prisma datasource is configured in `forum-backend/prisma/schema.prisma`.

### Initializing the database

1. Create a MySQL database, for example `forum_db`.
2. Update the `DATABASE_URL` value in the backend `.env` file.
3. Run Prisma migrations:

```bash
cd forum-backend
npx prisma migrate deploy
```

If you are developing locally and want to generate Prisma client files:

```bash
npx prisma generate
```

## Running the Project

### Start the backend

```bash
cd forum-backend
npm run dev
```

The backend runs by default on port `5000` unless changed in `.env`.

### Start the frontend

```bash
cd forum-frontend
npm run dev
```

The frontend Vite dev server typically runs on:

```text
http://localhost:5173
```

## Production Build

### Frontend build

```bash
cd forum-frontend
npm run build
```

This generates a production build in the `dist/` folder.

### Backend build

The backend does not currently define a separate build step. The app is started directly with Node.js.

## Tests

No automated test suite is currently present in the repository. If you add tests later, the recommended workflow would be:

```bash
npm test
```

> Current status: no test runner is configured in the existing package manifests.

## REST API Reference

The backend exposes the following routes:

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate a user and receive a JWT | No |
| `GET` | `/api/posts` | Get all posts ordered by newest first | No |
| `POST` | `/api/posts` | Create a post | Yes |
| `PUT` | `/api/posts/:id` | Update a post | Yes |
| `DELETE` | `/api/posts/:id` | Delete a post | Yes |
| `POST` | `/api/comments` | Create a comment | Yes |
| `GET` | `/api/comments/:postId` | Get comments for a post | No |
| `PUT` | `/api/comments/:commentId` | Update a comment | Yes |
| `DELETE` | `/api/comments/:commentId` | Delete a comment | Yes |
| `POST` | `/api/reacts` | Toggle a like/dislike reaction | Yes |
| `GET` | `/api/reacts/:postId` | Get like/dislike counts for a post | No |

## Authentication

Authentication is implemented using JSON Web Tokens.

### How it works

- A user logs in through `/api/auth/login`.
- The server returns a token in the response body.
- The frontend stores the token in `localStorage`.
- Protected requests send the token in the `Authorization` header as:

```http
Authorization: Bearer <token>
```

### Middleware behavior

The backend middleware checks for a valid token before allowing access to protected routes. If the token is missing or invalid, the API responds with an authentication error.

## Deployment

The project is currently structured for a local development workflow, but it can be deployed to any Node.js-capable host.

### Suggested deployment approach

1. Deploy the backend to a server or container with Node.js support.
2. Provide a production MySQL database.
3. Set `PORT`, `JWT_SECRET`, and `DATABASE_URL` in the deployment environment.
4. Deploy the frontend as a static site or via a reverse proxy to the Vite build output.

### Example production idea

- Backend: Node.js server on a VM, container, or PaaS
- Frontend: static hosting for the Vite build output
- Database: managed MySQL service

> Production hosting details are not hard-coded in the repository and should be configured according to your deployment environment.

## Troubleshooting

### Common issues

#### 1. `Database connection failed`

- Verify that MySQL is running.
- Confirm the `DATABASE_URL` value is correct.
- Make sure the database exists before running Prisma migrations.

#### 2. `Invalid or expired token`

- Check whether the frontend is storing the JWT correctly.
- Ensure the request includes `Authorization: Bearer <token>`.
- Log in again if the token has expired.

#### 3. `Cannot add comment: Post not found`

- Confirm that the post ID supplied in the request exists.

#### 4. Frontend cannot reach backend

- Confirm the backend is running on port `5000`.
- Set `VITE_API_URL` correctly if you are not using the default value.

#### 5. Prisma client errors

```bash
cd forum-backend
npx prisma generate
```

## Contribution Guidelines

Contributions are welcome.

### How to contribute

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run relevant validation steps.
5. Open a pull request with a clear description.

### Recommended standards

- Keep commits focused and descriptive.
- Prefer small, reviewable changes.
- Follow existing project structure and naming conventions.
- Avoid adding unnecessary dependencies.

## Coding Standards

The existing codebase favors:

- clear route/controller separation
- minimal but readable business logic
- consistent Express controller organization
- straightforward JavaScript/TypeScript formatting
- environment-based configuration instead of hard-coded secrets

Suggested future standards:

- add ESLint/Prettier configuration
- add TypeScript types for backend shared contracts
- add consistent error response helpers

## Project Roadmap

### Current state

- user authentication
- post CRUD
- comments
- reactions
- responsive frontend UI

### Planned enhancements

- edit comments directly from the UI
- user profile pages
- search and filtering for posts
- pagination and sorting improvements
- automated tests
- documentation and API versioning
- admin dashboard

## FAQ

### What is the app for?

It is a full-stack forum application for posting and discussing community ideas.

### Is authentication implemented?

Yes. JWT authentication is used for protected routes.

### Which database is used?

MySQL is configured via Prisma.

### Is there a testing setup?

Not at the moment. The repository currently does not include a test runner or test suite.

## License

The repository currently declares the package license as `ISC` in the backend `package.json`. If you intend to publish the project publicly, it is recommended to add an explicit `LICENSE` file to the repository root and align the badge and documentation with that choice.

## Contact

For questions, collaboration, or feature requests, please open an issue in the repository or reach out through the project maintainer's preferred contact channel.

## Acknowledgements

This project uses the following ecosystem tools and libraries:

- Express.js
- Prisma ORM
- React
- Vite
- Tailwind CSS
- Framer Motion
- MySQL
- JWT and bcryptjs

---

Built with care for learning, portfolio presentation, and practical full-stack development.
