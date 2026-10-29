---
sidebar_position: 5
---

# API Handling & Error Architecture

In a production application, error handling and response structures cannot be left to ad-hoc conventions. Standardizing how asynchronous handlers run, how errors are caught, and how responses are shaped prevents crashes and creates a reliable contract with frontend clients.

---

## 1. The `asyncHandler` Higher-Order Function

### The Problem
In Express, any unhandled promise rejection inside an asynchronous controller crashes the server or hangs the client unless wrapped in a `try / catch` block. Writing repetitive `try / catch` statements across hundreds of controllers creates boilerplate code and increases the risk of human error.

### Understanding Higher-Order Functions & Currying
A **Higher-Order Function (HOF)** is a function that accepts another function as an argument, returns a function, or both.

```javascript
// Evolution of the asyncHandler signature:
const step1 = () => {};
const step2 = (fn) => {};
const step3 = (fn) => (req, res, next) => {};
const step4 = (fn) => async (req, res, next) => {};
```

### Pattern A: The Try / Catch Wrapper

```javascript
// src/utils/asyncHandler.js
export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.statusCode || error.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
```

### Pattern B: The Promise-Based Wrapper (Industry Standard)
Instead of catching errors immediately and sending a response, this pattern wraps execution in `Promise.resolve()` and delegates any caught errors to Express’s global error-handling middleware using `next(err)`.

```javascript
// src/utils/asyncHandler.js
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
```

> [!TIP]
> **Why Pattern B is preferred in Enterprise Systems**:
> 1. It centralizes all error response serialization in a single global Express error-handling middleware.
> 2. `Promise.resolve()` safely handles both asynchronous functions (returning Promises) and accidental synchronous functions.

---

## 2. Standardized Error Handling with `ApiError`

Node.js provides a built-in `Error` class. By extending it using Object-Oriented Programming (OOP) inheritance, we create a specialized `ApiError` that preserves stack traces and carries HTTP status codes and validation payloads.

```javascript
// src/utils/ApiError.js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // 1. Call the parent Error constructor with the error message
    super(message);

    // 2. Custom properties
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // 3. Clean stack trace capture
    if (stack) {
      this.stack = stack;
    } else {
      // Omits constructor invocation from the stack trace for clean logs
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
```

### Line-by-Line Breakdown:
- **`super(message)`**: Calls the parent `Error` class constructor. This properly initializes `this.message` and ensures standard JavaScript error-handling tools recognize it as a valid `Error` instance.
- **`this.statusCode`**: Carries standard HTTP status codes (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`, etc.).
- **`this.errors`**: An array containing detailed validation failures (e.g., from validator libraries like Zod or Joi).
- **`Error.captureStackTrace(this, this.constructor)`**: A V8 engine optimization. It creates a `.stack` property on the error instance, omitting the internal lines of the `ApiError` constructor itself to keep stack traces concise and actionable.

---

## 3. Standardized Responses with `ApiResponse`

Frontend clients thrive on predictability. Returning varying JSON shapes causes frontend state handling to become fragile. The `ApiResponse` class guarantees that every successful API response adheres to an identical schema.

```javascript
// src/utils/ApiResponse.js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    // Any status code under 400 denotes a successful operation
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
```

---

## 4. Putting It All Together: A Production Controller

Here is how `asyncHandler`, `ApiError`, and `ApiResponse` combine cleanly in a real-world controller:

```javascript
// src/controllers/user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validation check
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields (username, email, password) are required");
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this username or email already exists");
  }

  // 3. Create user in database
  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // 4. Send standardized success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
```

Notice how clean the controller is:
- **No repetitive `try/catch` blocks**.
- Errors are thrown with explicit HTTP codes and messages via `throw new ApiError(...)`.
- Success responses are uniformly structured with `new ApiResponse(...)`.
