import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { connectDB, disconnectDB } from '../config/db.js';
import Product from '../models/Product.js';
import { productsData } from '../data/productsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedProducts = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seeder] Clearing existing products...');
    await Product.deleteMany();

    console.log(`[Seeder] Inserting ${productsData.length} clothing products into database...`);
    const createdProducts = await Product.insertMany(productsData);

    console.log(`[Seeder] Successfully seeded ${createdProducts.length} products!`);
    console.log('[Seeder] Sample products:');
    createdProducts.slice(0, 3).forEach((p) => {
      console.log(`  - [${p.category}] ${p.name} | Price: ₹${p.price} | Stock: ${p.stock}`);
    });

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error seeding database:', error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedProducts();
