---
sidebar_position: 10
---

# Controllers, Routing & Mongoose CRUD

Once the project setup, database connectivity, and middleware pipelines are established, backend development transitions into **business logic building**: declaring routes, validating inputs, handling file uploads, querying databases, and crafting secure responses.

---

## 1. Architectural Navigation Flow: From Request to Response

Understanding how control flows across files is essential for debugging and reasoning about backend code.

```
+─────────────────────────────────────────────────────────────────────────────+
|                          End-to-End Request Journey                         |
+─────────────────────────────────────────────────────────────────────────────+

  1. Client sends POST request to http://localhost:8000/api/v1/users/register
     │
     ▼
  2. src/index.js
     - Loads .env, initializes database connection, and starts app.listen()
     │
     ▼
  3. src/app.js
     - Executes global middlewares: CORS, express.json(), express.urlencoded(), cookieParser()
     - Routes the request: app.use("/api/v1/users", userRouter)
     │
     ▼
  4. src/routes/user.routes.js
     - Matches path: /register
     - Executes route-level middleware: upload.fields([{ name: "avatar" }, { name: "coverImage" }])
     - Multer writes files to /public/temp and attaches metadata to req.files
     │
     ▼
  5. src/controllers/user.controller.js (registerUser wrapped in asyncHandler)
     - Validates form fields from req.body
     - Uploads temporary local files from req.files to Cloudinary using uploadOnCloudinary()
     - Deletes temporary local files from /public/temp via fs.unlinkSync()
     - Calls User.create(...)
     │
     ▼
  6. src/models/user.model.js
     - Mongoose pre("save") hook intercepts document save
     - Checks if (!this.isModified("password")) return next()
     - Hashes password with await bcrypt.hash(this.password, 10)
     - Writes new user document to MongoDB Atlas
     │
     ▼
  7. Return Response
     - Controller queries created user excluding password & refreshToken (.select("-password -refreshToken"))
     - Returns HTTP 201 with new ApiResponse(201, createdUser, "User registered successfully")
     │
     ▼
  8. Client receives structured JSON response
```

### Why Use `app.use("/users", userRouter)` Instead of `app.get()`?
- **`app.get(path, handler)`**: Registers a handler strictly for the HTTP `GET` verb at that exact URL.
- **`app.use(pathPrefix, router)`**: Mounts an entire **modular router or middleware pipeline** on a common path prefix. The sub-router can then define multiple sub-paths and different verbs (`.get()`, `.post()`, `.delete()`, `.patch()`) independently.

### `export default` vs Named `export { ... }`

| Feature | `export default MyComponent;` | `export { myUtility, otherFunc };` |
| :--- | :--- | :--- |
| **Quantity** | Exactly **one** default export per file | **Multiple** named exports per file |
| **Import Syntax** | `import AnyName from "./file.js"` (no curly braces) | `import { myUtility } from "./file.js"` (requires exact name) |
| **Renaming** | Can be imported under any name without extra syntax | Requires `as` keyword: `import { myUtility as customName }` |
| **Best Practice** | Ideal for modules representing a single entity (e.g., Express `app`, Mongoose `Model`, or `router`) | Ideal for utility toolkits, helper functions, and enums |

---

## 2. Mongoose CRUD Operations Master Reference

Below is a comprehensive guide to the most essential Mongoose methods, options, and update operators.

### A. Create Operations

```javascript
// 1. Create and save a document in one step
const newUser = await User.create({
  username: "john_doe",
  email: "john@example.com",
  password: "securePassword123",
});

// 2. Instantiate and save manually (useful when modifying properties before saving)
const user = new User({ username: "jane_doe", email: "jane@example.com" });
user.password = "newPassword";
await user.save(); // Triggers Mongoose pre("save") hooks

// 3. Bulk insert
await User.insertMany([user1, user2, user3]);
```

### B. Read (Query) Operations

```javascript
// Find all documents matching filter
const activeUsers = await User.find({ isActive: true });

// Find single document matching criteria
const user = await User.findOne({ email: "john@example.com" });

// Find by MongoDB _id
const user = await User.findById(userId);

// Query Chaining & Projection
const userProfile = await User.findById(userId)
  .select("-password -refreshToken") // Exclude fields
  .populate("watchHistory", "title duration thumbnail") // Populate referenced documents
  .lean(); // Returns plain JS object instead of heavyweight Mongoose document (boosts read performance!)

// Check document existence efficiently
const userExists = await User.exists({ email: "john@example.com" }); // Returns { _id: ... } or null

// Count matching documents
const totalUsers = await User.countDocuments({ isActive: true });
```

### C. Update Operations

```javascript
// Find by ID and update with critical options:
const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    $set: {
      fullName: "Johnathan Doe",
    },
  },
  {
    new: true, // Returns the modified document rather than the original
    runValidators: true, // Enforces schema validation rules on updates!
  }
);
```

#### Essential MongoDB Update Operators:
- **`$set`**: Sets the value of a field without replacing the entire document.
- **`$unset`**: Deletes a specific field from the document.
- **`$inc`**: Increments/decrements a numeric field (e.g., `$inc: { views: 1 }`).
- **`$push`**: Appends an element to an array (e.g., `$push: { watchHistory: videoId }`).
- **`$pull`**: Removes all matching elements from an array (e.g., `$pull: { watchHistory: videoId }`).
- **`$addToSet`**: Appends an element to an array only if it does not already exist (prevents duplicates).

### D. Delete Operations

```javascript
// Delete single document by ID
const deletedUser = await User.findByIdAndDelete(userId);

// Delete matching filter
await User.deleteOne({ email: "spammer@example.com" });

// Delete multiple records
await User.deleteMany({ isActive: false });
```

---

## 3. Logic Building: Step-by-Step Methodology

Before writing complex controllers, write down the business logic steps in comments. This prevents missed validations and logical errors.

```javascript
// Logic Breakdown for User Registration:
// 1. Extract user details from req.body (fullName, email, userName, password)
// 2. Validate that no required field is empty or whitespace
// 3. Query DB to check if username or email already exists
// 4. Extract local file paths from req.files (avatar is required, coverImage is optional)
// 5. Upload avatar and coverImage to Cloudinary
// 6. Verify avatar upload succeeded on Cloudinary
// 7. Create User document in MongoDB (password will be hashed automatically by pre-save hook)
// 8. Retrieve created user without sensitive fields (password, refreshToken)
// 9. Verify user was created successfully
// 10. Return HTTP 201 response with ApiResponse
```

---

## 4. Complete Production Implementation: User Registration

### Step 1: Controller Implementation

```javascript
// src/controllers/user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. Extract details from request body
  const { fullName, email, userName, password } = req.body;

  // 2. Validation: Ensure no required field is missing or empty whitespace
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields (fullName, email, userName, password) are required");
  }

  // 3. Check for existing user with same email or username
  const existingUser = await User.findOne({
    $or: [{ userName: userName.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // 4. Extract uploaded file paths from Multer's req.files object
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // 5. Validate avatar requirement
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 6. Upload files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar to cloud storage");
  }

  // 7. Create user document in MongoDB
  // Password will be hashed automatically by the userSchema pre("save") hook
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email.toLowerCase(),
    password,
    userName: userName.toLowerCase(),
  });

  // 8. Fetch the newly created user excluding sensitive credentials
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // 9. Return standardized success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
```

### Step 2: Route Declaration with Multer Middleware

```javascript
// src/routes/user.routes.js
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Route: POST /api/v1/users/register
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
```

### Step 3: Mounting in `app.js`

```javascript
// src/app.js
import express from "express";
import userRouter from "./routes/user.routes.js";

const app = express();

// Mount user routes under versioned API prefix
app.use("/api/v1/users", userRouter);

export default app;
```

---

## 5. What Data Looks Like at Runtime

When testing this endpoint (e.g., using Postman or Bruno):

### 1. `req.body` (Text Fields)
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "userName": "janedoe",
  "password": "Password123!"
}
```

### 2. `req.files` (Populated by Multer)
```json
{
  "avatar": [
    {
      "fieldname": "avatar",
      "originalname": "profile.jpg",
      "encoding": "7bit",
      "mimetype": "image/jpeg",
      "destination": "./public/temp",
      "filename": "avatar-1730000000000-profile.jpg",
      "path": "public\\temp\\avatar-1730000000000-profile.jpg",
      "size": 1048576
    }
  ]
}
```

### 3. Cloudinary Upload Response
```json
{
  "asset_id": "8f83b2...",
  "public_id": "temp_avatar_123",
  "version": 1730000000,
  "width": 800,
  "height": 800,
  "format": "jpg",
  "resource_type": "image",
  "url": "http://res.cloudinary.com/my-cloud/image/upload/v1730000000/avatar.jpg",
  "secure_url": "https://res.cloudinary.com/my-cloud/image/upload/v1730000000/avatar.jpg"
}
```
