
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Interaction Rules

- The user may ask questions in English, but always respond in Myanmar language.

- Never add, update, remove, rename, move, fix, or modify any code, file, folder, configuration, dependency, or project structure without explicit permission.

- Do not make any project changes unless the user explicitly says the exact phrase:

  "Build Now"

- Before the phrase "Build Now" is given, only:
  - discuss
  - explain
  - review
  - plan
  - suggest
  - provide commands or code snippets without applying them

- When the user says "Build Now", you may make only the changes that were discussed or explicitly requested.

- Do not interpret similar phrases such as "go ahead", "continue", "start", "do it", or "proceed" as permission to modify the project.

- If "Build Now" has not been explicitly provided, do not modify the project.

# AGENTS.md — Readora Web (Next.js)

## 1. Purpose

This repository contains the **Readora web application**, built with **Next.js**.

It is a **single Next.js project** that includes:

1. A public **Landing / Marketing website**
2. A protected **Admin Dashboard**

The backend already exists as a **Spring Boot REST API**.  
Do **not** rebuild backend business logic, authentication, authorization, subscriptions, recommendations, or book-access rules inside Next.js.

The Next.js app should act as a web client and presentation layer over the existing Spring Boot backend.

---

## 2. Product Summary

Readora is a personalized digital library application where users can:

- Read PDF books
- Listen to audiobooks
- Resume from saved reading/listening positions
- Favorite books
- Receive personalized book recommendations
- Review and rate books
- Access premium books with an active premium subscription

The mobile app is built with React Native.  
This repository is only for:

- Next.js Landing Page
- Next.js Admin Dashboard

---

## 3. Existing System Architecture

```text
React Native Mobile App
        │
        ▼
Spring Boot REST API
        │
        ├── PostgreSQL
        ├── Cloudinary
        └── Email Service

Next.js Web App
├── Landing Page
└── Admin Dashboard
        │
        ▼
Spring Boot REST API
```

Frontend web must reuse the same backend APIs as the mobile app whenever applicable.

---

## 4. Required Web Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- TanStack Query
- React Hook Form
- Zod
- next-themes
- sonner
- date-fns

Charts may use:

- Recharts

Do not add heavy state-management libraries unless there is a clear need.

Prefer:

- Server Components for public/mostly-static marketing content
- Client Components only where interaction is required
- TanStack Query for admin API-heavy pages

---

## 5. Project Structure

Keep Landing and Admin clearly separated.

Recommended structure:

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   └── contact/
│
├── admin/
│   ├── login/
│   │   └── page.tsx
│   │
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── books/
│       ├── categories/
│       ├── users/
│       ├── reviews/
│       └── subscriptions/
│
├── layout.tsx
├── providers.tsx
└── globals.css

components/
├── ui/
├── shared/
├── landing/
└── admin/

lib/
├── api/
├── auth/
├── query/
├── validations/
└── utils/

types/
hooks/
config/
```

Rules:

- Landing-specific components belong in `components/landing`
- Admin-specific components belong in `components/admin`
- Reusable primitives belong in `components/ui`
- Reusable brand/shared components belong in `components/shared`
- Do not place unrelated business logic inside page components

---

## 6. Route Plan

Public:

```text
/
 /about
 /contact
```

Admin:

```text
/admin/login
/admin
/admin/books
/admin/books/new
/admin/books/[id]/edit
/admin/categories
/admin/users
/admin/users/[id]
/admin/reviews
/admin/subscriptions
```

Rules:

- `/admin/login` is public
- `/admin/*` is protected
- only users with role `ADMIN` may access the dashboard
- admin pages should be `noindex`

---

## 7. Readora Visual Identity

The web UI must visually match the latest Readora mobile UI references.

### Brand direction

Use:

- Warm cream / ivory backgrounds
- Gold / amber primary accent
- Dark brown / charcoal text
- Soft beige borders
- Rounded cards
- Soft shadows
- Calm, premium, book-focused visual language

Do **not** introduce a new blue or indigo brand theme unless explicitly requested later.

### Theme behavior

Support:

- Light
- Dark
- System

Use `next-themes`.

Default may be light.

Keep brand identity recognizable in both themes.

### Color semantics

Use consistent semantic roles:

- Primary action: Readora gold / amber
- Premium: rich gold / amber treatment
- Success: muted green
- Warning: amber
- Danger/destructive: red
- Neutral/draft: warm gray
- Published: success
- Archived: muted/neutral warning treatment

Centralize colors through CSS variables/tokens.

Do not scatter hard-coded colors across components.

---

## 8. Typography

Use a readable combination:

- Serif or editorial-style font for major landing headings / brand moments
- Clean sans-serif font for admin UI and body text

Keep admin UI highly readable.

Use consistent:

- spacing
- radius
- shadow
- font sizes
- card styling
- button sizes
- badge styles

---

## 9. Authentication Strategy

### Important

Do **not** build a separate full authentication system in Next.js.

The Spring Boot backend is the authentication authority.

Existing backend auth includes:

- traditional register
- traditional login
- Google authentication
- email verification
- resend verification
- forgot password
- reset password
- JWT access token
- refresh token
- logout
- role-based authorization

For this web project, implement only what the Admin Dashboard needs:

- admin login
- session/token handling
- refresh flow
- logout
- protected routes
- role validation
- 401/403 handling

### Admin login flow

```text
/admin/login
   ↓
POST /api/auth/login
   ↓
receive accessToken + refreshToken + user
   ↓
verify user.role === "ADMIN"
   ↓
create secure session
   ↓
redirect /admin
```

If role is not `ADMIN`, deny admin access.

### Security rules

Frontend route protection is for UX.

The backend remains the real security authority.

Never rely only on a client-side role check.

Prefer secure HttpOnly cookies for session/token handling where practical.

Avoid storing refresh tokens in `localStorage`.

Handle:

- 401 Unauthorized
- 403 Forbidden
- expired access token
- failed refresh
- logout
- redirect to login

---

## 10. Backend Roles and Subscription Rules

Roles:

```text
USER
ADMIN
```

Premium is **not** a role.

Subscription state is separate:

```text
NONE
ACTIVE
EXPIRED
CANCELLED
```

Plans:

```text
MONTHLY
YEARLY
```

Only `ACTIVE` subscription grants premium-book access.

The backend must remain responsible for enforcing premium access.

---

## 11. Core Backend API Response Shape

Most endpoints follow:

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

Paginated responses typically contain:

```ts
interface PaginatedResponse<T> {
  content: T[];
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
```

Match backend response DTOs instead of inventing alternate client formats.

---

## 12. Main Backend APIs Used by Next.js

### Authentication

```text
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

Other auth endpoints exist but are not required for the admin dashboard unless requested.

---

### Categories

Public:

```text
GET /api/categories
GET /api/categories/{id}
```

Admin:

```text
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

---

### Books

Admin:

```text
POST /api/admin/books
PUT  /api/admin/books/{id}

PUT /api/admin/books/{id}/publish
PUT /api/admin/books/{id}/archive

GET /api/admin/books
```

Supported admin book filters include:

```text
search
status
accessType
categoryId
page
size
```

Public book APIs include:

```text
GET /api/books
GET /api/books/{id}
GET /api/books/premium
GET /api/books/new
GET /api/books/popular
```

The landing page may use public book endpoints for real featured/popular/new data.

---

### Users

```text
GET /api/admin/users
GET /api/admin/users/{id}
```

Supported filters:

```text
search
verified
premium
page
size
```

Admin scope is primarily viewing/searching/filtering users.

Do not invent edit/delete-user functionality unless the backend later supports and the project scope is updated.

---

### Reviews

```text
GET    /api/admin/reviews
DELETE /api/admin/reviews/{reviewId}
```

Supported filters include:

```text
search
rating
page
size
```

Admin may:

- view reviews
- search/filter reviews
- delete inappropriate reviews

Admin may **not edit user review content**.

---

### Subscriptions

```text
GET /api/admin/subscriptions
```

Supported filters include:

```text
search
status
plan
page
size
```

Subscription management is mainly read-only in the current scope.

---

### Dashboard

```text
GET /api/admin/dashboard
```

Dashboard data includes:

Users:

- total
- verified
- unverified
- activePremium

Books:

- total
- published
- draft
- archived
- free
- premium

Reviews:

- total
- averageRating

Subscriptions:

- total
- active
- expired
- cancelled
- monthly
- yearly

The final dashboard scope also includes:

- top 5 popular books
- 5 recently added books

Use existing endpoints or backend-supported data for those lists.

---

## 13. Book Domain Rules

Book statuses:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Book access types:

```text
FREE
PREMIUM
```

A book may contain:

- PDF only
- Audio only
- Both PDF and Audio

A book may belong to multiple categories.

Book metadata includes:

- title
- description
- ISBN
- language
- publication date
- author
- cover
- PDF
- audio
- page count
- audio duration
- access type
- status
- categories
- created date
- updated date

Cloudinary stores:

- cover images
- PDFs
- audio files

PostgreSQL stores their URLs and public IDs.

---

## 14. Admin Dashboard UX

Desktop-first admin interface.

Use:

- sidebar navigation
- top header
- breadcrumbs
- content container
- cards
- tables
- filters
- dialogs
- dropdown actions
- pagination

Responsive behavior:

- desktop: fixed sidebar
- tablet: collapsible sidebar
- mobile: drawer sidebar
- tables may horizontally scroll on small screens

Sidebar:

```text
Overview
Books
Categories
Users
Reviews
Subscriptions

Theme
Logout
```

---

## 15. Admin Dashboard Page Requirements

Dashboard should show:

- Total Users
- Verified Users
- Premium Users
- Total Books
- Published Books
- Draft Books
- Free Books
- Premium Books
- Total Reviews
- Subscription stats
- Top 5 Popular Books
- 5 Recently Added Books

Use charts only when they improve clarity.

Do not force decorative charts where simple stat cards are better.

---

## 16. Category Management UX

Build categories before book creation because the book form depends on category selection.

Features:

- list categories
- create category
- edit category
- deactivate/delete category
- loading
- empty state
- error state
- confirmation dialog

Prefer dialogs for simple create/edit category forms.

---

## 17. Book Management UX

### Book list

Columns may include:

- cover
- title
- author
- access type
- status
- categories
- created date
- actions

Filters:

- search
- status
- access type
- category
- pagination

Actions:

- edit
- publish
- archive
- delete

### Create/Edit Book Form

Group fields into clear sections.

Basic Information:

- title
- author
- description
- ISBN
- language
- publication date

Content:

- cover
- PDF
- audio

Book Settings:

- page count
- audio duration
- categories
- access type

Publishing:

- draft/publish workflow where backend supports it

Use:

- React Hook Form
- Zod
- multipart/form-data where required
- file previews where useful
- upload/loading states
- destructive confirmations

---

## 18. User Management UX

User list should support:

- pagination
- search by name/email
- verified/unverified filter
- premium/normal filter

Useful columns:

- user
- email
- provider
- verified state
- subscription
- joined date
- actions/view

User detail page should show:

- profile
- email
- provider
- role
- verification
- interests
- subscription info
- created date
- updated date if available

Do not add unsupported admin mutation actions.

---

## 19. Review Management UX

List:

- reviewer
- related book
- rating
- comment
- created date
- actions

Features:

- search
- rating filter
- pagination
- view
- delete

Never implement admin edit for review content.

---

## 20. Subscription Management UX

List:

- user
- plan
- status
- started date
- expiration date
- cancelled date

Filters:

- search
- status
- plan
- pagination

Current project uses mock/demo payments only.

Do not invent real billing/refund/payment-gateway controls.

---

## 21. Landing Page Scope

Landing page should contain:

1. Navbar
2. Hero
3. Featured / Popular Books
4. Platform Features
5. Read Anywhere
6. Listen Anywhere
7. Personalized Recommendations
8. Free vs Premium
9. Download App
10. Final CTA
11. Footer

Optional supporting pages:

- About
- Contact

Use real public backend book data where helpful.

---

## 22. Landing Page Product Facts

Core selling points:

- Read books
- Listen to audiobooks
- Resume where the user left off
- Personalized recommendations
- Favorites
- Reading/listening progress
- Free and premium library access

Recommendation system uses:

- selected interests
- previously read categories
- favorite categories
- book popularity
- recently added books

Current scoring concept:

```text
Selected interest category match  +5
Previously read category match    +3
Favorite category match           +2
Popular book                      +1
New book                          +1
```

Do not claim AI/ML recommendations.

Recommendation system is rule-based.

Ratings/reviews are not used for recommendation scoring.

---

## 23. Free vs Premium Landing Content

Free users:

- access free published books
- reading/listening progress
- favorites
- recommendations
- other normal user features

Premium users:

- everything free users have
- access to all published premium books

Current demo pricing:

```text
Monthly: $4.99
Yearly:  $39.99
```

Payment is mock/demo only.

Do not represent it as a live production payment system.

---

## 24. Landing UX Direction

Landing page should feel:

- warm
- editorial
- calm
- premium
- book-focused
- modern but not overly corporate

Use mobile app screenshots as product previews where available.

Do not copy mobile layout literally.

Reuse:

- color language
- typography feel
- rounded shapes
- premium book aesthetic

Translate layout appropriately for desktop web.

---

## 25. Shared UX Requirements

Every API-driven screen should handle:

- loading
- empty state
- error state
- retry where appropriate
- success feedback
- destructive confirmation
- disabled state during mutation

Use Sonner or equivalent toast feedback for:

- create success
- update success
- delete success
- mutation failure

Do not use `alert()` for normal application UX.

---

## 26. Accessibility

Follow basic accessibility requirements:

- semantic HTML
- visible focus states
- keyboard navigation
- associated labels
- aria-label for icon-only controls
- accessible dialogs
- accessible tables
- sufficient contrast
- meaningful button text
- alt text for book covers/product screenshots where useful

---

## 27. SEO

Landing pages:

- title
- description
- OpenGraph metadata
- favicon
- sitemap
- robots configuration

Admin pages:

- noindex

Use Next.js metadata APIs.

---

## 28. Performance

Prefer:

- Server Components for marketing pages when possible
- Next/Image for optimized images
- image sizing
- lazy loading
- minimal client-side JavaScript
- TanStack Query caching on admin pages
- server-side/public fetching where it improves performance

Avoid unnecessary global client state.

---

## 29. Security

Never:

- expose backend secrets in `NEXT_PUBLIC_*`
- trust client-side role checks as real authorization
- place refresh tokens in insecure browser storage
- bypass backend access rules
- expose admin APIs without backend authorization

Backend must enforce:

- authentication
- email verification where required
- admin role
- premium access
- ownership of user-owned resources
- input validation

Next.js should respect backend HTTP status codes and display appropriate UX.

---

## 30. Error Handling Rules

Create consistent API error handling.

Expected cases:

- validation errors
- network failure
- 401 unauthorized
- 403 forbidden
- 404 not found
- 409 conflict if backend uses it
- 5xx server errors

Do not swallow errors silently.

Show user-friendly messages while preserving useful developer logs in development.

---

## 31. Query and Mutation Conventions

Use predictable TanStack Query keys.

Examples:

```ts
["dashboard"]
["categories"]
["books", filters]
["book", id]
["users", filters]
["user", id]
["reviews", filters]
["subscriptions", filters]
```

After mutations, invalidate only the relevant query keys.

Avoid broad refetching of unrelated data.

---

## 32. Form Conventions

Use:

- React Hook Form
- Zod
- shadcn form controls

Forms should include:

- validation messages near fields
- loading/disabled submit state
- server error handling
- reset behavior where appropriate
- confirmation before destructive actions

Do not duplicate validation logic unnecessarily.

---

## 33. Code Quality Rules

General:

- TypeScript strictness should be respected
- avoid `any`
- prefer small focused components
- prefer composition over giant page components
- extract repeated logic
- avoid premature abstraction
- use meaningful names
- keep API code separate from UI code
- keep validation schemas separate from page JSX where practical

Do not create speculative architecture that is not needed by the 23-phase plan.

---

## 34. Naming Conventions

Use:

- kebab-case for route folders/files where appropriate
- PascalCase for React components
- camelCase for variables/functions
- clear domain names for types

Examples:

```text
BookTable
BookForm
CategoryDialog
UserDetails
ReviewTable
SubscriptionTable
DashboardStatCard
```

---

## 35. Development Order — 23 Phases

Follow this order unless there is a clear dependency reason to adjust it.

### Phase 1 — Project Setup
- Next.js
- TypeScript
- Tailwind
- App Router
- ESLint
- Git

### Phase 2 — Dependencies & Base Tools
Install and configure:
- shadcn/ui
- lucide-react
- TanStack Query
- React Hook Form
- Zod
- next-themes
- sonner
- date-fns

### Phase 3 — Folder & Route Architecture
Create:
- marketing route group
- admin login
- protected admin route group
- components
- lib
- types
- hooks
- config

### Phase 4 — Readora Design System
Create:
- colors
- typography
- spacing
- radii
- shadows
- semantic tokens

Match current mobile Readora branding.

### Phase 5 — Theme System
Implement:
- Light
- Dark
- System
- Theme toggle
- Theme persistence

### Phase 6 — Shared UI Components
Prepare:
- Button
- Input
- Select
- Badge
- Card
- Dialog
- Dropdown
- Table
- Pagination
- Skeleton
- Empty State

### Phase 7 — API Foundation
Create:
- API base client
- environment configuration
- common errors
- request helpers

### Phase 8 — TypeScript Models
Add domain types:
- Auth
- User
- Book
- Category
- Review
- Subscription
- Dashboard
- Pagination

### Phase 9 — TanStack Query Setup
Configure:
- QueryClient
- provider
- query keys
- mutation conventions
- invalidation rules

### Phase 10 — Admin Authentication
Build:
- `/admin/login`
- Spring Boot login integration
- ADMIN role check
- logout
- refresh flow

### Phase 11 — Protected Admin Routes
Implement:
- route/session protection
- 401
- 403
- wrong-role handling
- expired session behavior

### Phase 12 — Admin Layout & Navigation
Build:
- sidebar
- header
- breadcrumbs
- profile
- theme switch
- responsive drawer

### Phase 13 — Admin Dashboard
Build:
- stat cards
- dashboard API integration
- book overview
- subscription overview
- top popular books
- recent books
- charts only where useful

### Phase 14 — Category Management
Implement:
- list
- create
- edit
- deactivate/delete
- validation
- loading/error states

### Phase 15 — Book Management
Implement:
- list
- search
- filters
- pagination
- create
- edit
- cover upload
- PDF upload
- audio upload
- categories
- FREE/PREMIUM

### Phase 16 — Book Status Actions
Implement:
- publish
- archive
- delete
- confirmation
- toast
- cache invalidation

### Phase 17 — User Management
Implement:
- list
- search
- filters
- pagination
- user detail
- interests
- subscription info

### Phase 18 — Review Management
Implement:
- list
- search
- rating filter
- pagination
- view
- delete
- no admin edit

### Phase 19 — Subscription Management
Implement:
- list
- search
- status filter
- plan filter
- pagination
- read-only detail display

### Phase 20 — Admin UX Polish
Add:
- skeletons
- empty states
- retries
- toasts
- confirmations
- responsive tables/forms
- dark-theme polish

### Phase 21 — Landing Page
Build:
- Navbar
- Hero
- Featured Books
- Features
- Read Anywhere
- Listen Anywhere
- Personalized Recommendations
- Free vs Premium
- Download App
- CTA
- Footer

### Phase 22 — Landing Extras & Quality
Build/finalize:
- About
- Contact
- SEO
- OpenGraph
- sitemap
- accessibility
- performance
- responsive design

### Phase 23 — Testing, Deployment & Portfolio Polish
Complete:
- auth testing
- CRUD testing
- filters
- theme testing
- production env
- CORS/cookie verification
- deployment
- README
- screenshots
- demo credentials
- architecture diagram

---

## 36. Testing Expectations

At minimum test:

Authentication:

- valid admin login
- invalid password
- USER tries admin login
- refresh token flow
- expired session
- logout

Categories:

- list
- create
- update
- delete/deactivate

Books:

- list
- search
- filters
- create
- edit
- cover/PDF/audio upload
- publish
- archive
- delete

Users:

- list
- search
- filters
- detail

Reviews:

- list
- filters
- delete

Subscriptions:

- list
- filters

Landing:

- public data loading
- responsive layout
- theme
- broken/empty data handling

---

## 37. Demo Data / Portfolio Context

Initial project planning targets roughly:

```text
40 books total
15 free
25 premium
8–10 categories
20 PDF-only books
15 PDF + Audio books
5 Audio-only books
```

Use public-domain or appropriately licensed demo content.

`FREE` / `PREMIUM` is an application access rule, not a copyright classification.

Keep source/license information where appropriate.

---

## 38. Explicit Non-Goals

Do not implement these unless the project scope changes:

- real payment gateway
- AI/ML recommendation engine
- recommendation based on ratings
- review ↔ reading-progress validation
- offline PDF/audio
- advanced background audio
- push notifications
- social feed
- chat/messaging
- DRM
- microservices
- Kubernetes
- complex admin permission system
- Redux architecture
- offline-first synchronization
- microfrontend architecture

---

## 39. Codex Working Rules

When working in this repository:

1. Follow the current phase before starting later phases.
2. Do not silently expand project scope.
3. Reuse existing backend endpoints and DTOs.
4. Do not duplicate Spring Boot business logic in Next.js.
5. Keep Landing and Admin visually related but structurally separate.
6. Maintain the latest warm cream + gold Readora brand direction.
7. Prefer reusable components without overengineering.
8. Preserve existing code unless a change is necessary.
9. Before large refactors, inspect current code and dependencies first.
10. Keep changes focused and phase-specific.
11. Do not invent backend endpoints.
12. If an API shape is unclear, inspect existing project docs/code before assuming.
13. Do not add unsupported admin actions.
14. Keep security-sensitive auth decisions server-oriented.
15. Make responsive behavior intentional.
16. Add loading, empty, and error states for API-driven features.
17. Prefer production-quality TypeScript over quick `any`-based fixes.
18. Keep UI consistent with the mobile Readora visual identity.
19. Avoid placeholder copy that contradicts actual Readora features.
20. Do not claim real payments or AI features.

---

## 40. Definition of Done

The Next.js project is complete when:

- Landing page is polished and responsive
- Admin login works securely with Spring Boot
- Admin routes are protected
- Dashboard displays backend data
- Category management works
- Book management works
- Book uploads work
- Publish/archive/delete actions work
- User management works
- Review management works
- Subscription management works
- Light/dark/system themes work
- Loading/error/empty states exist
- SEO is configured for public pages
- Admin pages are noindex
- Accessibility basics are covered
- Production environment works
- CORS/cookies/auth work after deployment
- README and portfolio screenshots are ready
- No out-of-scope features were added
