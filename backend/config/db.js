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

// In-memory fallback — ONLY used when no MONGODB_URI is set at all.
// Never used as a silent fallback for Atlas timeouts, because that makes
// the backend read/write a different (empty) database than the one the
// admin scripts write to, causing login to fail.
const startInMemoryDB = async () => {
  try {
    console.log('[MongoDB] No MONGODB_URI configured. Starting in-memory MongoDB for development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'house_of_rcr' },
    });
    const memoryUri = mongoMemoryServer.getUri();
    const memConn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] ⚠️  IN-MEMORY DATABASE active: ${memConn.connection.host} (${memConn.connection.name})`);
    console.log('[MongoDB] ⚠️  Data written here is NOT persistent and NOT shared with admin scripts.');
    return memConn;
  } catch (err) {
    console.error(`[MongoDB] Fatal: Could not establish any MongoDB connection: ${err.message}`);
    process.exit(1);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || '';

  // No URI configured — use in-memory (development only)
  if (
    !uri ||
    uri === 'your-atlas-connection-string' ||
    (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))
  ) {
    console.warn('[MongoDB] MONGODB_URI is not set or is a placeholder. Falling back to in-memory database.');
    console.warn('[MongoDB] To use Atlas, update MONGODB_URI in your .env file.');
    return startInMemoryDB();
  }

  // Atlas URI is configured — connect with a generous timeout.
  // We do NOT fall back to in-memory here because that would make the backend
  // use a different (empty) database than the admin scripts, breaking login.
  console.log(`[MongoDB] Connecting to: ${maskMongoUri(uri)}`);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,   // 10 s — enough for Atlas cold starts
    connectTimeoutMS: 15000,
  });

  console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
  console.log(`[MongoDB] ✅ Connected to Atlas: ${conn.connection.host} (db: ${conn.connection.name})`);
  return conn;
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
