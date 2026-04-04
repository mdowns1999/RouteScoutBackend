const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");

let _db;

/**
 * Initialize MongoDB connection using modern async/await pattern
 * Compatible with MongoDB Node driver 6.x
 * @returns {Promise<MongoClient>} Connected MongoDB client
 */
const initDb = async () => {
  if (_db) {
    console.log("Db is already initialized!");
    return _db;
  }

  // Check if MONGODB_URI is defined
  if (!process.env.MONGODB_URI) {
    const error = new Error(
      "MONGODB_URI is not defined in environment variables. " +
      "Please create a .env file with MONGODB_URI=your_connection_string"
    );
    console.error("MongoDB connection error:", error.message);
    throw error;
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    _db = client;
    console.log("Successfully connected to MongoDB");
    return _db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

/**
 * Get the initialized database client
 * @returns {MongoClient} The MongoDB client instance
 * @throws {Error} If database is not initialized
 */
const getDb = () => {
  if (!_db) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return _db;
};

/**
 * Gracefully close the database connection
 * @returns {Promise<void>}
 */
const closeDb = async () => {
  if (_db) {
    await _db.close();
    _db = null;
    console.log("MongoDB connection closed");
  }
};

module.exports = {
  initDb,
  getDb,
  closeDb,
};
