Backend Development

There are 2 major components

- Programming langugae: JAVA, JS, PHP(we generally use framework)
- Database: Mongo, MySql, postgres(generally use ORM, ODM)

Browser/Mobile <---> API <---> Backend <---> DB(another continent)

What we will do deal with maily these 3 : Data, File, Third Party(API)

JS Runtime: Nodejs/Deno/Bun

File Structure
package.json
.env
readme, git, lint, prettier, etc
/src - index(db connect) - app(config, cookie, etc) - consants(enums, db name)
/DB : db connect, calls code
/Models: schema, etc
/Controllers: methods or function logic
/Routes
/Middlewares
/Utils

Steps to create express app:

1. run npm init
2. add start script: "start":node index.js
3. create index.js file
4. install express
5. write code in index.js

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

how to safely store sensitive info like db url, port, etc.
we can write all sensitive info in .env file
and then use it in other files.
install dotenv package to use env variables.
..... write code here

by default express uses commonjs import not module import.
to use syntax like import express fro "express", we have to tell express to use this format and that can be done in package.json by adding this line "type": "module",

How to connect backend to frontend?

CORS error
possible methods:

1. use cors package on backend
2. whitelist in vercel/appwright to get access data in localhost
3. use proxy of the tool chain you are using in frontend.
   In vite, we have to add server options in vite.config.js file
   server:{
   proxy:{
   '/api':"http://localhost:3000'
   }
   }

Before making any backend, think what would be data modelling, how and what data to store, what fields, type, etc
first think what data you want to get from user, make a demo screen, not think of what type of db to use like sql, no sql, first make data models and then think what structure would make sense for that use case
eg:
regsiter

username
email
password

submit button

login

email
password

button

todo

- will have multiple todo

- youtube
  -sub todo 1
  sub todo 2
  -gym
- job

outertodo/major todo

- title
- createdBy: [user]
- color
- sub todo: [{}, {}]
  innertodo/sub todo
- content
- markedasdone
- creation date

mongoose initial code

```js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({})

export const User = mongoose.model("User, userSchema)
```

internally users will be created by mongodb not User, its users.

explain each line: ....

there are two ways we can define schema

1.

```js
const userSchema = new mongoose.Schema({
  username: String,
  isActive: Boolean,
});
```

but to use full capability of mongoose, we can do something like this

```js
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
    },
  },
  { timestamps: true },
);
```

here we can do validations also along with data type.

relation/how to point to other model/schema

```js
const todoSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subTodos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTodo",
    },
  ], // array of sub todos
});
```

Example of simple models:

1. ecommerce
2. hospital management

connect to mongo
there is 2 ways, 1st you can write db connect code in index.js and when yoou run the application it will load db, 2nd is you write db code in separate file and only call it in index, this will keep the code modular and structed.

when write db connect remember 2 things:

1. when we try to connect db there mmay arise some problems, so we will use try catch
2. db will be in another continent so it will take some time to load, so we will use asyncc and await

1st approach to cnnect to db

```js
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

    app.on("error", (error) => {
      console.error("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
```

here we are using iifee, also initialising express here only. this method is also good, but we are polluting index.js file with db code and express code, there is more better approach

2nd approach

index.js

```js
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();
```

db/index.js

```js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
```

there is basically 2 things in express, request and response

from rquest we can take various things like req.body, req.cookies, req.ip, req.params(to get url paramaters)

what is middleware? define....

eg: suppose we go to /instagram, we want to check if user is logged in or not we can use some type of check in middleware before sending or getting
to use middleware we use app.use(), for eg for cors: app.use(cors())

there 4 things in express: (err, req, res, next)
next is flag, we use in middleware to pass execution from one middleware to another, tell the middleware like this middleware check is done go to next one...

using middleware

```js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// limiting the size of req json data
// this is the limit of data that we get from for eg form
app.use(express.json({ limit: "16kb" }));

// to config url that the req is coming from
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// to use static assests like fevicon, img temp
app.use(express.static("public"));

// to perform crud on cookie and configure it
app.use(cookieParser());

export default app;
```

we use connectDB() code from above type in multiple places, so we can create a wrapper so that we donot have to write it multiple times, we can use promises or try catch both as per preference.

in async await, asycnHandler is high order function, means it can accept fn as a parameter and also can return a function.

basic arrow fn: const asyncHandler = () => {}
passing fn: const asyncHandler = (fn) => {}
passing the same fn further: const asyncHandler = (fn) => {() =>{}}
making it async const asyncHandler = (fn) => async() => {}

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};
```

using promis:

```js
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
```

CHATGPT: explain both method in detail, espcially promise...

to make the error response standarised and not send random variables, we can use Error class in node, we use this class and extend it for our need:

```js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong !!!",
    errors = [],
    stack = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
```

CHATGPT: explain this, the oops concept behind and what does each line does

similarly for api response:

```js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
```

so now the whatever comes it should pass through ApiError only, for that we can use middlewares

does mongo store data in json?
no, in bson...
chatgpt explain

we can do aggregation pipeline with mongoose-aggregate-paginate-v2 librabrie

registering the plugin in schema

```js
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //Cloudinary url
      required: true,
    },
    thumbnail: {
      type: String, //Cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
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
  { timestamps: true },
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
```

now we can wriite aggreagate queeries

difference between bcrypt and bcryptjs

we cannot do direct encryption in mongo so to do something like encryption we can use middleware/hooks provided by moongoose. here we use pre hook.

pre hook: this can execute just before data saving in db

usingg bcrypt for hashing and comparing pasword

```js
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  // we donot want password to hash on every save call to db, only on password change, so we check if its modified or not
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// there are various default methods like deleteOne, updateOne, similarly we can create our own methods...
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
```

JWT is bearer token, means the we assume the person sending the token is correct and we send data to that person

what is access token and refresh token... explain.

```js
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  // we donot want password to hash on every save call to db, only on password change, so we check if its modified or not
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.models.generateAccessToken = function () {
  // jwt require, 1. payload, 2. access token secret, 3. expiry
  //
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.models.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
```

---

file upload with cloudinary and multer

there are two methods by which we can store file in any cloud based storage like aws or cloudinary.

1. store the file temporarily in server after getting from user and then upload the file to cloud.
2. directly upload file from user to cloud

which is best and why ?.... explain

what is linking and unlinking in file system?

cloudinary file upload util code, 1st approach code
utils/cloudinary.js

```js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfully, then unlink
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // remove the locally saved temporary file as the upload ops failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
```

only this line is crux

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

writing multer middleware
....add explaination on multer....

we are using diskstorage option to store the file in storage tempororily.

```js
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
```

There are three options available: destination, filename and flush. All of them except flush are functions that determine where the file should be stored.

destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system's default directory for temporary files is used.

filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.

flush is an optional boolean. When set to true, the file data is flushed to disk with an fsync call before the upload handler runs, which prevents data loss if the process or the system crashes while the data is still sitting in the operating system's page cache. It is disabled by default because forcing a disk flush on every upload has a performance cost. Note that this syncs the file contents only; if the new directory entry must survive a crash as well, fsync the destination directory yourself.

why in cb there is null as first value ?.... explain

HTTP Crash Course:
Hyper text transfer protocol

what is http?

URL vs URI vs URN

what are http header?
metadata-> key value sent alonng with request and response
work of headers: caching, authentication(cookies, sessions, tokens), state management
X-prefix -> deprecated around 2012

types:
request headers(from client)
response headers(from server)
reprensentation headers(encoding/compression, eg: compression data of zerodha data like graphs etc )
payload headers(data)

most common headers

- accept: application/json
- User-Agent: to get data from user like eg which browser user is using..
- Authorization: auth bearer tokens
- Content-Type: tell which type img/pdf etc
- cookie
- cache-control

cors header:
Access-Control-Allow-Origin
Access-Control-Allow-Credentials
Access-Control-Allow-Method

Security
Cross-Origin-Embedders-Policy
Cross-origin-Opener-Policy
Content-Security-Policy
X-XSS-Protection

HTTP Methods:
Basic set of operations that can be used to interact with server

GET: retrieve a resource
HEAD: no message body(response headers only)
OPTIONS: what operations are available
TRACE: looopback test(get some data)
DELETE: remove a resource
PUT: replace a resource
POST: interact with resource(mostly add)
PATCH: change part of resource

HTTP Status Code
1xx - Informational
2xx - success
3xx - redirection
4xx - client error
5xx - server error

standard status code
100 continue
102 processing
200 ok
201 created
202 accepted
307 temporaary redirect
308 permanent redirect
400 bad request
401 unauthorised
402 payment required
404 not found
500 internal server error
504 gateway timeout

gemini.....
add different methods of mongoose like update, find, etc. cover all the most used functions and their options...

Now setup is done, we write controller now, logic building....

writing register user functionality

basic setup
controler/user.controller.js

```js
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };
```

routes/user.route.js

```js
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

export default router;
```

app.js

```js
// routes
import userRouter from "./routes/user.route.js";

// routes declaration
app.use("/users", userRouter);
```

why we have not used app.get and used app.use ?...explain

explain the flow of paths or navigation how it goes to different file and from where it start where it ends....

difference between export default and export {}....explain

for logic building, we have to first think of all the steps involved in that function, write the steps first and then write the code

for eg:
// steps to do registerUser
// get user details from frontend
// validation - not empty
// check if user already exists: username, email
// check for images, check for avatar
// upload them to cloudinary, avatar check if successful
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return response

controller/user.controller.js

```js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
```

routes/user.route.js

```js
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

export default router;
```

console.log
cloudinary response
req.body
req.files

how is password hashed automatically and refresh token added
