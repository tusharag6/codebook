---
sidebar_position: 7
---

# Aggregation & Pagination

As applications scale, retrieving data with basic `.find()` and `.populate()` queries quickly becomes inefficient. When you need to join collections, compute real-time counts, reshape deeply nested data, or paginate through large datasets, MongoDB’s **Aggregation Framework** is the gold standard.

---

## 1. The Aggregation Pipeline Mental Model

Think of an aggregation pipeline as an **assembly line in an automated factory**. 

1. Raw documents from a collection enter the conveyor belt at the start of the line.
2. The documents pass sequentially through multiple **stages** (`$match`, `$lookup`, `$group`, etc.).
3. Each stage performs a specific transformation: filtering out unwanted documents, joining related collections, calculating summary statistics, or reshaping fields.
4. The output produced by one stage becomes the direct input for the next stage.
5. The final stage produces the finished, sculpted result set.

```
Raw Collection Documents
         │
         ▼
    [ $match ]    ──> Stage 1: Filters documents (e.g. status === "active")
         │
         ▼
    [ $lookup ]   ──> Stage 2: Performs joins with other collections
         │
         ▼
   [ $addFields ] ──> Stage 3: Calculates new computed fields (e.g. counts, booleans)
         │
         ▼
    [ $project ]  ──> Stage 4: Shapes output fields & removes sensitive data
         │
         ▼
    Final Sculpted Output
```

---

## 2. Beginner-Friendly Walkthrough: The Authors & Books Example

To understand how pipeline stages flow into one another, consider a simple bookstore application with two collections: `authors` and `books`.

### Sample Collections

```javascript
// Database: authors collection
[
  { _id: ObjectId("auth1"), name: "Haruki Murakami", country: "Japan" },
  { _id: ObjectId("auth2"), name: "George Orwell", country: "United Kingdom" }
]

// Database: books collection (author references authors._id)
[
  { _id: ObjectId("b1"), title: "Norwegian Wood", author: ObjectId("auth1"), price: 15, copiesSold: 12000 },
  { _id: ObjectId("b2"), title: "Kafka on the Shore", author: ObjectId("auth1"), price: 18, copiesSold: 8500 },
  { _id: ObjectId("b3"), title: "1984", author: ObjectId("auth2"), price: 12, copiesSold: 50000 }
]
```

### Business Requirement
Find all authors from **Japan**, join their books, calculate the total number of books written, and compute their total book revenue.

### The Aggregation Pipeline Solution

```javascript
const japaneseAuthorsReport = await Author.aggregate([
  // Stage 1: Filter authors by country
  {
    $match: {
      country: "Japan",
    },
  },
  // Stage 2: Join books written by each matched author
  {
    $lookup: {
      from: "books",            // Target collection in MongoDB (lowercase plural)
      localField: "_id",         // Key from Author document
      foreignField: "author",    // Key from Book document matching author._id
      as: "books",               // Name of resulting joined array
    },
  },
  // Stage 3: Calculate computed metrics
  {
    $addFields: {
      totalBooks: { $size: "$books" },
      totalRevenue: {
        $sum: {
          $map: {
            input: "$books",
            as: "book",
            in: { $multiply: ["$$book.price", "$$$book.copiesSold"] },
          },
        },
      },
    },
  },
  // Stage 4: Select only the fields needed by the client
  {
    $project: {
      name: 1,
      country: 1,
      totalBooks: 1,
      totalRevenue: 1,
      "books.title": 1, // Keep only titles of books, omitting other fields
    },
  },
]);
```

### Visual Transformation Across Stages

| Stage | What Happens | Resulting Shape |
| :--- | :--- | :--- |
| **Input** | Reads all documents from `authors` | `[auth1 (Japan), auth2 (UK)]` |
| **`$match`** | Discards authors where `country !== "Japan"` | `[auth1 (Japan)]` |
| **`$lookup`** | Joins books whose `author === auth1._id` | `[auth1 with books: [b1, b2]]` |
| **`$addFields`**| Calculates `{ totalBooks: 2, totalRevenue: 333000 }` | `[auth1 with computed metrics]` |
| **`$project`** | Strips unneeded fields and sensitive IDs | Final clean JSON response |

---

## 3. Core Aggregation Stages & Operators Reference

### Primary Stages

| Stage | Purpose | Description & Best Practice | SQL Equivalent |
| :--- | :--- | :--- | :--- |
| **`$match`** | Document Filtering | Filters documents based on query conditions. **Always place as early as possible** in the pipeline to leverage MongoDB database indexes. | `WHERE` / `HAVING` |
| **`$lookup`** | Collection Joining | Performs a left outer join to fetch documents from an external collection into an array field. | `LEFT OUTER JOIN` |
| **`$project`** | Document Reshaping | Includes (`1`), excludes (`0`), or calculates specific fields to return. | `SELECT` |
| **`$addFields`**| Adding Computed Properties | Appends new fields or overrides existing fields without dropping unmentioned fields (unlike `$project`). | Computed Columns |
| **`$group`** | Aggregation & Summarization | Groups documents by an `_id` expression and applies accumulators like `$sum`, `$avg`, `$push`. | `GROUP BY` |
| **`$unwind`** | Array Deconstruction | Deconstructs an array field from the input document to output a document for each element in the array. | Flat mapping |
| **`$sort`** | Ordering | Reorders all input documents by specified fields (`1` for ascending, `-1` for descending). | `ORDER BY` |
| **`$skip` & `$limit`** | Pagination | Skips a number of documents and restricts the number of returned results. | `OFFSET` & `LIMIT` |
| **`$count`** | Result Counting | Counts the number of documents reaching this stage. | `COUNT(*)` |

### Essential Aggregation Operators

- **`$size`**: Returns the number of elements in an array.  
  *Example*: `subscribersCount: { $size: "$subscribers" }`
- **`$cond`**: Performs if-then-else conditional logic.  
  *Syntax*: `{ $cond: { if: <boolean-expr>, then: <val1>, else: <val2> } }`
- **`$in`**: Determines whether a specified value is contained within an array.  
  *Example*: `{ $in: [req.user?._id, "$subscribers.subscriber"] }`
- **`$first` / `$last`**: Returns the first or last element of an array expression (ideal for unpacking 1-element arrays from `$lookup`).  
  *Example*: `owner: { $first: "$owner" }`

---

## 4. Master Case Study 1: User Channel Profile Aggregation

When a user visits a creator's channel profile page (e.g., `GET /api/v1/users/c/:userName`), the backend must return:
1. Channel details (full name, avatar, cover image).
2. The total count of subscribers who subscribed to this channel.
3. The total count of channels this creator has subscribed to.
4. A boolean flag `isSubscribed` indicating whether the currently logged-in user is subscribed to this channel.

### Implementation

```javascript
// src/controllers/user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw new ApiError(400, "Username is required in URL parameter");
  }

  const channel = await User.aggregate([
    // Stage 1: Find the target channel/user by case-insensitive username
    {
      $match: {
        userName: userName.toLowerCase(),
      },
    },
    // Stage 2: Join subscribers (documents where channel === this user's _id)
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // Stage 3: Join channels subscribed to (documents where subscriber === this user's _id)
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    // Stage 4: Compute subscriber counts and isSubscribed state
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            // Checks if req.user._id exists inside the array of subscriber ObjectIds
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    // Stage 5: Select only public profile fields
    {
      $project: {
        fullName: 1,
        userName: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res.status(200).json(
    new ApiResponse(200, channel[0], "User channel profile fetched successfully")
  );
});
```

### Stage-by-Stage Breakdown & Gotchas

1. **Double `$lookup` on the Same Junction Collection**:
   - In Stage 2, `localField: "_id"` matches `foreignField: "channel"`. This collects everyone who subscribed to this channel.
   - In Stage 3, `localField: "_id"` matches `foreignField: "subscriber"`. This collects all channels this user follows.
2. **The `$in` Array Traversal**:
   - MongoDB automatically unwraps dot notation across arrays. `"$subscribers.subscriber"` yields an array of all `subscriber` `ObjectId`s from the joined documents.
   - `$in: [req.user?._id, "$subscribers.subscriber"]` checks if the authenticated viewer is in that subscriber list.

> [!WARNING]
> **Proofreading & Common Bug Fix**:
> - **Missing `$` Sign**: In raw expressions, writing `{ $size: "subscribedTo" }` without the `$` fails because MongoDB treats `"subscribedTo"` as a literal string instead of the field path `"$subscribedTo"`. Always prefix field paths with `$`.
> - **Projection Syntax**: In Stage 5, ensure `isSubscribed: 1` has an explicit inclusion flag (`1`), rather than a dangling variable name `isSubscribed,`.

---

## 5. Master Case Study 2: Watch History with Nested Aggregation Pipelines

A user's document stores an array of video references: `watchHistory: [ObjectId("video1"), ObjectId("video2")]`.  
When retrieving watch history, we need the complete video details, plus the channel information (`fullName`, `userName`, `avatar`) of the video's creator, without exposing creator passwords or refresh tokens.

### Implementation

```javascript
// src/controllers/user.controller.js
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    // Stage 1: Match the authenticated user by ObjectId
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    // Stage 2: Join videos array with the videos collection
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        // Nested sub-pipeline: executed for each matched video document
        pipeline: [
          // Sub-Stage 2.1: Join each video's owner from the users collection
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              // Sub-Stage 2.1.1: Project only public fields of the video owner
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          // Sub-Stage 2.2: Convert the 1-element owner array into a plain object
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

  if (!user?.length) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user[0].watchHistory, "Watch history retrieved successfully")
  );
});
```

### Why `new mongoose.Types.ObjectId(req.user._id)` is Essential
In standard Mongoose queries like `User.findById(req.user._id)`, Mongoose's query middleware automatically converts string IDs into BSON `ObjectId`s behind the scenes.  
**However, inside an aggregation pipeline (`$match`), queries execute directly on the MongoDB server without automatic casting.** Passing a plain string ID to `$match: { _id: req.user._id }` will fail to match any documents! You must explicitly wrap it with `new mongoose.Types.ObjectId(...)`.

### Why `$first: "$owner"` is Used
By design, MongoDB `$lookup` stages always produce an **array of matching documents**, even when there is only a 1-to-1 match. Without transformation, the video owner would look like:
```json
"owner": [ { "fullName": "Alex", "userName": "alex", "avatar": "..." } ]
```
Using `$addFields: { owner: { $first: "$owner" } }` extracts the single element from the array, giving the frontend a clean object:
```json
"owner": { "fullName": "Alex", "userName": "alex", "avatar": "..." }
```

---

## 6. High-Performance Pagination with `mongoose-aggregate-paginate-v2`

### Why Native `.skip()` and `.limit()` Struggle at Scale
When querying a large collection (e.g. 500,000 videos), running:
```javascript
Video.find().skip(250000).limit(10);
```
forces MongoDB to scan and traverse 250,000 documents in memory before picking 10. In complex aggregation pipelines with `$lookup` joins, this creates substantial latency.

### Schema Integration

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
    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Enable pagination on aggregation pipelines
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
```

### Controller Usage

```javascript
// src/controllers/video.controller.js
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc" } = req.query;

  // 1. Build dynamic pipeline stages
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

  // 2. Configure pagination options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // 3. Execute aggregatePaginate
  const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos retrieved successfully")
  );
});
```
