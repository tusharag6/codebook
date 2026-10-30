# Backend Engineering

Welcome to the **Backend Engineering** documentation. This series provides an in-depth, production-oriented guide to building scalable, secure, and robust server-side applications using **Node.js**, **Express.js**, and **MongoDB with Mongoose**.

---

## The Three Core Pillars of Backend Systems

Whenever you build or scale a backend service, you primarily handle three concerns:

1. **Data Management & Business Logic**: Modeling complex relationships, performing ACID transactions or atomic operations, running aggregation pipelines, and enforcing domain validation rules.
2. **File & Media Handling**: Handling multipart form data, streaming uploads, generating thumbnails, and integrating with cloud storage providers (e.g., Cloudinary, AWS S3).
3. **Third-Party Services & Integrations**: Interacting with external REST/gRPC APIs, handling webhooks, processing payments (Stripe/Razorpay), and orchestrating background tasks.

---

## High-Level Architecture

In modern full-stack web applications, the client and database never communicate directly. Instead, the backend acts as a secure intermediary and orchestrator:

```
+------------------+         HTTP/REST / JSON         +-------------------+
|  Client Device   | <==============================> |   Backend Server  |
| (Browser/Mobile) |                                  | (Express/Node.js) |
+------------------+                                  +-------------------+
                                                                |
                                                      TCP / TLS | (Mongoose ODM)
                                                                v
                                                      +-------------------+
                                                      |     Database      |
                                                      | (MongoDB Cluster) |
                                                      +-------------------+
```

---

## Curriculum Roadmap

Follow these notes in sequence to master modern Node.js backend development:

1. [Architecture & Project Setup](architecture-and-setup.md) — Client-server architecture, JS runtimes, production folder structure, ESM vs CommonJS, and CORS.
2. [Express & Middlewares](express-and-middlewares.md) — Express request/response lifecycle, middleware pipelines, parsing JSON/URL-encoded bodies, cookies, and static files.
3. [Data Modeling & Mongoose](data-modeling-and-mongoose.md) — Wireframe-to-schema design, BSON vs JSON, validation, relational modeling (ObjectId & references), and YouTube-style subscription junction modeling.
4. [Database Connection](database-connection.md) — Production MongoDB connection pattern, async lifecycle, connection pooling, and error resilience.
5. [API Handling & Error Architecture](api-handling-and-errors.md) — The `asyncHandler` Higher-Order Function, custom `ApiError` class, and standardized `ApiResponse` contracts.
6. [Authentication & Security](authentication-and-security.md) — Password hashing with bcrypt, Mongoose pre-save hooks, custom schema methods, JWT Access/Refresh Token dual architecture, `verifyJWT` middleware, and refresh token rotation.
7. [Aggregation & Pagination](aggregation-and-pagination.md) — MongoDB aggregation pipelines (authors & books introductory walkthrough, complex channel profile and nested watch history case studies), and scalable pagination with `mongoose-aggregate-paginate-v2`.
8. [File Uploads with Multer & Cloudinary](file-uploads-multer-cloudinary.md) — Server-mediated uploads, OS linking/unlinking (`fs.unlinkSync`), Cloudinary utility, and Multer diskStorage.
9. [HTTP Crash Course](http-crash-course.md) — URL vs URI vs URN, HTTP request/response headers, CORS & security headers, safe vs idempotent HTTP methods, and status codes reference.
10. [Controllers, Routing & Mongoose CRUD](controllers-routing-and-crud.md) — End-to-end request navigation flow, Mongoose CRUD operations master reference, complete production User controller suite, public vs protected routes, and bug audits.
