---
sidebar_position: 9
---

# HTTP Crash Course

**HTTP (Hypertext Transfer Protocol)** is the foundational application-layer protocol powering communication across the World Wide Web. It operates on a client-server model over reliable transport layers (TCP/IP or QUIC/UDP in HTTP/3).

---

## 1. URI vs URL vs URN

Engineers often use these terms interchangeably, but they have distinct technical definitions:

```
                      Uniform Resource Identifier (URI)
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    Uniform Resource Locator (URL)          Uniform Resource Name (URN)
   "Specifies WHERE and HOW to fetch"       "Specifies WHAT by persistent name"
   https://api.github.com/users/octocat     urn:isbn:0451450523
```

| Term | Full Name | Definition | Real-World Example |
| :--- | :--- | :--- | :--- |
| **URI** | Uniform Resource Identifier | The broad superset. An identifier that names, locates, or identifies an abstract or physical resource. | Both URLs and URNs are URIs. |
| **URL** | Uniform Resource Locator | Specifies the resource's identity **and the mechanism/location** to retrieve it (protocol + hostname + port + path). | `https://codebook.dev/docs/backend/http` |
| **URN** | Uniform Resource Name | Names a resource persistently in a given namespace **independent of location** or network access method. | `urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66` |

---

## 2. HTTP Headers: Metadata Architecture

HTTP headers are case-insensitive key-value pairs transmitted in both HTTP requests and responses. They convey operational metadata regarding authentication, caching, data serialization, and security policies.

### The Four Official Header Categories

```
┌────────────────────────────────────────────────────────┐
│                   HTTP Message Header                  │
├────────────────────┬───────────────────────────────────┤
│ 1. Request Headers │ Client details, preferences, auth │
├────────────────────┼───────────────────────────────────┤
│ 2. Response Headers│ Server details, cookies, caching  │
├────────────────────┼───────────────────────────────────┤
│ 3. Representation  │ Format/encoding of entity payload │
├────────────────────┼───────────────────────────────────┤
│ 4. Payload Headers │ Content length, chunked transfer  │
└────────────────────┴───────────────────────────────────┘
```

1. **Request Headers**: Transmitted by the client to provide context to the server.
   - `Authorization: Bearer <JWT_TOKEN>`
   - `User-Agent: Mozilla/5.0...` (identifies client operating system, device, and browser engine).
   - `Accept: application/json` (informs server what data formats the client can parse).
2. **Response Headers**: Transmitted by the server to give the client instructions or metadata.
   - `Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=Strict`
   - `Server: nginx`
3. **Representation Headers**: Describe the physical representation of the message body.
   - `Content-Type: application/json; charset=utf-8` (or `multipart/form-data`)
   - `Content-Encoding: gzip` (indicates compressed responses).
4. **Payload Headers**: Transport metadata about payload chunks.
   - `Content-Length: 3482` (total bytes in the body).

### The Deprecation of `X-` Prefixes (RFC 6648)
Historically, developers prefixed custom, non-standard headers with `X-` (e.g., `X-Requested-With`, `X-Total-Count`). In **2012, RFC 6648 officially deprecated the `X-` prefix** because when custom headers became web standards, migrating applications to remove the `X-` prefix caused significant ecosystem breakage. Modern APIs use clear names without the `X-` prefix (e.g., `RateLimit-Remaining`).

---

## 3. Critical CORS and Security Headers

### CORS Headers (Cross-Origin Resource Sharing)
- `Access-Control-Allow-Origin`: Explicitly whitelist origins authorized to access resources (`https://myapp.com` or `*`).
- `Access-Control-Allow-Credentials`: Informs browser whether credentials (cookies, auth headers) can be exposed.
- `Access-Control-Allow-Methods`: Lists permitted HTTP methods (`GET, POST, PUT, DELETE, OPTIONS`).
- `Access-Control-Allow-Headers`: Permitted request headers in preflight requests.

### Essential Production Security Headers
- **`Content-Security-Policy` (CSP)**: Mitigates Cross-Site Scripting (XSS) and packet sniffing by restricting where scripts, styles, and images can load from.
- **`Strict-Transport-Security` (HSTS)**: Forces web browsers to interact with the domain strictly via encrypted `HTTPS`.
- **`X-Frame-Options: DENY`**: Protects against **Clickjacking** by forbidding the site from being loaded within `<iframe>` tags.
- **`Cross-Origin-Opener-Policy` (COOP)** & **`Cross-Origin-Embedder-Policy` (COEP)**: Isolates browser execution contexts against cross-origin Spectre attacks.

---

## 4. HTTP Methods: The Safety & Idempotency Matrix

HTTP defines verbs that dictate the semantic action requested on a resource.

### Core Concepts: Safe vs Idempotent
- **Safe**: The method is strictly read-only and causes **no state mutations or side effects** on the server.
- **Idempotent**: Making $1$ request or making $N$ identical requests produces the **exact same server state**.

| Method | Safe? | Idempotent? | Semantic Purpose |
| :--- | :---: | :---: | :--- |
| **`GET`** | **Yes** | **Yes** | Retrieve resource data without modifying state. |
| **`HEAD`** | **Yes** | **Yes** | Retrieve HTTP headers identical to `GET`, but omitting the response body. |
| **`OPTIONS`** | **Yes** | **Yes** | Queries supported methods and CORS capabilities (used in CORS preflight). |
| **`TRACE`** | **Yes** | **Yes** | Performs a message loopback diagnostic test along the network path. |
| **`PUT`** | No | **Yes** | **Completely replaces** target resource with request payload. |
| **`DELETE`** | No | **Yes** | Removes target resource. Deleting an already deleted resource still results in the resource being gone. |
| **`POST`** | No | No | Submits data to be processed; creates a new resource or triggers actions. |
| **`PATCH`** | No | No* | Applies **partial modifications** to an existing resource. (*Can be idempotent depending on implementation). |

---

## 5. HTTP Status Codes Reference

Status codes are 3-digit integers issued by the server in response to client requests.

### Class Breakdown
- **`1xx` (Informational)**: Request received, process continuing.
- **`2xx` (Success)**: Action successfully received, understood, and accepted.
- **`3xx` (Redirection)**: Further action must be taken by client.
- **`4xx` (Client Error)**: Request contains bad syntax or cannot be fulfilled.
- **`5xx` (Server Error)**: Server failed to fulfill an apparently valid request.

### The Most Crucial Production Status Codes

| Code | Name | Description & Practical Application |
| :--- | :--- | :--- |
| **`200`** | **OK** | Standard successful response for `GET`, `PUT`, or `PATCH`. |
| **`201`** | **Created** | The request was successful and resulted in the creation of a new resource (e.g., user registration). |
| **`204`** | **No Content** | The server processed the request successfully, but sends no body (common for `DELETE` operations). |
| **`301`** | **Moved Permanently**| Resource assigned a new permanent URI. Search engines transfer SEO equity. |
| **`304`** | **Not Modified** | Conditional GET caching hit. Informs client to use local cached copy. |
| **`307`** | **Temporary Redirect**| Redirects client, **guaranteeing** the HTTP method and body are not altered. |
| **`308`** | **Permanent Redirect**| Permanent redirect that preserves original HTTP method and body. |
| **`400`** | **Bad Request** | Missing required fields, invalid JSON syntax, or validation errors. |
| **`401`** | **Unauthorized** | **Unauthenticated**. Client lacks valid authentication credentials or token has expired. |
| **`403`** | **Forbidden** | **Unauthorized**. Server knows client identity, but client lacks permission/role for the resource. |
| **`404`** | **Not Found** | The requested endpoint or database document does not exist. |
| **`409`** | **Conflict** | Resource conflict (e.g., attempting to register an email or username that is already taken). |
| **`422`** | **Unprocessable Entity**| Syntax is valid JSON, but instructions or validation rules failed. |
| **`429`** | **Too Many Requests**| Rate limiting triggered due to exceeding maximum allowed requests. |
| **`500`** | **Internal Server Error**| Unhandled exception or catastrophic failure in server logic. |
| **`502`** | **Bad Gateway** | Server acting as a gateway/reverse proxy received an invalid response from upstream server. |
| **`503`** | **Service Unavailable**| Server temporarily down for maintenance or overloaded with traffic. |
| **`504`** | **Gateway Timeout** | Reverse proxy or load balancer timed out waiting for upstream server to respond. |

> [!TIP]
> **Difference between `301/302` and `307/308`**:
> Historically, browsers incorrectly transformed `POST` requests to `GET` requests when following `301` or `302` redirects. The newer codes **`307` (Temporary)** and **`308` (Permanent)** explicitly prohibit the client from changing the HTTP method upon redirect.
