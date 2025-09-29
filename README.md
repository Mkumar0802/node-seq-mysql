Products API
A Node.js API built with Express and Sequelize for managing products and care-related items. This API provides complete CRUD operations with pagination support, connecting to a MySQL database with robust validation using Zod.

📋 Table of Contents
Features

Technologies Used

Setup Instructions

API Endpoints

Postman Collection

Data Validation

Error Handling

🚀 Features
CRUD Operations: Create, read, update, and delete products

Pagination: Efficient data retrieval with page-based navigation

Search: Filter products by name using search queries

Input Validation: Robust schema validation using Zod

Health Monitoring: API health check endpoint

MySQL Integration: Sequelize ORM for database operations

🛠 Technologies Used
Node.js: JavaScript runtime environment

Express.js: Web framework for Node.js

Sequelize: ORM for MySQL databases

MySQL: Database management system

Zod: Schema validation for the API

Postman: API testing tool (collection provided)

⚙️ Setup Instructions
Prerequisites
Node.js (v14 or higher)

MySQL Server

npm or yarn

Installation
Clone the repository

bash
git clone <repository-url>
cd products-api
Install dependencies

bash
npm install
Environment Configuration

Create a .env file in the root directory:

env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=products_db
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
Database Setup

Create the database in MySQL:

sql
CREATE DATABASE products_db;
Run the application

bash
# Development mode
npm run dev

# Production mode
npm start
The API will be available at http://localhost:3000

📡 API Endpoints
1. Health Check
GET /health

Check if the API is running properly.

Response:

json
{
  "ok": true
}
2. Create a Product
POST /api/v1/products

Create a new product in the database.

Request Body:

json
{
  "name": "Glucose Monitor",
  "price": 199.99,
  "stock": 5,
  "description": "Bluetooth-enabled CGM"
}
Response:

json
{
  "id": 1,
  "name": "Glucose Monitor",
  "price": 199.99,
  "stock": 5,
  "description": "Bluetooth-enabled CGM",
  "createdAt": "2025-09-29T07:26:17.000Z",
  "updatedAt": "2025-09-29T07:26:17.000Z"
}
3. List Products (with Pagination)
GET /api/v1/products?page=1&pageSize=10&q=glucose

Retrieve a paginated list of products with optional search.

Query Parameters:

page (optional): Page number (default: 1)

pageSize (optional): Number of items per page (default: 10)

q (optional): Search query to filter by product name

Response:

json
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

Retrieve a specific product by its ID.

Example Request: GET /api/v1/products/1

Response:

json
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

Update an existing product's information.

Request Body:

json
{
  "price": 179.99,
  "stock": 10,
  "description": "Discounted CGM"
}
Response:

json
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

Remove a product from the database.

Example Request: DELETE /api/v1/products/1

Response: 204 No Content

🧪 Postman Collection
A Postman collection is provided for testing the API endpoints. Import the collection to quickly test all available operations.

Collection Features:

Pre-configured requests for all endpoints

Example request bodies

Environment variables setup

Test scripts for response validation

🔒 Data Validation
The API uses Zod for comprehensive input validation:

Product Creation: All fields are required and validated

Product Update: Partial updates with validation for provided fields

Query Parameters: Pagination and search parameters validation

Validation Rules:

name: String, required, min 1 character

price: Number, positive, required

stock: Integer, non-negative, required

description: String, optional

⚠️ Error Handling
The API provides consistent error responses:

400 Bad Request: Invalid input data

404 Not Found: Resource not found

500 Internal Server Error: Server-side issues

Error Response Format:

json
{
  "error": "Error message describing the issue"
}
📝 Project Structure
text
src/
├── controllers/     # Route controllers
├── models/         # Sequelize models
├── routes/         # Express routes
├── middleware/     # Custom middleware
├── validation/     # Zod schemas
├── config/         # Database configuration
└── app.js          # Express application setup
🎯 Usage Examples
Creating a Product
bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Insulin Pump",
    "price": 299.99,
    "stock": 3,
    "description": "Advanced insulin delivery system"
  }'
Searching Products
bash
curl "http://localhost:3000/api/v1/products?page=1&pageSize=5&q=monitor"
Updating a Product
bash
curl -X PATCH http://localhost:3000/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 249.99}'
