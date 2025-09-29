A Node.js API built with Express and Sequelize, designed for managing Products (or care-related items), including CRUD (Create, Read, Update, Delete) operations and pagination. The API connects to a MySQL database and supports dynamic data management via HTTP requests.

Table of Contents

Technologies Used

Setup Instructions

API Endpoints

Postman Collection

Technologies Used

Node.js: JavaScript runtime environment.

Express.js: Web framework for Node.js.

Sequelize: ORM for MySQL databases.

MySQL: Database management system.

Zod: Schema validation for the API.

Postman: API testing tool (collection provided).





API Endpoints
1. Health Check

GET /health

Returns: {"ok": true}

2. Create a Product

POST /api/v1/products

Request Body:

{
  "name": "Glucose Monitor",
  "price": 199.99,
  "stock": 5,
  "description": "Bluetooth-enabled CGM"
}


Response:

{
  "id": 1,
  "name": "Glucose Monitor",
  "price": 199.99,
  "stock": 5,
  "description": "Bluetooth-enabled CGM",
  "createdAt": "2025-09-29T07:26:17.000Z",
  "updatedAt": "2025-09-29T07:26:17.000Z"
}

3. List Products (with pagination)

GET /api/v1/products?page=1&pageSize=10&q=glucose

Response:

{
  "data": [
    {
      "id": 1,
      "name": "Glucose Monitor",
      "price": 199.99,
      "stock": 5,
      "description": "Bluetooth-enabled CGM"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "hasPrev": false,
    "hasNext": false
  }
}

4. Get Product by ID

GET /api/v1/products/:id

Example Request: /api/v1/products/1

Response:

{
  "id": 1,
  "name": "Glucose Monitor",
  "price": 199.99,
  "stock": 5,
  "description": "Bluetooth-enabled CGM",
  "createdAt": "2025-09-29T07:26:17.000Z",
  "updatedAt": "2025-09-29T07:26:17.000Z"
}

5. Update Product

PATCH /api/v1/products/:id

Example Request:

{
  "price": 179.99,
  "stock": 10,
  "description": "Discounted CGM"
}


Response:

{
  "id": 1,
  "name": "Glucose Monitor",
  "price": 179.99,
  "stock": 10,
  "description": "Discounted CGM",
  "createdAt": "2025-09-29T07:26:17.000Z",
  "updatedAt": "2025-09-29T07:30:00.000Z"
}

6. Delete Product

DELETE /api/v1/products/:id

Example Request: /api/v1/products/1

Response: 204 No Content
