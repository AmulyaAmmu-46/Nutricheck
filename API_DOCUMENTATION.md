# Nuricheck API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

Creates an account. The account remains incomplete until a camera face descriptor is enrolled.

**Request Body:** `username`, `email`, `phone`, and `password` are required.

### 2. Enroll Face

**Endpoint:** `POST /api/auth/face-enrollment`

Saves the 128-number descriptor generated from the registration camera and completes the account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "faceDescriptor": [0.01, -0.02]
}
```

The descriptor contains 128 numeric values in a real request.

### 3. Face Login

**Endpoint:** `POST /api/auth/face-login`

Compares the camera descriptor with the enrolled descriptor and returns a JWT when the face matches.

**Request Body:** `email` and a 128-value `faceDescriptor` are required.

**Response (200):**
```json
{
  "success": true,
  "message": "Face login successful",
  "data": { "token": "jwt_token_string" }
}
```

Password login is not available. OTP remains available only for password recovery.

## Profile Endpoints (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "height": "number (required, 50-300 cm)",
  "weight": "number (required, 20-500 kg)",
  "diseases": ["string (optional, array)"],
  "goal": "string (required, enum: 'Bulking' | 'Leaning' | 'Maintaining Health')"
}
```

**Disease Options:**
- "BP"
- "Diabetes"
- "PCOD"
- "Kidney Disease"
- "Heart Disease"

**Protein Calculation:**
- Bulking: weight × 2
- Leaning: weight × 1.6
- Maintaining Health: weight × 1

**Response (200):**
```json
{
  "success": true,
  "message": "Profile saved successfully",
  "data": {
    "profile": {
      "height": 175,
      "weight": 70,
      "diseases": ["BP", "Diabetes"],
      "goal": "Bulking",
      "proteinRequirement": 140
    }
  }
}
```

**Error Responses:**
- `400`: Missing required fields or invalid values
- `401`: Unauthorized (invalid/missing token)
- `500`: Server error

---

### 5. Get Profile

**Endpoint:** `GET /api/profile`

**Description:** Retrieve user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "height": 175,
      "weight": 70,
      "diseases": ["BP", "Diabetes"],
      "goal": "Bulking",
      "proteinRequirement": 140
    }
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Server error

---

## Food Endpoints (Protected)

### 6. Add/Update Today's Food

**Endpoint:** `POST /api/food`

**Description:** Add or update today's food intake. Automatically calculates protein and sends email notification.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "breakfast": "string (optional)",
  "lunch": "string (optional)",
  "dinner": "string (optional)",
  "snacks": "string (optional)"
}
```

**Food Input Format:**
- Enter food items with quantities
- Examples: "2 eggs, 100g chicken breast", "150g salmon, 200g brown rice"
- System extracts protein from predefined dataset

**Response (200):**
```json
{
  "success": true,
  "message": "Food entry saved successfully. Email notification sent.",
  "data": {
    "food": {
      "breakfast": "2 eggs, 100g chicken breast",
      "lunch": "150g salmon, 200g brown rice",
      "dinner": "200g beef, vegetables",
      "snacks": "50g almonds",
      "proteinConsumed": 125.5
    },
    "proteinTracking": {
      "requiredProtein": 140,
      "consumedProtein": 125.5,
      "remainingProtein": 14.5
    }
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error

**Note:** Email notification is sent asynchronously. If email fails, the food entry is still saved.

---

### 7. Get Today's Food

**Endpoint:** `GET /api/food/today`

**Description:** Retrieve today's food intake and protein tracking information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "food": {
      "breakfast": "2 eggs, 100g chicken breast",
      "lunch": "150g salmon, 200g brown rice",
      "dinner": "200g beef, vegetables",
      "snacks": "50g almonds",
      "proteinConsumed": 125.5
    },
    "proteinTracking": {
      "requiredProtein": 140,
      "consumedProtein": 125.5,
      "remainingProtein": 14.5
    }
  }
}
```

**If no food entry exists:**
```json
{
  "success": true,
  "data": {
    "food": {
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "snacks": "",
      "proteinConsumed": 0
    },
    "proteinTracking": {
      "requiredProtein": 140,
      "consumedProtein": 0,
      "remainingProtein": 140
    }
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error

---

### 8. Get Meal History

**Endpoint:** `GET /api/food/history`

**Description:** Retrieve meal history for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of days to retrieve (default: 7)

**Example:**
```
GET /api/food/history?limit=7
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "_id": "string",
        "userId": "string",
        "date": "2024-01-15T00:00:00.000Z",
        "breakfast": "2 eggs, 100g chicken breast",
        "lunch": "150g salmon, 200g brown rice",
        "dinner": "200g beef, vegetables",
        "snacks": "50g almonds",
        "proteinConsumed": 125.5,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error

---

## Health Check

### 9. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if the API is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Nuricheck API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (only in development mode)"
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors, missing fields)
- `401`: Unauthorized (invalid/missing token, unverified account)
- `404`: Not Found
- `500`: Internal Server Error

---

## Protein Dataset

The system uses a predefined protein dataset to extract protein from food text. Common foods include:

- **Meats**: Chicken (27g/100g), Beef (26g/100g), Salmon (25g/100g), etc.
- **Dairy**: Milk (3.4g/100g), Eggs (13g/100g), Greek Yogurt (10g/100g), etc.
- **Legumes**: Lentils (9g/100g), Chickpeas (19g/100g), Tofu (8g/100g), etc.
- **Nuts**: Almonds (21g/100g), Peanuts (26g/100g), etc.

See `backend/utils/proteinDataset.js` for the complete dataset.

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins. For production, configure specific allowed origins.

---

## Testing with Postman/Thunder Client

1. **Register a user:**
   ```
   POST http://localhost:5000/api/auth/register
   Body: { "username": "test", "email": "test@test.com", "phone": "1234567890", "password": "test123" }
   ```

2. **Verify OTP:**
   ```
   POST http://localhost:5000/api/auth/verify-otp
   Body: { "email": "test@test.com", "otp": "123456" }
   ```

3. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: { "email": "test@test.com", "password": "test123" }
   Copy the token from response
   ```

4. **Create Profile:**
   ```
   POST http://localhost:5000/api/profile
   Headers: Authorization: Bearer <token>
   Body: { "height": 175, "weight": 70, "goal": "Bulking", "diseases": [] }
   ```

5. **Add Food:**
   ```
   POST http://localhost:5000/api/food
   Headers: Authorization: Bearer <token>
   Body: { "breakfast": "2 eggs, 100g chicken", "lunch": "150g salmon" }
   ```

---

**Last Updated:** 2024



