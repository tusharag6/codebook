---
sidebar_position: 1
---

# Architecture & Project Setup

Understanding the architectural blueprint of a backend application before writing code ensures that systems remain maintainable, secure, and ready for production scale.

---

## 1. Client-Server Architecture

Modern web systems decouple user interfaces from business logic and database access. The backend acts as a gatekeeper and orchestrator between clients and databases.

```
+--------------------+           HTTP / HTTPS           +--------------------+
|   Client Layer     | <------------------------------> | Application Server |
|  - Web (React/Vue) |             REST API             |   - Node / Express |
|  - Mobile (iOS/And)|          JSON Payloads           |   - Business Logic |
+--------------------+                                  +--------------------+
                                                                   |
                                                         Encrypted | Database Protocol
                                                        TCP / TLS  | (Mongoose Driver)
                                                                   v
                                                        +--------------------+
                                                        |   Database Layer   |
                                                        |  - MongoDB Atlas   |
                                                        |  - Dedicated Host  |
                                                        +--------------------+
```

### The Three Core Concerns of Any Backend
Every real-world backend service primarily manages three things:
1. **Data Operations**: Storing, validating, querying, aggregating, and mutating business records.
2. **File & Media Handling**: Handling multipart uploads, resizing images, and streaming assets to object storage (e.g., Cloudinary, AWS S3).
3. **Third-Party Integrations**: Interacting with external payment processors (Stripe), email/SMS services (SendGrid, Twilio), and identity providers (OAuth).

---

## 2. JavaScript Runtimes Compared

JavaScript was originally built to run only within web browsers. A **runtime environment** provides the plumbing (APIs, memory management, event loop, file system access) to run JavaScript on servers.

| Feature | Node.js | Bun | Deno |
| :--- | :--- | :--- | :--- |
| **Engine** | Google V8 (C++) | JavaScriptCore (WebKit/Zig) | Google V8 (Rust) |
| **Event Loop** | `libuv` | Custom native event loop | Tokio (Rust) |
| **Default Module System** | CommonJS (supports ESM) | Native ESM & CJS | Native ESM |
| **TypeScript Support** | Requires transpiler (e.g., `tsc`, `esbuild`) | Out-of-the-box native execution | Out-of-the-box native execution |
| **Ecosystem & Maturity**| Industry standard, largest package ecosystem | Ultra-fast startup, growing rapidly | Secure by default with permissions |

---

## 3. Production Project Directory Structure

A clean, modular folder hierarchy prevents circular dependencies and separates concerns:

```
my-backend-app/
├── public/                 # Static assets (favicons, temp files, uploads)
│   └── temp/               # Temporary disk storage for incoming file uploads
├── src/
│   ├── db/                 # Database initialization and connection logic
│   │   └── index.js
│   ├── models/             # Mongoose schemas and data models
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── controllers/        # Request handling and business logic
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── routes/             # API endpoint definitions and route mapping
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── middlewares/        # Custom Express middlewares (auth, multer, rate-limit)
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── utils/              # Generic utility wrappers and helpers
│   │   ├── asyncHandler.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── cloudinary.js
│   ├── constants.js        # Global constants (DB names, enums, fixed values)
│   ├── app.js              # Express app creation, global middlewares, route mounting
│   └── index.js            # Main entrypoint: loads env, connects DB, starts HTTP server
├── .env                    # Secret environment variables (never commit!)
├── .env.example            # Template of required env keys for collaborators
├── .gitignore              # Files and folders to exclude from version control
└── package.json            # Node project manifest, dependencies, and scripts
```

### Key Architectural Separation: `app.js` vs `index.js`
- **`app.js`**: Dedicated exclusively to configuring the Express application (registering CORS, JSON body parsers, cookie parsers, and routing). It **does not** start the server or connect to the database.
- **`index.js`**: Responsible for application bootstrap. It loads environment variables, initiates the database connection, handles failure gracefully, and calls `app.listen()` only after the database connection succeeds.

---

## 4. Initializing an Express Application

### Step 1: Initialize Project
```bash
npm init -y
```

### Step 2: Configure ESM (ECMAScript Modules)
By default, Node.js uses CommonJS (`require` and `module.exports`). To use modern `import / export` syntax, add `"type": "module"` in `package.json`:

```json
{
  "name": "backend-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  }
}
```

### Step 3: Install Core Dependencies
```bash
npm install express dotenv cors cookie-parser
npm install -D nodemon prettier
```

### Step 4: Minimal Server Setup
```javascript
// src/app.js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running smoothly!");
});

export default app;
```

---

## 5. Environment Variables & Security

Sensitive data (database credentials, private tokens, API secrets, port numbers) must never be hardcoded or checked into source control.

### Setup with `dotenv`
Create a `.env` file at the root:

```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_super_strong_access_secret_key_123!
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_strong_refresh_secret_key_456!
REFRESH_TOKEN_EXPIRY=10d
```

Load configuration as early as possible in your application entrypoint:

```javascript
// src/index.js
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
```

> [!WARNING]
> Always add `.env` to your `.gitignore` immediately upon creating a project. Maintain a `.env.example` file with dummy values so teammates know which environment variables are required.

---

## 6. Connecting Frontend to Backend & CORS Deep Dive

### What is CORS?
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism based on the **Same-Origin Policy (SOP)**. 

An origin consists of three components: **Protocol + Domain + Port**.

```
http://localhost:5173  (Frontend)
  |        |       |
Proto    Host    Port

http://localhost:8000  (Backend)
  |        |       |
Proto    Host    Port  ===> Different port = Cross-Origin Request!
```

If a script in the browser attempts to fetch data from an origin differing in protocol, domain, or port, the browser blocks the response unless the backend explicitly authorizes it via response headers (`Access-Control-Allow-Origin`).

### Solution 1: Backend `cors` Middleware (Recommended for Production)
Install and configure the `cors` package:

```javascript
// src/app.js
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### Solution 2: Frontend Development Proxy (Vite)
During local development, you can avoid CORS entirely by having the frontend development server proxy API calls. Because server-to-server requests are not restricted by browser CORS policies, the request succeeds seamlessly.

In `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

With this proxy configured, frontend code can make requests to relative paths (e.g., `axios.get('/api/v1/users')`), and Vite forwards them to `http://localhost:8000/api/v1/users`.
