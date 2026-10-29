---
sidebar_position: 8
---

# File Uploads with Multer & Cloudinary

Handling user file uploads (avatars, cover images, videos, documents) is one of the three core concerns of backend engineering. Storing media directly in a database causes database bloat, slow backups, and performance degradation. Instead, production applications offload media storage to cloud storage providers (such as **Cloudinary** or **AWS S3**).

---

## 1. File Upload Architecture: Server-Mediated vs Direct

There are two primary paradigms for uploading files to cloud storage:

```
Approach 1: Server-Mediated Upload (Industry Standard for Custom Processing)
[Client / Browser] ──── (multipart/form-data) ───> [Node.js / Express Server]
                                                            │ (Stored temporarily in /public/temp)
                                                            ▼
                                                   [Cloudinary / AWS S3]
                                                            │ (Returns CDN URL)
                                                            ▼
                                                   [Node.js / Express Server]
                                                            │ (Deletes temp local file via fs.unlink)
                                                            ▼
                                                   [MongoDB (Stores CDN URL)]

Approach 2: Direct-to-Cloud Upload (Signed Uploads)
[Client / Browser] ──── Requests Signed Signature ───> [Node.js / Express Server]
[Client / Browser] <─── Returns Signature & Token ─── [Node.js / Express Server]
[Client / Browser] ──── Direct Upload ───────────────> [Cloudinary / AWS S3]
[Client / Browser] ──── Sends CDN URL to Save ───────> [Node.js / Express Server]
```

### Which Approach is Best and Why?
- **Server-Mediated Upload (Approach 1)**:
  - **Pros**: The backend maintains full control. You can validate MIME types, check file magic numbers, scan for viruses, resize/compress images with libraries like `sharp`, and enforce business rules before uploading to the cloud.
  - **Cons**: Consumes server bandwidth and temporary disk storage while uploading.
- **Direct-to-Cloud Upload (Approach 2)**:
  - **Pros**: Reduces server load and bandwidth costs; client uploads directly to CDN.
  - **Cons**: Increased frontend complexity; requires client-side upload orchestration and secure pre-signed signatures.

> [!NOTE]
> For most applications requiring server-side validation and multi-file transactions (e.g., user registration with avatar and cover image), **Server-Mediated Upload via Multer and Cloudinary** is the preferred standard.

---

## 2. File System Internals: Linking vs Unlinking

When handling temporary files in Node.js, we use the built-in `fs` (File System) module:

```javascript
import fs from "fs";
```

### What is Linking and Unlinking in POSIX / OS File Systems?
1. **Inodes & Data Blocks**: Operating systems do not store files purely by their names. Disk data is indexed by an **inode** (index node) that tracks block addresses, file size, permissions, and owner.
2. **Hard Links**: A directory entry (e.g., `./public/temp/avatar-123.png`) is simply a **hard link** pointing to that inode. An inode maintains a `link_count` tracking how many filenames reference it.
3. **Unlinking (`fs.unlink` / `fs.unlinkSync`)**:
   - `fs.unlink(path)` removes the directory entry (the link) from the file system.
   - The OS decrements the inode's link count.
   - When the link count reaches `0` (and no active process has the file open), the OS marks the underlying disk blocks as free for reuse.

> [!CAUTION]
> If an upload to Cloudinary fails, you **must unlink** the local file in your `catch` block. Failing to unlink temporary files will gradually fill up your server's disk space, eventually crashing the entire application.

---

## 3. Cloudinary Upload Utility

Centralize all cloud storage operations into a reusable utility module:

```javascript
// src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and cleans up local temporary storage.
 * @param {string} localFilePath - Path to the file stored temporarily on the server.
 * @returns {object|null} Cloudinary upload response object or null on failure.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detects whether resource is image, video, audio, or raw
    });

    // File uploaded successfully: remove the temporary local file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Upload failed: remove the local file to avoid orphan temporary files
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
```

---

## 4. Multer Middleware Configuration

Express cannot parse `multipart/form-data` natively. **Multer** is a dedicated middleware that handles multipart form streams and saves incoming files to memory or disk.

```javascript
// src/middlewares/multer.middleware.js
import multer from "multer";

// Configure disk storage engine
const storage = multer.diskStorage({
  // Determines which directory to store incoming files
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Generates a unique filename to prevent file name collisions
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum file size limit
  },
});
```

### Explaining Multer Options

1. **`destination`**: Specifies the folder path where uploaded files are written. If a string is provided, Multer creates the path. If a callback function is provided, you have programmatic control based on `req` or `file`.
2. **`filename`**: Generates the saved file's name. By default, Multer generates a random string without an extension. Appending a timestamp or random suffix (`Date.now() + Math.random()`) prevents files with the same original name from overwriting each other.
3. **`flush`**: An optional boolean. When set to `true`, Multer forces an `fsync` call to immediately flush file data from the OS page cache to physical disk. This prevents data loss in the event of an immediate server crash, but carries a minor I/O performance penalty.

### Why is `null` the First Argument in `cb(null, destination)`?
Multer adheres strictly to Node.js's **Error-First Callback Convention**:
```javascript
cb(error, result);
```
- If an error occurs (e.g., invalid file format, folder permissions error), pass the error as the first argument: `cb(new Error("Invalid destination"), null)`.
- If everything is valid, pass `null` as the error: `cb(null, "./public/temp")`.

---

## 5. Multer Upload Modes

Multer provides different handler methods depending on how many files and fields your endpoint accepts:

| Method | Use Case | Express Request Property |
| :--- | :--- | :--- |
| `upload.single("avatar")` | Exactly one file from a single form field | Populates `req.file` as an object |
| `upload.array("photos", 5)` | Multiple files under the same form field | Populates `req.files` as an array of objects |
| `upload.fields([...])` | Multiple files across distinct named fields | Populates `req.files` as an object keyed by fieldname |
| `upload.none()` | Text fields only (blocks any file uploads) | Only populates `req.body` |

### Example: Using `upload.fields` in Routes

```javascript
// src/routes/user.routes.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
  // Middleware handles avatar (1 file) and coverImage (1 file)
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
```
