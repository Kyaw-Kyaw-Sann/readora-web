# Readora Next.js API Documentation

This document contains only the APIs needed for the **Readora Next.js project**:

- Admin Dashboard
- Landing Page

It intentionally excludes mobile-only APIs such as favorites, reading/listening progress, personal library, user review creation, and similar endpoints.

---

# 1. Common API Structure

## Base URL

```text
http://localhost:8080
```

## Protected Admin APIs

```http
Authorization: Bearer <accessToken>
```

## Common Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Pagination Structure

```json
{
  "content": [],
  "last": true,
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

---

# 2. Admin Authentication

## Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<access-token>",
    "refreshToken": "<refresh-token>",
    "user": {
      "id": 2,
      "name": "Admin",
      "email": "admin@example.com",
      "provider": "LOCAL",
      "emailVerified": true,
      "role": "ADMIN"
    }
  }
}
```

Next.js should verify:

```text
user.role === "ADMIN"
```

---

## Refresh Access Token

```http
POST /api/auth/refresh
Content-Type: application/json
```

Request:

```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "<new-access-token>"
  }
}
```

---

## Logout

```http
POST /api/auth/logout
Content-Type: application/json
```

Request:

```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

# 3. Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "users": {
      "total": 4,
      "verified": 2,
      "unverified": 2,
      "activePremium": 2
    },
    "books": {
      "total": 6,
      "published": 3,
      "draft": 2,
      "archived": 1,
      "free": 5,
      "premium": 1
    },
    "reviews": {
      "total": 1,
      "averageRating": 2.0
    },
    "subscriptions": {
      "total": 6,
      "active": 2,
      "expired": 0,
      "cancelled": 4,
      "monthly": 5,
      "yearly": 1
    }
  }
}
```

The final dashboard scope also includes:

- Top 5 popular books
- 5 recently added books

These can use:

```http
GET /api/books/popular
GET /api/books/new
```

---

# 4. Categories

## Get Categories

```http
GET /api/categories
```

Response:

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 2,
      "name": "Programming",
      "slug": "programming",
      "description": "Programming and software development books",
      "active": true
    }
  ]
}
```

---

## Get Category

```http
GET /api/categories/{id}
```

Response:

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 2,
    "name": "Programming",
    "slug": "programming",
    "description": "Programming and software development books",
    "active": true
  }
}
```

---

## Create Category

```http
POST /api/admin/categories
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "name": "Science Fiction",
  "description": "Books exploring futuristic and speculative scientific concepts."
}
```

Response:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 4,
    "name": "Science Fiction",
    "slug": "science-fiction",
    "description": "Books exploring futuristic and speculative scientific concepts.",
    "active": true
  }
}
```

---

## Update Category

```http
PUT /api/admin/categories/{id}
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:

```json
{
  "name": "Sci-Fi & Fantasy",
  "description": "Books in the science fiction and fantasy genres.",
  "active": true
}
```

Response:

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 4,
    "name": "Sci-Fi & Fantasy",
    "slug": "sci-fi-fantasy",
    "description": "Books in the science fiction and fantasy genres.",
    "active": true
  }
}
```

---

## Delete / Deactivate Category

```http
DELETE /api/admin/categories/{id}
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "success": true,
  "message": "Category deactivated successfully",
  "data": null
}
```

---

# 5. Admin Books

## Get Admin Books

```http
GET /api/admin/books
Authorization: Bearer <accessToken>
```

Supported query params:

```text
search
status
accessType
categoryId
page
size
```

Example:

```http
GET /api/admin/books?search=spring&status=PUBLISHED&accessType=PREMIUM&categoryId=2&page=0&size=10
```

Expected pagination structure:

```json
{
  "success": true,
  "message": "...",
  "data": {
    "content": [],
    "last": true,
    "page": 0,
    "size": 10,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

The PDF does not show the complete example response for this endpoint.

---

# 6. Create Book

```http
POST /api/admin/books
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Multipart parts:

```text
request → JSON text
cover   → File optional
pdf     → File optional
audio   → File optional
```

`request` JSON:

```json
{
  "title": "Demo Book",
  "description": "A demo draft book",
  "isbn": "9780000000001",
  "language": "English",
  "publicationDate": "2024-01-01",
  "author": "Demo Author",
  "pageCount": 200,
  "audioDurationSeconds": null,
  "accessType": "FREE",
  "categoryIds": [1, 2]
}
```

Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 4,
    "title": "Java Fundamentals",
    "description": "A beginner-friendly guide to Java programming fundamentals.",
    "isbn": "9781000000001",
    "language": "English",
    "publicationDate": "2024-01-15",
    "author": "Michael Turner",
    "coverUrl": "https://res.cloudinary.com/...",
    "pdfUrl": "https://res.cloudinary.com/...",
    "audioUrl": null,
    "pageCount": 220,
    "audioDurationSeconds": null,
    "accessType": "FREE",
    "status": "DRAFT",
    "viewCount": 0,
    "categories": [
      {
        "id": 1,
        "name": "Technology",
        "slug": "technology",
        "description": "Books about modern technology",
        "active": true
      }
    ],
    "createdAt": "2026-08-27T11:51:15.857003",
    "updatedAt": "2026-08-27T11:51:15.857003"
  }
}
```

---

# 7. Update Book

```http
PUT /api/admin/books/{id}
Authorization: Bearer <accessToken>
```

Used to update:

- metadata
- files
- categories

The PDF lists this endpoint but does not provide the exact request/response example.

Confirm the actual multipart structure in Swagger before implementation.

```text
http://localhost:8080/swagger-ui.html
```

---

# 8. Publish Book

```http
PUT /api/admin/books/{id}/publish
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "success": true,
  "message": "Book published successfully",
  "data": {
    "id": 4,
    "title": "Java Fundamentals",
    "author": "Michael Turner",
    "accessType": "FREE",
    "status": "PUBLISHED",
    "categories": [],
    "createdAt": "2026-08-27T11:51:15.857003",
    "updatedAt": "2026-08-27T11:51:15.857003"
  }
}
```

The actual response contains the full book object.

---

# 9. Archive Book

```http
PUT /api/admin/books/{id}/archive
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "success": true,
  "message": "Book archived successfully",
  "data": {
    "id": 1,
    "title": "Demo Book",
    "accessType": "FREE",
    "status": "ARCHIVED",
    "categories": [],
    "createdAt": "2026-08-26T23:18:50.729688",
    "updatedAt": "2026-08-26T23:18:50.729688"
  }
}
```

---

# 10. Delete Book

The project business scope states that Admin can delete books.

However, the PDF API documentation does not show the exact delete-book endpoint or response example.

Confirm it in Swagger before implementing it in Next.js.

---

# 11. Admin Users

## Get Users

```http
GET /api/admin/users
Authorization: Bearer <accessToken>
```

Query params:

```text
search
verified
premium
page
size
```

Example:

```http
GET /api/admin/users?search=john&verified=true&premium=true&page=0&size=20
```

Response:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "content": [
      {
        "id": 4,
        "name": "John Updated",
        "email": "john@example.com",
        "profileImageUrl": null,
        "provider": "LOCAL",
        "emailVerified": true,
        "role": "USER",
        "premiumActive": true,
        "subscriptionPlan": "MONTHLY",
        "subscriptionStatus": "ACTIVE",
        "createdAt": "2026-08-26T20:40:55.133295"
      }
    ],
    "last": true,
    "page": 0,
    "size": 20,
    "totalElements": 4,
    "totalPages": 1
  }
}
```

---

## Get User Details

```http
GET /api/admin/users/{id}
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "id": 2,
    "name": "Aung Aung",
    "email": "user@example.com",
    "profileImageUrl": null,
    "provider": "LOCAL",
    "emailVerified": true,
    "role": "USER",
    "interests": [
      "Technology"
    ],
    "premiumActive": true,
    "subscription": {
      "id": 3,
      "plan": "MONTHLY",
      "status": "ACTIVE",
      "startedAt": "2026-08-26T21:38:14.292885",
      "expiresAt": "2026-09-26T21:38:14.292885",
      "cancelledAt": null
    },
    "createdAt": "2026-08-19T22:54:52.500836",
    "updatedAt": "2026-08-26T21:29:01.917422"
  }
}
```

---

# 12. Admin Reviews

## Get Reviews

```http
GET /api/admin/reviews
Authorization: Bearer <accessToken>
```

Query params:

```text
search
rating
page
size
```

Example:

```http
GET /api/admin/reviews?search=java&rating=5&page=0&size=20
```

Response:

```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "content": [
      {
        "id": 4,
        "user": {
          "id": 2,
          "name": "Aung Aung",
          "email": "user@example.com",
          "profileImageUrl": null
        },
        "book": {
          "id": 5,
          "title": "Atomic Habits Audio Guide",
          "author": "Daniel Brooks",
          "coverUrl": "https://res.cloudinary.com/..."
        },
        "rating": 2,
        "comment": "It should have better conclusion.",
        "createdAt": "2026-08-27T21:56:00.965515",
        "updatedAt": "2026-08-27T21:56:00.965515"
      }
    ],
    "last": true,
    "page": 0,
    "size": 20,
    "totalElements": 2,
    "totalPages": 1
  }
}
```

---

## Delete Review

```http
DELETE /api/admin/reviews/{reviewId}
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

Admin cannot edit review content.

---

# 13. Admin Subscriptions

```http
GET /api/admin/subscriptions
Authorization: Bearer <accessToken>
```

Query params:

```text
search
status
plan
page
size
```

Example:

```http
GET /api/admin/subscriptions?search=john&status=ACTIVE&plan=YEARLY&page=0&size=5
```

Expected UI data:

```text
User
Plan
Status
Started At
Expires At
Cancelled At
```

The PDF does not provide the full JSON response example for this endpoint.

Current domain values:

```text
Plan:
MONTHLY
YEARLY

Status:
ACTIVE
EXPIRED
CANCELLED
```

---

# 14. Landing Page — Popular Books

```http
GET /api/books/popular
```

Use for:

```text
Popular on Readora
```

Book object structure:

```json
{
  "id": 6,
  "title": "Advanced Software Architecture",
  "author": "Sarah Mitchell",
  "coverUrl": "https://res.cloudinary.com/...",
  "accessType": "PREMIUM",
  "viewCount": 2,
  "categories": [
    {
      "id": 2,
      "name": "Programming",
      "slug": "programming",
      "description": "Programming and software development books",
      "active": true
    }
  ],
  "createdAt": "2026-08-27T11:56:05.299798"
}
```

The PDF does not show the exact wrapper response example for `/api/books/popular`.

---

# 15. Landing Page — New Books

```http
GET /api/books/new
```

Use for:

```text
Recently Added
Featured Books
```

The exact response wrapper is not shown in the PDF.

---

# 16. Optional Landing Book Listing

Use this only if the Landing Page includes an actual `Explore Books` listing.

```http
GET /api/books
```

Supported params:

```text
search
categoryId
accessType
sort
page
size
```

Examples:

```http
GET /api/books?page=0&size=5

GET /api/books?accessType=FREE

GET /api/books?sort=NEWEST

GET /api/books?search=java&categoryId=2&accessType=PREMIUM&sort=POPULAR&page=0&size=10
```

Sorting scope:

```text
POPULAR
NEWEST
TITLE A-Z
TITLE Z-A
```

---

# Required API List for the Next.js Project

```text
AUTH
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

DASHBOARD
GET    /api/admin/dashboard

CATEGORIES
GET    /api/categories
GET    /api/categories/{id}
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

BOOKS
GET    /api/admin/books
POST   /api/admin/books
PUT    /api/admin/books/{id}
PUT    /api/admin/books/{id}/publish
PUT    /api/admin/books/{id}/archive

USERS
GET    /api/admin/users
GET    /api/admin/users/{id}

REVIEWS
GET    /api/admin/reviews
DELETE /api/admin/reviews/{reviewId}

SUBSCRIPTIONS
GET    /api/admin/subscriptions

LANDING
GET    /api/books/popular
GET    /api/books/new
GET    /api/books              optional
```

---

# APIs Not Needed for This Next.js Scope

Do not add these to the Next.js API layer unless the scope changes:

- Register
- Google auth
- Email verification
- Resend verification
- Forgot/reset password
- User profile
- User interests
- Favorites
- Reading progress
- Listening progress
- Personal library
- User subscription actions
- Recommendation endpoint
- PDF/audio access
- User review creation/edit/delete

The current Next.js scope is:

- Admin Login
- Admin Dashboard
- Admin Management
- Landing / Marketing Page

---

# Swagger Note

The PDF does not provide exact request/response examples for some endpoints, especially:

- `PUT /api/admin/books/{id}`
- delete-book endpoint
- `GET /api/admin/subscriptions`
- `GET /api/books/popular`
- `GET /api/books/new`

Before implementing those parts, verify the current backend contract in Swagger:

```text
http://localhost:8080/swagger-ui.html
```
