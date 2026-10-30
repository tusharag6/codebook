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

## 4. Complete Production Implementation: User Management Suite

Here is the complete production implementation of `src/controllers/user.controller.js` covering authentication, session handling, account updates, and asset uploads.

```javascript
// src/controllers/user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// Helper: Generate token pair and persist refresh token to database
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

// 1. User Registration
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields (fullName, email, userName, password) are required");
  }

  const existingUser = await User.findOne({
    $or: [{ userName: userName.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar to cloud storage");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email.toLowerCase(),
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// 2. User Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [
      { userName: userName?.toLowerCase() },
      { email: email?.toLowerCase() },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// 3. User Logout (Revoke tokens)
const logoutUser = asyncHandler(async (req, res) => {
  // Clear refresh token in database to prevent reuse
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// 4. Refresh Access Token (Token rotation)
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Missing refresh token");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

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

// 5. Change Current Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Use req.user._id from verifyJWT middleware for authenticated safety
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); // Triggers pre-save hook to hash password

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// 6. Get Current User Profile
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// 7. Update Text Details (Name, Email)
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "FullName and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email.toLowerCase(),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// 8. Update User Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar to cloud storage");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

// 9. Update User Cover Image
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage?.url) {
    throw new ApiError(500, "Error while uploading cover image to cloud storage");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
```

---

## 5. Master User Router: Public vs Protected Endpoints

```javascript
// src/routes/user.routes.js
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Register route: accepts multipart form data with multiple named file fields
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// Login route
router.route("/login").post(loginUser);

// Refresh Token route: can be called with cookie or body token without verifyJWT
router.route("/refresh-token").post(refreshAccessToken);

// ==========================================
// SECURED ROUTES (Protected by verifyJWT)
// ==========================================

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Profile text updates use PATCH (partial document modification)
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Single file upload endpoints use upload.single("fieldName")
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-coverimage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// Aggregation-powered channel profile and watch history
router.route("/c/:userName").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
```

---

## 6. HTTP Verb Conventions & Multer Placement

### Why Use `PATCH` Instead of `POST` or `PUT` for Account Updates?
- **`POST`**: Used for **creating** a brand new resource (e.g. creating a user at `/register`).
- **`PUT`**: Replaces the **entire** resource. If you send `{ fullName: "John" }` via `PUT`, standard semantics imply all unmentioned fields (email, avatar) will be overwritten or erased.
- **`PATCH`**: Applies **partial modifications** to an existing resource. Updating just an avatar image, a password, or a name is the exact definition of a `PATCH` operation.

### Multer Middleware Placement: `upload.fields` vs `upload.single`
- **`upload.fields([{ name: 'avatar', maxCount: 1 }, ...])`**:
  - Used when an endpoint receives multiple files under **different field names**.
  - Multer populates `req.files` as an object of arrays: `{ avatar: [file], coverImage: [file] }`.
- **`upload.single('avatar')`**:
  - Used when an endpoint receives a **single file** under one specific field name.
  - Multer populates `req.file` as a single object: `{ fieldname: 'avatar', path: '...' }`.

---

## 7. Critical Bug Audits & Common Production Pitfalls

| # | Pitfall Observed in Raw Notes | Production Fix & Rationale |
| :--- | :--- | :--- |
| **1** | `.cookie(", refreshToken", ...)` | **Leading Comma Bug**: Accidentally typing a leading comma sets the HTTP cookie header key to `", refreshToken"`. The client browser then stores it with a space or comma, meaning `req.cookies.refreshToken` returns `undefined` on all subsequent refresh calls! Fixed to `.cookie("refreshToken", ...)`. |
| **2** | `User.findById(req.body?._id)` in `changeCurrentPassword` | **ID Spoofing Vulnerability**: Never trust an `_id` supplied in `req.body` on authenticated endpoints. A malicious user could supply another user's ID to reset their password! Always use `req.user._id` verified by `verifyJWT`. |
| **3** | `if (!coverImageLocalPath.url)` | **Type Error**: `coverImageLocalPath` is a local disk file path string (e.g. `"public/temp/img.png"`), not an object with a `.url` property. The correct check is `if (!coverImage?.url)` on the Cloudinary response object. |
| **4** | Orphaned Files on Cloud Storage | **Cloud Storage Leak**: When updating an avatar or cover image, the old image remains on Cloudinary unless explicitly deleted. In production, store Cloudinary's `public_id` and call `cloudinary.uploader.destroy(oldPublicId)` prior to saving the new URL. |

---

## 8. What Data Looks Like at Runtime

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
