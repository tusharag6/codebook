---
sidebar_position: 6
---

# Authentication & Security

Authentication is the mechanism of verifying who a user is. In modern web architectures, security relies on one-way cryptographic password hashing and stateless token-based authorization via **JSON Web Tokens (JWT)**.

---

## 1. Password Security Principles

### Hashing vs Encryption
- **Encryption**: A **two-way** function. Data is encrypted using an algorithm and a key, and can later be decrypted back into plain text using the corresponding key.
- **Hashing**: A **one-way** mathematical transformation. Plain-text data is transformed into a fixed-length string (a digest or hash). It is mathematically infeasible to reverse a hash back to its original plain text.

```
Plain Text: "mySecretPassword123"
          │
          ▼  (bcrypt + salt rounds: 10)
Hash: "$2b$10$wT8KxJ5Qz1lA19fE..."   (One-way only!)
```

### Salt Rounds & Rainbow Table Protection
A **salt** is random cryptographic data appended to the password before hashing. This ensures that two users with the exact same password produce completely distinct hashes, defeating precomputed lookup attacks (rainbow tables).

### `bcrypt` vs `bcryptjs`

| Feature | `bcrypt` | `bcryptjs` |
| :--- | :--- | :--- |
| **Implementation** | C++ native binding compiled with `node-gyp` | 100% Pure JavaScript |
| **Performance** | Significantly faster (~30% faster CPU throughput) | Slightly slower due to pure JS execution |
| **Installation** | Requires build tools (Python, C++ compiler) | Zero system dependencies, works anywhere |
| **Recommendation** | Recommended for high-scale production | Ideal for serverless or environments lacking C++ toolchains |

---

## 2. Mongoose Middleware Hooks & Password Hashing

Mongoose lifecycle hooks allow you to intercept document actions before or after they execute. We use the `pre("save")` hook to hash passwords right before they are written to MongoDB.

> [!WARNING]
> **The Critical `isModified` Guard**:
> If a user updates their email or avatar and calls `user.save()`, you must not re-hash the existing password hash. Always check `if (!this.isModified("password")) return next();`.

```javascript
// Inside user.model.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook: Hashes password before saving to DB
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) return next();

  // Await the asynchronous bcrypt hash operation
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Custom instance method to compare passwords during login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
```

---

## 3. JSON Web Tokens (JWT) Architecture

A **JWT (JSON Web Token)** is a compact, URL-safe means of representing claims to be transferred between two parties. It is a **Bearer Token**: whoever presents the token is granted access.

```
       Header                    Payload                   Signature
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Algorithm & Typ │  .   │  Claims & Data   │  .   │ HMAC SHA256 of   │
│  {"alg": "HS256"}│      │  {_id, username} │      │ Header + Payload │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 4. The Dual-Token Authentication Strategy

Why do production systems use two distinct tokens (**Access Token** and **Refresh Token**)?

```
+-----------------------------------------------------------------------------------------+
|                              Access Token vs Refresh Token                              |
+-----------------------------------------------------------------------------------------+
| Feature              | Access Token                    | Refresh Token                  |
+----------------------+---------------------------------+--------------------------------+
| Primary Purpose      | Authorize individual API calls  | Generate new access tokens     |
| Lifespan             | Short (15 min - 2 hours)        | Long (7 - 30 days)             |
| Database Storage     | Not stored in DB (100% Stateless)| Stored in User Document        |
| Client Storage       | Memory or Secure httpOnly Cookie| Secure httpOnly Cookie         |
| Verification Speed   | Instant (Signature check only)  | Signature check + DB matching  |
| Revocation Window    | Until expiry (15m window max)   | Instantaneous (delete from DB) |
+-----------------------------------------------------------------------------------------+
```

### The Security & Performance Rationale

1. **Minimizing Database Workload (High Performance)**:
   - If every single request required a database lookup to check session state, high-traffic systems would experience severe database bottlenecks.
   - **Access tokens solve this**: The backend mathematically verifies the cryptographic HMAC signature using `process.env.ACCESS_TOKEN_SECRET`. No database query is needed!

2. **Mitigating Token Theft (Attack Surface Reduction)**:
   - If an attacker intercepts a stateless access token (e.g., via man-in-the-middle on an unencrypted network), the window of compromise is minimal because the token expires in 15 minutes.
   - Because the access token dies quickly, an attacker cannot maintain permanent unauthorized access.

3. **Immediate Revocation (The Kill Switch)**:
   - Purely stateless tokens cannot be revoked before they expire.
   - The **Refresh Token** solves this: It is stored in the user's MongoDB document. If an account is compromised, the user logs out, or an admin bans the account, the server sets `user.refreshToken = undefined`. The next time the client attempts to refresh its access token, the database check fails, immediately locking out the attacker.

---

## 5. End-to-End Token Lifecycle & Flow

The following diagram illustrates the complete round-trip lifecycle of access and refresh tokens:

```
+────────+                    +────────────────+                   +────────────────+
| Client |                    | Express Server |                   | MongoDB Atlas  |
+────────+                    +────────────────+                   +────────────────+
    │                                  │                                    │
    │ 1. POST /login (credentials)     │                                    │
    │─────────────────────────────────>│                                    │
    │                                  │ 2. Find user & verify password     │
    │                                  │───────────────────────────────────>│
    │                                  │<───────────────────────────────────│
    │                                  │                                    │
    │                                  │ 3. Generate Access + Refresh Token │
    │                                  │ 4. Save Refresh Token to User doc  │
    │                                  │───────────────────────────────────>│
    │                                  │<───────────────────────────────────│
    │ 5. Set httpOnly Cookies          │                                    │
    │<─────────────────────────────────│                                    │
    │                                  │                                    │
    │ 6. GET /api/v1/users/current-user│                                    │
    │    (Cookie: accessToken)         │                                    │
    │─────────────────────────────────>│                                    │
    │                                  │ 7. verifyJWT checks signature      │
    │ 8. HTTP 200 (Protected Data)    │    (No DB hit required!)           │
    │<─────────────────────────────────│                                    │
    │                                  │                                    │
    │        ... 15 minutes later: Access Token Expires ...                 │
    │                                  │                                    │
    │ 9. GET /api/v1/users/current-user│                                    │
    │─────────────────────────────────>│                                    │
    │ 10. HTTP 401 Unauthorized        │                                    │
    │<─────────────────────────────────│                                    │
    │                                  │                                    │
    │ 11. POST /refresh-token          │                                    │
    │     (Cookie: refreshToken)       │                                    │
    │─────────────────────────────────>│ 12. Verify signature & match      │
    │                                  │     token against DB document      │
    │                                  │───────────────────────────────────>│
    │                                  │<───────────────────────────────────│
    │                                  │ 13. Generate new token pair        │
    │                                  │     (Refresh Token Rotation)       │
    │ 14. Return new httpOnly cookies  │                                    │
    │<─────────────────────────────────│                                    │
    │                                  │                                    │
    │ 15. POST /logout                 │                                    │
    │─────────────────────────────────>│ 16. user.refreshToken = undefined  │
    │                                  │───────────────────────────────────>│
    │ 17. res.clearCookie(...)         │<───────────────────────────────────│
    │<─────────────────────────────────│                                    │
```

---

## 6. Implementing Schema Generator Methods

Add custom generator methods directly to your Mongoose schema:

```javascript
import jwt from "jsonwebtoken";

// Method to generate short-lived Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

// Method to generate long-lived Refresh Token (minimal payload)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  );
};

export const User = mongoose.model("User", userSchema);
```

---

## 7. Token Generation Helper: `generateAccessAndRefreshTokens`

To keep controller logic clean and DRY (Don't Repeat Yourself), extract token creation and database synchronization into a reusable helper function:

```javascript
// src/controllers/user.controller.js
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Persist the refresh token in the database for validation & revocation
    user.refreshToken = refreshToken;

    // validateBeforeSave: false bypasses schema validations (e.g. required avatar/password)
    // while updating only the refreshToken field
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};
```

> [!NOTE]
> **Why `validateBeforeSave: false`?**
> When calling `user.save()`, Mongoose re-runs all schema validation rules by default. Because we only loaded the user to update `refreshToken` without supplying other fields or triggering pre-save hooks on already-hashed passwords, `{ validateBeforeSave: false }` ensures the operation succeeds efficiently.

---

## 8. The `verifyJWT` Authentication Middleware

Protected endpoints require a middleware that intercepts incoming requests, extracts the JWT, verifies its cryptographic authenticity, and attaches the authenticated user record to `req.user`.

```javascript
// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1. Extract token from either httpOnly cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No access token provided");
    }

    // 2. Mathematically verify the signature using secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Retrieve user from database (omit sensitive credentials)
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token: User no longer exists");
    }

    // 4. Attach user document to Express request object
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
```

### Key Architectural Strengths:
- **Dual Retrieval Support**: Reads tokens from both `req.cookies` (for browser-based web applications) and `req.header("Authorization")` (for mobile apps and external API consumers).
- **Safe Object Injection**: Never attaches raw passwords or refresh tokens to `req.user` (`.select("-password -refreshToken")`).

---

## 9. Refresh Token Rotation (`refreshAccessToken`)

When an access token expires, the client calls the refresh endpoint without requiring the user to re-enter their username and password:

```javascript
// src/controllers/user.controller.js
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Refresh token is missing");
  }

  try {
    // 1. Verify cryptographic validity of incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 2. Find user in MongoDB
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // 3. Security Check: Compare incoming token against the token saved in DB
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or has already been used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    // 4. Token Rotation: Issue a fresh Access Token AND a fresh Refresh Token
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
```

> [!IMPORTANT]
> **What is Refresh Token Rotation?**
> Notice that `generateAccessAndRefreshTokens` issues **both** a new access token and a **new refresh token**, invalidating the old refresh token in the database. If a malicious entity intercepts an old refresh token and attempts to use it, the database comparison `incomingRefreshToken !== user?.refreshToken` fails immediately.

---

## 10. Safe Password Modification: Why `findByIdAndUpdate` Fails

A critical pitfall in password management is using `User.findByIdAndUpdate(userId, { password: newPassword })`.

> [!CAUTION]
> **Bypassing Mongoose Lifecycle Hooks**:
> `findByIdAndUpdate` is executed directly as a native MongoDB driver command. **It does NOT trigger `pre("save")` hooks!** If you use `findByIdAndUpdate` to update a password, it will be stored in your database as **unencrypted plain text**!

### The Correct Implementation:
```javascript
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // req.user._id is safely supplied by verifyJWT middleware
  const user = await User.findById(req.user?._id);

  // 1. Verify old password using our custom instance method
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  // 2. Assign new plain-text password to document property
  user.password = newPassword;

  // 3. Save document - THIS TRIGGERS the pre("save") hook which hashes user.password!
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
```

---

## 11. Secure Cookie Attributes

When returning tokens to the client in HTTP responses, always configure secure cookie options:

```javascript
const cookieOptions = {
  httpOnly: true, // Prevents client-side JavaScript from accessing cookies (mitigates XSS)
  secure: process.env.NODE_ENV === "production", // Transmit only over HTTPS in production
  sameSite: "strict", // Protects against Cross-Site Request Forgery (CSRF)
};

return res
  .status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken },
      "User logged in successfully"
    )
  );
```
