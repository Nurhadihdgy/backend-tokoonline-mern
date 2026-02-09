# TK Lab Backend

Backend API for TK Lab E-commerce Application

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
- Copy `.env.example` to `.env`
- Update the values in `.env` file:
  - `MONGO_URI`: Your MongoDB connection string
  - `JWT_SECRET`: Generate a strong secret key
  - `CLIENT_URL`: Your frontend URL (default: http://localhost:5173)
  - `PORT`: Backend server port (default: 3000)

```bash
cp .env.example .env
```

### 3. Seed Initial Data
Run the seed script to populate the database with:
- 1 Admin account
- 1 User account
- 20 Sample products

```bash
npm run seed -- --force
```

**Note**: The `--force` flag is required to prevent accidental data deletion. The seed script will clear all existing data before creating new records.

### 4. Start the Server
For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## Default Login Credentials

After running the seed script, you can use these credentials:

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### User Account
- Email: `user@example.com`
- Password: `user123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Admin Orders
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)

## Database Schema

### User Model
- name: String
- email: String (unique, required)
- password: String (required, hashed)
- role: String (enum: ['user', 'admin'], default: 'user')

### Product Model
- name: String (required)
- price: Number (required)
- description: String
- category: String (required)
- stock: Number (default: 0)
- imageUrl: String
- imagePublicId: String
- isActive: Boolean (default: true)

### Order Model
- user: ObjectId (ref: User)
- items: Array of product objects
- totalAmount: Number
- status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
- shippingAddress: Object

### Cart Model
- user: ObjectId (ref: User)
- items: Array of product objects
- totalAmount: Number

## Development Notes

- The server runs on port 3000 by default
- CORS is configured to allow requests from the frontend
- All passwords are hashed using bcryptjs
- JWT tokens expire after 1 hour
- The seed script clears existing data before creating new records
