import mongoose from 'mongoose';

let mongoMemoryServer = null;

// Mask credentials in URI for safe logging
const maskMongoUri = (uri) => {
  try {
    const url = new URL(uri);
    if (url.password) url.password = '****';
    return url.toString();
  } catch {
    return '[invalid URI]';
  }
};

// Spin up MongoMemoryServer as a fallback for development environments
// that have no reachable MongoDB instance.
const startInMemoryDB = async () => {
  try {
    console.log('[MongoDB] Initializing in-memory MongoDB server for development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'house_of_rcr' },
    });
    const memoryUri = mongoMemoryServer.getUri();
    const memConn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to in-memory database: ${memConn.connection.host} (${memConn.connection.name})`);
    return memConn;
  } catch (err) {
    console.error(`[MongoDB] Fatal: Could not establish any MongoDB connection: ${err.message}`);
    process.exit(1);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/house_of_rcr';

  // Detect placeholder / missing URI — fall straight to in-memory
  if (
    !uri ||
    uri === 'your-atlas-connection-string' ||
    (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))
  ) {
    console.warn('[MongoDB] MONGODB_URI is not set or is a placeholder. Falling back to in-memory database.');
    console.warn('[MongoDB] To use Atlas, update MONGODB_URI in your .env file with a valid mongodb+srv:// connection string.');
    return startInMemoryDB();
  }

  console.log(`[MongoDB] Connecting to: ${maskMongoUri(uri)}`);

  try {
    // Attempt standard connection with 3-second timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
    console.log(`[MongoDB] ✅ Connected to Atlas: ${conn.connection.host} (db: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to primary URI (${maskMongoUri(uri)}): ${error.message}`);
    console.log('[MongoDB] Falling back to in-memory MongoDB for development...');
    return startInMemoryDB();
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('[MongoDB] Disconnected successfully.');
  } catch (err) {
    console.error('[MongoDB] Error during disconnect:', err.message);
  }
};
