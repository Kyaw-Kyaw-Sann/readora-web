# Readora Web

Readora Web is the public marketing site and protected administration dashboard for the Readora digital library platform. It is a Next.js client for an existing Spring Boot REST API and does not duplicate backend business rules.

The public experience introduces Readora's reading and audiobook features, displays live popular-book data, and explains the demo Free and Premium plans. The admin area provides authenticated tools for managing the library and reviewing platform data.

## Features

### Public website

- Responsive landing page with Readora's cream, amber, and editorial visual identity
- Popular books loaded from the backend
- Product features, Free vs Premium comparison, About, Contact, and download calls to action
- Light and dark themes with system-theme support and persisted preference
- Loading, empty, and error states for public API data

### Admin dashboard

- ADMIN-only login and protected `/admin/*` routes
- HttpOnly cookie-based access and refresh token handling
- Automatic access-token refresh and logout flow
- Dashboard statistics, popular books, and recently added books
- Category creation, editing, and deactivation
- Book listing, live search/filtering, pagination, creation, and full editing
- Cover, PDF, and audio upload/replacement/removal support
- Read-only user details and subscription management
- Review viewing, filtering, and deletion
- Responsive desktop sidebar and mobile navigation

> The Spring Boot backend remains responsible for authentication, authorization, subscriptions, premium access, validation, file storage, and other business rules.

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 and shadcn/ui
- TanStack Query
- React Hook Form and Zod
- next-themes
- Sonner
- Lucide React
- date-fns

## Prerequisites

Before running the project, install or prepare:

- [Node.js](https://nodejs.org/) 20.9 or newer
- npm
- A running Readora Spring Boot API
- A backend ADMIN account for dashboard access

The default frontend and backend addresses are:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080
```

## Clone and set up

1. Clone the repository:

```bash
git clone https://github.com/Kyaw-Kyaw-Sann/readora-web.git
cd readora-web
```

2. Install the exact dependency versions from `package-lock.json`:

```bash
npm ci
```

3. Create the local environment file.

macOS or Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

4. Confirm that `.env.local` points to the Spring Boot API:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

5. Start the Spring Boot backend on the configured URL before opening API-driven pages.

## Run in development

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The admin login is available at [http://localhost:3000/admin/login](http://localhost:3000/admin/login). Sign in with a backend user whose role is `ADMIN`.

## Production build

Validate and build the application:

```bash
npm run lint
npm run build
```

Run the production server after a successful build:

```bash
npm start
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run lint` | Run ESLint |
| `npm run build` | Create and validate an optimized production build |
| `npm start` | Serve the production build |

## Main routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Readora landing page |
| `/admin/login` | Public | Administrator login |
| `/admin` | ADMIN | Dashboard overview |
| `/admin/books` | ADMIN | Book list, search, filters, and pagination |
| `/admin/books/new` | ADMIN | Create a book |
| `/admin/books/[id]/edit` | ADMIN | Edit a book and its media |
| `/admin/categories` | ADMIN | Category management |
| `/admin/users` | ADMIN | User list and filters |
| `/admin/users/[id]` | ADMIN | Read-only user details |
| `/admin/reviews` | ADMIN | Review moderation |
| `/admin/subscriptions` | ADMIN | Read-only subscription list |

## Project structure

```text
app/
├── (marketing)/          # Public landing experience
├── admin/                # Login and protected admin routes
├── api/                  # Next.js proxy route handlers
├── globals.css           # Readora design tokens and global styles
└── providers.tsx         # Query and theme providers

components/
├── admin/                # Admin shell and feature components
├── landing/              # Landing-page sections
├── shared/               # Shared brand/theme components
└── ui/                   # Reusable UI primitives

hooks/                    # TanStack Query hooks
lib/
├── api/                  # API clients and request helpers
├── auth/                 # Session, token, and authorized request logic
├── query/                # Query client and key configuration
└── validations/          # Zod schemas

types/                    # Backend-aligned TypeScript domain models
public/                   # Static images and Readora branding
```

## Backend and API notes

- Most backend responses use `{ success, message, data }`.
- Admin browser requests go through Next.js route handlers under `app/api`.
- Access and refresh tokens are stored in HttpOnly cookies, not local storage.
- Protected routes verify admin access against the backend.
- Book create/update requests use `multipart/form-data` with an `application/json` `request` part.
- Uploaded book media is served from the backend's configured Cloudinary account.

See [API.md](./API.md) for the documented backend endpoints and [createupdate.md](./createupdate.md) for the current Book Create/Edit multipart contract.

## Troubleshooting

### The landing page cannot load books

- Confirm the Spring Boot backend is running.
- Confirm `NEXT_PUBLIC_API_URL` is correct.
- Test the public endpoints such as `/api/books/popular` on the backend.

### Admin login redirects back to the login page

- Confirm the account has the `ADMIN` role.
- Confirm the backend authentication endpoints are reachable.
- Clear old Readora cookies if the backend token format or signing configuration changed.

### Remote book covers do not appear

- Confirm the backend returns a valid `coverUrl`.
- If the Cloudinary host or path changes, update `images.remotePatterns` in `next.config.ts`.

### Production build cannot download fonts

The application uses `next/font` with Google-hosted Geist fonts during the build. Ensure the build environment can reach Google Fonts, or replace them with self-hosted font files.

## Current scope

Readora Web is the presentation layer for the existing Readora backend. It intentionally does not include a real payment gateway, AI/ML recommendations, offline media, DRM, or a separate Next.js authentication authority. Premium pricing and payment messaging in the landing page are demo-only.
