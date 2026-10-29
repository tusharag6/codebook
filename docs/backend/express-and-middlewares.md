---
sidebar_position: 2
---

# Express & Middlewares

Express is a fast, unopinionated, minimalist web framework for Node.js. At its core, Express is a routing and middleware web framework that manages incoming HTTP requests and routes them through a pipeline of processing functions.

---

## 1. Request and Response Architecture

When an HTTP request hits an Express server, Express encapsulates the incoming TCP/HTTP data into a **Request (`req`)** object and provides a **Response (`res`)** object to send data back.

```
Incoming Request
      │
      ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Middleware 1  │ ──> │ Middleware 2  │ ──> │ Route Handler │
│ (CORS / JSON) │     │  (Auth Check) │     │ (Controller)  │
└───────────────┘     └───────────────┘     └───────────────┘
                                                    │
                                                    ▼
                                            Outgoing Response
```

### Inspecting the Request Object (`req`)

| Property | Purpose | Example Usage |
| :--- | :--- | :--- |
| `req.body` | Contains key-value pairs submitted in the request body (JSON or form data). Requires body-parsing middleware. | `const { email, password } = req.body;` |
| `req.params` | Captures named route parameters defined with colons (`:id`) in the path. | Route: `/users/:id` <br/> URL: `/users/123` <br/> `req.params.id // "123"` |
| `req.query` | Contains parsed query string parameters after the `?` in the URL. | URL: `/search?page=2&sort=desc` <br/> `req.query.page // "2"` |
| `req.cookies` | Holds parsed cookies sent by the client. Requires `cookie-parser`. | `const token = req.cookies.accessToken;` |
| `req.headers` | Contains HTTP request headers (e.g., `authorization`, `content-type`). | `const auth = req.headers.authorization;` |
| `req.ip` | The remote client IP address. | `console.log("Client IP:", req.ip);` |

### Using the Response Object (`res`)

```javascript
// Sending JSON with custom status code
res.status(200).json({
  success: true,
  message: "Resource fetched successfully",
  data: user,
});

// Setting an HTTP-only secure cookie
res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// Chaining status and ending response
res.status(204).send();
```

---

## 2. Middleware Demystified

A **middleware** is a function that has access to the request object (`req`), the response object (`res`), and the `next` middleware function in the application’s request-response cycle.

### The Signature of Middleware Functions

Standard middleware functions accept three parameters:

```javascript
const myMiddleware = (req, res, next) => {
  // 1. Perform operations or mutate req/res
  req.requestTime = Date.now();

  // 2. Either pass control to the next middleware:
  next();

  // 3. Or terminate the request-response cycle:
  // res.status(403).json({ error: "Access Denied" });
};
```

> [!CAUTION]
> If a middleware does not terminate the cycle by sending a response (`res.send()` or `res.json()`), it **must** call `next()`. If `next()` is omitted, the request will hang indefinitely until the client times out.

### Error-Handling Middleware Signature
Specialized error-handling middlewares take four parameters instead of three. Express detects the four-argument signature:

```javascript
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
```

---

## 3. Standard Production Middleware Configuration

In production applications, global middlewares are centralized in `src/app.js` to ensure uniform parsing, security, and payload restrictions.

```javascript
// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// 1. Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// 2. Body Parser for JSON Payloads
// Enforces a strict limit (16kb) to prevent Denial of Service (DoS) attacks
app.use(express.json({ limit: "16kb" }));

// 3. URL-Encoded Body Parser
// extended: true uses the 'qs' library allowing rich objects and arrays to be encoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 4. Static Asset Hosting
// Serves static media, uploads, and favicons from the 'public' directory
app.use(express.static("public"));

// 5. Cookie Parser
// Enables reading (req.cookies) and manipulating secure browser cookies
app.use(cookieParser());

export default app;
```

### Deep Dive: Why Restrict Payload Limits to `16kb`?
Without a size limit, an attacker could transmit huge megabyte-sized JSON payloads in rapid succession. The Node.js single-threaded event loop would spend substantial CPU time parsing string data into JavaScript objects in memory, leading to memory exhaustion and severe latency spikes. Restricting request bodies to a safe threshold (like `16kb` or `32kb`) ensures robust resource protection.

### Deep Dive: `extended: true` vs `extended: false`
When parsing URL-encoded strings (form submissions):
- **`extended: false`**: Uses Node's built-in `querystring` module. Does not support nested objects (e.g., `user[name]=John` parses as a flat string key `"user[name]"`).
- **`extended: true`**: Uses the `qs` library. It can parse complex nested objects and arrays (e.g., `user[name]=John` parses as `{ user: { name: "John" } }`).
