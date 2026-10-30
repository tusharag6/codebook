---
sidebar_position: 3
---

# Data Modeling & Mongoose

Data modeling is the process of structuring how application data is represented, validated, stored, and related. Before writing any database code, senior engineers design schemas by analyzing user requirements and UI wireframes.

---

## 1. The Data Modeling Mindset: Wireframe to Schema

Always begin with the user experience. Analyze the screens your users interact with to identify the entities and fields needed.

### Example: User Registration & Todo Wireframe

```
+------------------------------------+
|            REGISTER                |
|  Username:   [______________]      | ---> string, required, unique, lowercase, trim
|  Email:      [______________]      | ---> string, required, unique, lowercase
|  Password:   [**************]      | ---> string, required, hashed via bcrypt
|  Avatar:     [ Upload File  ]      | ---> string (Cloudinary CDN URL)
|  [ Submit ]                        |
+------------------------------------+
```

### Breaking Down Relationships:
- A **User** has many **Todos**.
- A **Todo** has many **SubTodos** (e.g., "YouTube" -> "SubTodo 1: Scripting", "SubTodo 2: Recording").
- A **SubTodo** has content, completion status (`isDone`), and a reference to its creator.

---

## 2. JSON vs BSON: How MongoDB Actually Stores Data

A common misconception is that MongoDB stores data as plain JSON. MongoDB actually stores documents in **BSON (Binary JSON)**.

| Feature | JSON | BSON |
| :--- | :--- | :--- |
| **Format** | Text-based (Human-readable) | Binary-encoded |
| **Parsing Speed** | Slower (requires string scanning) | Extremely fast (uses byte-length headers) |
| **Data Types** | Limited: `String`, `Number`, `Boolean`, `Array`, `Object`, `null` | Extended: `ObjectId`, `Date`, `Binary (Buffer)`, `Int32`, `Int64`, `Decimal128`, `Regex` |
| **Size Overhead** | Smaller for plain text | Slightly larger due to type headers and length prefixes |

> [!NOTE]
> MongoDB drivers (such as Mongoose) automatically serialize your JavaScript objects into BSON before sending them over the wire to the database, and deserialize incoming BSON back into JavaScript objects.

---

## 3. Mongoose Schemas and Models

### Schema vs Model
- **Schema**: The architectural blueprint defining the shape, fields, types, and validation rules of documents.
- **Model**: A compiled JavaScript constructor derived from the schema. Models provide the interface to perform CRUD operations on the database.

```javascript
import mongoose, { Schema } from "mongoose";

// 1. Define Schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Optimizes query performance
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// 2. Compile and Export Model
export const User = mongoose.model("User", userSchema);
```

### How Mongoose Names Collections
When you pass `"User"` as the model name:
```javascript
mongoose.model("User", userSchema);
```
Mongoose automatically transforms the name into **lowercase and pluralized** form for the underlying MongoDB collection. Thus, the model `"User"` maps directly to the collection named `"users"`.

---

## 4. Modeling Relationships: Embedding vs Referencing

MongoDB supports two primary methods for representing relationships:

### A. Referencing (Normalized / Hybrid Approach)
Store the `ObjectId` of the related document. This prevents duplicate data and avoids the 16MB document size limit.

```javascript
import mongoose, { Schema } from "mongoose";

// SubTodo Schema
const subTodoSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Points to User model
    },
  },
  { timestamps: true }
);

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);

// Main Todo Schema
const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subTodos: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubTodo", // Array of references
      },
    ],
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
```

### B. Embedding (Denormalized Subdocuments)
Store related items directly inside an array of subdocuments.
- **Best when**: Related items are few (< 100 items), tightly coupled, and always retrieved together with the parent document.
- **Trade-off**: The entire document must stay under MongoDB's **16MB limit**.

---

## 5. Domain Case Studies

### Case Study 1: E-Commerce Architecture

```
+---------------+          +---------------+          +---------------+
|     User      |          |    Product    |          |   Category    |
+---------------+          +---------------+          +---------------+
| _id           |          | _id           |          | _id           |
| email         |          | name          |          | name          |
| password      |          | price         |          +---------------+
+---------------+          | category (ref)|                  ^
        ^                  +---------------+                  |
        |                          ^                          |
        |                          |                          |
        +------------------+       +--------------------------+
                           |       |
                   +---------------+---------------+
                   |             Order             |
                   +-------------------------------+
                   | customer (ref: User)          |
                   | orderItems: [ {product, qty} ]|
                   | totalAmount                   |
                   | status (PENDING/DELIVERED)    |
                   +-------------------------------+
```

### Case Study 2: Hospital Management System
- **Patient**: `name`, `age`, `bloodGroup`, `gender`, `admittedIn` (ref to Hospital).
- **Doctor**: `name`, `specialization`, `experienceInYears`, `worksInHospitals` (array of refs).
- **MedicalRecord**: `patient` (ref), `diagnosedBy` (ref to Doctor), `symptoms`, `prescription`.

---

## 6. Advanced Relational Pattern: YouTube Subscription Modeling

A common design challenge is modeling many-to-many relationships where **both sides of the relationship are the same entity** (self-referencing relationships). In a video platform, every user is a subscriber, and every user can also be a creator (channel).

### The Subscription Schema

```javascript
// src/models/subscription.model.js
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User", // The user who is subscribing
      required: true,
      index: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User", // The user/channel being subscribed to
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Enforce unique pair: a user cannot subscribe to the same channel twice
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
```

### Conceptual Architecture

Instead of embedding arrays inside user documents, each subscription exists as a lightweight junction document:

```
+─────────────────────────────────────────────────────────────────────────────+
|                         Subscription Junction Model                         |
+─────────────────────────────────────────────────────────────────────────────+

  Users:
    User A ("Alex")       User B ("CodeChannel")       User C ("Chris")

  Subscription Documents Created in DB:
  ┌─────────────────────────────────────────────────────────────┐
  │ Doc 1: { subscriber: Alex (A), channel: CodeChannel (B) }   │
  │ Doc 2: { subscriber: Chris (C), channel: CodeChannel (B) }  │
  │ Doc 3: { subscriber: CodeChannel (B), channel: Alex (A) }   │
  └─────────────────────────────────────────────────────────────┘

  1. "How many subscribers does CodeChannel (B) have?"
     Query: Count documents where { channel: B }
     Matches: Doc 1, Doc 2  ──> Result: 2 Subscribers

  2. "How many channels has CodeChannel (B) subscribed to?"
     Query: Count documents where { subscriber: B }
     Matches: Doc 3         ──> Result: 1 Subscribed Channel
```

### Why NOT embed an array of subscribers in the `User` schema?

```javascript
// ANTI-PATTERN: DO NOT DO THIS FOR UNBOUNDED LISTS!
const userSchema = new Schema({
  username: String,
  subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }], // DANGEROUS!
});
```

1. **MongoDB's 16MB BSON Document Limit**:
   - Each `ObjectId` is 12 bytes. If a creator gains millions of subscribers, the array will exceed MongoDB's maximum document size (16 megabytes) and crash your application.
2. **Write Performance & Document Relocation**:
   - Continuously pushing elements to an embedded array causes document growth. When a document outgrows its allocated disk memory block, MongoDB must physically relocate it on disk, severely impacting write throughput.
3. **Infinite Scalability with Junction Collections**:
   - A dedicated `Subscription` collection can store hundreds of millions of individual subscription rows effortlessly, with indexed read/write performance.
