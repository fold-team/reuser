# API Documentation

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
Most endpoints use cookie-based authentication. After login, the server sets `userId` and `organizationId` cookies that are used for subsequent requests.

---

## Authentication Endpoints

### POST /api/auth/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "organizationId": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
  ```json
  { "error": "Email and password are required" }
  ```
- `401 Unauthorized`: Invalid credentials
  ```json
  { "error": "Invalid email or password" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to login" }
  ```

**Notes:**
- Sets `userId` and `organizationId` cookies (httpOnly, 7 days expiry)
- Cookies are secure in production environment

---

### POST /api/auth/logout
Log out the current user by clearing session cookies.

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to logout" }
  ```

---

### GET /api/auth/session
Get the current authenticated user's session information.

**Request Body:** None

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "organizationId": "string"
  }
}
```

**Response (200 OK - No Session):**
```json
{
  "user": null
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error (returns `{ "user": null }`)

**Notes:**
- Uses `userId` cookie to identify the user
- Automatically clears invalid session cookies if user not found

---

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "organizationId": "string"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "organizationId": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
  ```json
  { "error": "Email, password, and organization ID are required" }
  ```
- `400 Bad Request`: User already exists
  ```json
  { "error": "User with this email already exists" }
  ```
- `404 Not Found`: Organization not found
  ```json
  { "error": "Organization not found" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to create account" }
  ```

**Notes:**
- Sets `userId` and `organizationId` cookies (httpOnly, 7 days expiry)
- ⚠️ **Security Warning**: Password is stored in plain text. In production, passwords should be hashed with bcrypt.

---

## Organization Endpoints

### GET /api/organizations
Get all organizations.

**Request Body:** None

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "name": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to fetch organizations" }
  ```

**Notes:**
- Results are ordered by creation date (newest first)

---

### POST /api/organizations
Create a new organization.

**Request Body:**
```json
{
  "name": "string"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or missing organization name
  ```json
  { "error": "Organization name is required" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to create organization" }
  ```

**Notes:**
- Organization name is trimmed of whitespace
- Name must be a non-empty string

---

### GET /api/organizations/[id]
Get a specific organization by ID.

**Path Parameters:**
- `id` (string): Organization ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "id": "string",
  "name": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Organization not found
  ```json
  { "error": "Organization not found" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to fetch organization" }
  ```

---

## Test User Endpoints

### GET /api/test-users
Get all test users for an organization.

**Query Parameters:**
- `orgId` (string, required): Organization ID

**Request Body:** None

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "isCheckedOut": false,
    "checkedOutById": "string | null",
    "checkedOutAt": "2024-01-01T00:00:00.000Z | null",
    "description": "string | null",
    "organizationId": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "checkedOutBy": {
      "id": "string",
      "email": "string"
    } | null
  }
]
```

**Error Responses:**
- `400 Bad Request`: Missing organization ID
  ```json
  { "error": "Organization ID is required" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to fetch test users" }
  ```

**Notes:**
- Results are ordered by creation date (newest first)
- Includes `checkedOutBy` user information if the test user is checked out

---

### POST /api/test-users
Create a new test user.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "organizationId": "string",
  "description": "string | null" // optional
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "isCheckedOut": false,
  "checkedOutById": null,
  "checkedOutAt": null,
  "description": "string | null",
  "organizationId": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
  ```json
  { "error": "All fields are required" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to create test user" }
  ```

**Notes:**
- `description` is optional
- Required fields: `firstName`, `lastName`, `email`, `password`, `organizationId`

---

### PUT /api/test-users/[id]
Update an existing test user.

**Path Parameters:**
- `id` (string): Test User ID

**Request Body:**
```json
{
  "firstName": "string", // optional
  "lastName": "string", // optional
  "email": "string", // optional
  "password": "string", // optional
  "description": "string | null" // optional
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "isCheckedOut": false,
  "checkedOutById": "string | null",
  "checkedOutAt": "2024-01-01T00:00:00.000Z | null",
  "description": "string | null",
  "organizationId": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to update test user" }
  ```

**Notes:**
- All fields in the request body are optional
- Only provided fields will be updated

---

### DELETE /api/test-users/[id]
Delete a test user.

**Path Parameters:**
- `id` (string): Test User ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to delete test user" }
  ```

---

### POST /api/test-users/[id]/checkout
Check out a test user (mark as in use).

**Path Parameters:**
- `id` (string): Test User ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "isCheckedOut": true,
  "checkedOutById": "string",
  "checkedOutAt": "2024-01-01T00:00:00.000Z",
  "description": "string | null",
  "organizationId": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
  ```json
  { "error": "User not found" }
  ```
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to checkout test user" }
  ```

**Notes:**
- Requires authentication (uses `userId` cookie)
- Sets `isCheckedOut` to `true`
- Records the current user as `checkedOutBy`
- Sets `checkedOutAt` to the current timestamp

---

### POST /api/test-users/[id]/checkin
Check in a test user (mark as available).

**Path Parameters:**
- `id` (string): Test User ID

**Request Body:** None

**Response (200 OK):**
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "isCheckedOut": false,
  "checkedOutById": null,
  "checkedOutAt": null,
  "description": "string | null",
  "organizationId": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error
  ```json
  { "error": "Failed to check in test user" }
  ```

**Notes:**
- Sets `isCheckedOut` to `false`
- Clears `checkedOutBy` relationship
- Clears `checkedOutAt` timestamp

---

## Data Models

### Organization
```typescript
{
  id: string;           // CUID
  name: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### User
```typescript
{
  id: string;           // CUID
  email: string;         // Unique
  password: string;     // ⚠️ Plain text (should be hashed in production)
  organizationId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### TestUser
```typescript
{
  id: string;                    // CUID
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isCheckedOut: boolean;         // Default: false
  checkedOutById: string | null;
  checkedOutBy: User | null;     // Relation to User
  checkedOutAt: DateTime | null;
  description: string | null;
  organizationId: string;
  organization: Organization;     // Relation to Organization
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400 Bad Request`: Invalid or missing request parameters
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

---

## Authentication Flow

1. **Sign Up**: `POST /api/auth/signup` - Creates a new user and sets session cookies
2. **Login**: `POST /api/auth/login` - Authenticates existing user and sets session cookies
3. **Check Session**: `GET /api/auth/session` - Validates current session
4. **Logout**: `POST /api/auth/logout` - Clears session cookies

Session cookies (`userId` and `organizationId`) are automatically included in subsequent requests by the browser.

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: Passwords are currently stored in plain text. In production, implement password hashing (e.g., bcrypt) before storing.

2. **Cookie Security**: 
   - Cookies are `httpOnly` (not accessible via JavaScript)
   - Cookies are `secure` in production (HTTPS only)
   - Cookies use `sameSite: "lax"` to prevent CSRF attacks

3. **Authentication**: Most endpoints do not explicitly check authentication. Consider adding middleware to protect sensitive endpoints.

4. **Input Validation**: While basic validation exists, consider adding more robust input sanitization and validation.

