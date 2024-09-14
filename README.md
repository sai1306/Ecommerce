**E COMMERCE**

A simple e-commerce application API built with Node.js, Express.js, and PostgreSQL. The API supports user authentication, seller operations for managing products, and buyer operations for searching products and managing the cart.

Features
 - User Authentication: Sign up and login as a buyer or seller using JWT tokens.
 - Seller Operations: Add products (name, category, description, price, discount).
Edit or delete own products.
Buyer Operations:
Search products by name or category.
Add and remove products from the cart.
 - Tech Stack
   Backend: Node.js, Express.js
   Database: PostgreSQL
 - Libraries:
    - express-validator - Validation middleware for user inputs.
    - jsonwebtoken - JWT authentication.
    - bcryptjs - Password hashing.
    - pg - PostgreSQL client for Node.js.
    - dotenv - Manage environment variables.
 - Prerequisites
    Node.js (v14 or higher)
    PostgreSQL (v12 or higher)
    npm (v6 or higher)
Getting Started
1. Clone the Repository
 ```
git clone https://github.com/sai1306/ecommerce-api.git
cd ecommerce-api
 ```
2. Install Dependencies
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add the following variables:

```
PORT=8000
DATABASE_URL=postgres://username:password@localhost:5432/ecommerce_db
JWT_SECRET=your_jwt_secret_key
```
4. Database Setup
Make sure PostgreSQL is running. Then create the database and tables by executing the SQL schema:

```
CREATE DATABASE ecommerce_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  discount DECIMAL(5, 2),
  seller_id INTEGER REFERENCES users(id)
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL
);
 ```
5. Start the Server
```
npm start
```
By default, the server runs on http://localhost:8000.

API Endpoints
Authentication
POST /signup: Register as a buyer or seller.

Request body:
```
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "password123",
  "role": "buyer" or "seller"
}
```
Response:
```
{
  "success": true,
  "token": "JWT token",
  "message": "user registered successfully"
}
```
POST /login: Login and receive a JWT token.

Request body:
```
{
  "email": "user1@example.com",
  "password": "password123"
}
```
Response:
```
{
  "success": true,
  "token": "JWT token",
  "message": "login successful"
}
```
Seller Operations (Requires JWT Token)
POST /seller/addProduct - Add a new product (sellers only).

Request body:
```
{
  "name": "T-shirt",
  "category": "clothes",
  "description": "A stylish t-shirt",
  "price": 19.99,
  "discount": 5
}
```
PUT /seller/editProduct?id=<productId> - Edit product details (sellers only).

DELETE /seller/deleteProduct?id=<productId> - Delete a product (sellers only).

Buyer Operations (Requires JWT Token)
GET /searchProduct?name=<productName>&category=<category> - Search products by name or category.

POST /cart/addProduct - Add products to the cart.

Request body:
```
{
  "productId": 1,
  "quantity": 2
}
```
DELETE
/cart/deleteProduct/:id - Remove products from the cart.

Error Handling
Proper validation and sanitization are done using express-validator for user input.
Meaningful error messages are returned for unauthorized access, invalid input, and non-existent resources.
