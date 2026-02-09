const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const seedData = async () => {
  // Check if --force flag is provided
  const isForce = process.argv.includes('--force');
  
  if (!isForce) {
    console.log('⚠️  WARNING: This will delete all existing data!');
    console.log('To proceed, run: npm run seed -- --force');
    process.exit(0);
  }
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user: admin@example.com / admin123');

    // Create regular user
    const hashedUserPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      name: 'Test User',
      email: 'user@example.com',
      password: hashedUserPassword,
      role: 'user'
    });
    await user.save();
    console.log('Created regular user: user@example.com / user123');

    // Create sample products
    const products = [
      {
        name: 'Laptop Gaming ASUS ROG',
        price: 15000000,
        description: 'Laptop gaming high-end dengan RTX 4070, Intel Core i9, 32GB RAM DDR5',
        category: 'Electronics',
        stock: 10,
        imageUrl: 'https://example.com/laptop-rog.jpg',
        imagePublicId: 'laptop-rog'
      },
      {
        name: 'iPhone 15 Pro Max',
        price: 20000000,
        description: 'Smartphone flagship Apple dengan A17 Pro, 256GB storage, titanium body',
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://example.com/iphone-15.jpg',
        imagePublicId: 'iphone-15'
      },
      {
        name: 'Samsung Galaxy Watch 6',
        price: 3500000,
        description: 'Smartwatch Samsung dengan fitur kesehatan lengkap, GPS, dan waterproof',
        category: 'Accessories',
        stock: 25,
        imageUrl: 'https://example.com/galaxy-watch.jpg',
        imagePublicId: 'galaxy-watch'
      },
      {
        name: 'Sony WH-1000XM5',
        price: 4500000,
        description: 'Headphone wireless premium dengan noise cancelling terbaik di kelasnya',
        category: 'Accessories',
        stock: 20,
        imageUrl: 'https://example.com/sony-headphone.jpg',
        imagePublicId: 'sony-headphone'
      },
      {
        name: 'iPad Air M2',
        price: 12000000,
        description: 'Tablet Apple dengan chip M2, 10.9 inch, WiFi + Cellular',
        category: 'Electronics',
        stock: 12,
        imageUrl: 'https://example.com/ipad-air.jpg',
        imagePublicId: 'ipad-air'
      },
      {
        name: 'MacBook Air M3',
        price: 18000000,
        description: 'Laptop ultra-thin dengan chip M3, 13.6 inch, 16GB RAM, 512GB SSD',
        category: 'Electronics',
        stock: 8,
        imageUrl: 'https://example.com/macbook-air.jpg',
        imagePublicId: 'macbook-air'
      },
      {
        name: 'PlayStation 5',
        price: 7500000,
        description: 'Console gaming generasi terbaru dengan 4K gaming, ray tracing',
        category: 'Gaming',
        stock: 18,
        imageUrl: 'https://example.com/ps5.jpg',
        imagePublicId: 'ps5'
      },
      {
        name: 'Xbox Series X',
        price: 7500000,
        description: 'Console gaming Microsoft dengan 4K gaming, 1TB SSD',
        category: 'Gaming',
        stock: 14,
        imageUrl: 'https://example.com/xbox.jpg',
        imagePublicId: 'xbox'
      },
      {
        name: 'Nintendo Switch OLED',
        price: 4500000,
        description: 'Hybrid console dengan layar OLED 7 inch, 64GB storage',
        category: 'Gaming',
        stock: 22,
        imageUrl: 'https://example.com/switch.jpg',
        imagePublicId: 'switch'
      },
      {
        name: 'Canon EOS R6 Mark II',
        price: 35000000,
        description: 'Mirrorless camera full-frame dengan 24.2MP, 4K 60fps video',
        category: 'Photography',
        stock: 5,
        imageUrl: 'https://example.com/canon-r6.jpg',
        imagePublicId: 'canon-r6'
      },
      {
        name: 'DJI Mini 3 Pro',
        price: 8500000,
        description: 'Drone compact dengan 4K HDR video, 34min flight time',
        category: 'Photography',
        stock: 10,
        imageUrl: 'https://example.com/dji-mini.jpg',
        imagePublicId: 'dji-mini'
      },
      {
        name: 'Apple Watch Ultra 2',
        price: 9000000,
        description: 'Smartwatch premium untuk outdoor adventures dengan titanium case',
        category: 'Accessories',
        stock: 15,
        imageUrl: 'https://example.com/apple-watch.jpg',
        imagePublicId: 'apple-watch'
      },
      {
        name: 'Samsung 65" QLED 4K TV',
        price: 12000000,
        description: 'Smart TV 65 inch dengan Quantum Dot technology, HDR10+',
        category: 'Electronics',
        stock: 6,
        imageUrl: 'https://example.com/samsung-tv.jpg',
        imagePublicId: 'samsung-tv'
      },
      {
        name: 'LG Gram 17',
        price: 16000000,
        description: 'Laptop ultra-light 17 inch dengan Intel Core i7, 16GB RAM',
        category: 'Electronics',
        stock: 9,
        imageUrl: 'https://example.com/lg-gram.jpg',
        imagePublicId: 'lg-gram'
      },
      {
        name: 'AirPods Pro 2',
        price: 3000000,
        description: 'True wireless earbuds dengan active noise cancelling dan spatial audio',
        category: 'Accessories',
        stock: 30,
        imageUrl: 'https://example.com/airpods.jpg',
        imagePublicId: 'airpods'
      },
      {
        name: 'Kindle Oasis',
        price: 2500000,
        description: 'E-reader premium dengan 7 inch screen, waterproof, adjustable warm light',
        category: 'Accessories',
        stock: 20,
        imageUrl: 'https://example.com/kindle.jpg',
        imagePublicId: 'kindle'
      },
      {
        name: 'GoPro Hero 12',
        price: 5500000,
        description: 'Action camera 5.3K video dengan HyperSmooth 6.0 stabilization',
        category: 'Photography',
        stock: 16,
        imageUrl: 'https://example.com/gopro.jpg',
        imagePublicId: 'gopro'
      },
      {
        name: 'Logitech MX Master 3S',
        price: 1200000,
        description: 'Wireless mouse ergonomic dengan 4000DPI sensor, silent clicking',
        category: 'Accessories',
        stock: 35,
        imageUrl: 'https://example.com/mx-master.jpg',
        imagePublicId: 'mx-master'
      },
      {
        name: 'Keychron K2 Pro',
        price: 950000,
        description: 'Mechanical keyboard wireless dengan hot-swappable switches',
        category: 'Accessories',
        stock: 25,
        imageUrl: 'https://example.com/keychron.jpg',
        imagePublicId: 'keychron'
      },
      {
        name: 'Dell UltraSharp 27" 4K',
        price: 5500000,
        description: 'Monitor professional 27 inch 4K IPS dengan USB-C hub',
        category: 'Electronics',
        stock: 11,
        imageUrl: 'https://example.com/dell-monitor.jpg',
        imagePublicId: 'dell-monitor'
      }
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} sample products`);

    console.log('\n✅ Seed data successfully created!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
