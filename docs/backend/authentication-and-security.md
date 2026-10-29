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
+--------------------------------------------------------------------------------+
|                        Access Token vs Refresh Token                           |
+--------------------------------------------------------------------------------+
| Feature              | Access Token                 | Refresh Token            |
+----------------------+------------------------------+--------------------------+
| Purpose              | Authorize API requests       | Obtain new access tokens |
| Lifespan             | Short (15 min - 2 hours)     | Long (7 - 30 days)       |
| Database Storage     | Not stored in DB (Stateless) | Stored in User Document  |
| Client Storage       | Memory or httpOnly Cookie    | Secure httpOnly Cookie   |
| Verification Speed   | Instant (Cryptographic verification without DB hits)     |
+--------------------------------------------------------------------------------+
```

### The Security Model:
1. When a client makes an API request, it includes the short-lived **Access Token**. The backend verifies the cryptographic signature without querying the database.
2. If an attacker intercepts an Access Token, the exposure window is tiny because the token expires rapidly.
3. When the Access Token expires, the client calls `/api/v1/users/refresh-token` with the **Refresh Token**.
4. The server validates the Refresh Token against the token stored in the database. If valid, a fresh Access Token is issued.
5. If a security incident occurs, an administrator can instantly revoke access by deleting the `refreshToken` in the database.

---

## 5. Implementing Token Generation on Schemas

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

// Method to generate long-lived Refresh Token
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

## 6. Secure Cookie Attributes

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
