---
sidebar_position: 7
---

# Aggregation & Pagination

As applications grow, retrieving data with basic `.find()` queries becomes insufficient. When you need to join collections, compute statistics, or paginate through large datasets efficiently, MongoDB’s **Aggregation Framework** is the industry standard.

---

## 1. The Aggregation Pipeline Concept

Think of an aggregation pipeline as an assembly line in a manufacturing factory. Documents enter from a collection, pass through multiple sequential stages where they are filtered, transformed, reshaped, or combined with other collections, and emerge as a final computed output.

```
Collection Documents
        │
        ▼
   [ $match ]    ──> Filters out documents that don't match criteria
        │
        ▼
   [ $lookup ]   ──> Performs left outer joins with other collections
        │
        ▼
   [ $unwind ]   ──> Deconstructs array fields to flat objects
        │
        ▼
   [ $project ]  ──> Shapes output fields and excludes sensitive data
        │
        ▼
  Final Output
```

---

## 2. Core Aggregation Stages Explained

| Stage | Purpose | SQL Analogy |
| :--- | :--- | :--- |
| **`$match`** | Filters documents according to specified criteria. Place early in the pipeline to use indexes. | `WHERE` |
| **`$lookup`** | Joins documents from an external collection based on matching keys. | `LEFT OUTER JOIN` |
| **`$unwind`** | Deconstructs an array field from the input documents to output a document for each element. | Flat mapping |
| **`$group`** | Groups documents by a specified identifier expression and applies accumulators (`$sum`, `$avg`). | `GROUP BY` |
| **`$sort`** | Reorders all input documents by a specified sort key. | `ORDER BY` |
| **`$project`** | Selects, renames, or calculates specific fields to return in the document. | `SELECT` |
| **`$addFields`**| Appends new fields or overrides existing fields without dropping unmentioned fields. | Computed columns |

---

## 3. High-Performance Pagination with `mongoose-aggregate-paginate-v2`

### The Problem with Simple `.skip()` and `.limit()`
On large collections (millions of records), using `db.collection.find().skip(100000).limit(10)` causes MongoDB to scan and traverse 100,000 documents before returning 10. In complex aggregation pipelines involving `$lookup`, performing manual skips and counts becomes expensive.

### Integrating the Aggregation Paginate Plugin

Install the dedicated package:
```bash
npm install mongoose-aggregate-paginate-v2
```

Attach the plugin to your schema:

```javascript
// src/models/video.model.js
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary URL
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // In seconds
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Plug in the aggregation pagination capability
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
```

---

## 4. Real-World Case Study: User Watch History Aggregation

Consider retrieving a user's watch history. Each user document stores an array of video `ObjectId`s. We want to return the watch history with the complete video details, as well as the channel/owner details of each video, while omitting sensitive owner information like passwords.

```javascript
// src/controllers/user.controller.js
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getWatchHistory = asyncHandler(async (req, res) => {
  const userHistory = await User.aggregate([
    // Stage 1: Match the specific logged-in user
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    // Stage 2: Join with the 'videos' collection using the watchHistory array
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        // Nested pipeline: populate the owner for each video in the history
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          // Convert owner array (of 1 element) into an object
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!userHistory?.length) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      userHistory[0].watchHistory,
      "Watch history retrieved successfully"
    )
  );
});
```

---

## 5. Paginated Aggregation in Controllers

Here is how to query the video feed with pagination:

```javascript
// src/controllers/video.controller.js
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;

  // 1. Build aggregation pipeline
  const pipeline = [];

  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push({
    $match: { isPublished: true },
  });

  pipeline.push({
    $sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
  });

  // 2. Configure paginate options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // 3. Execute paginated aggregation
  const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});
```
