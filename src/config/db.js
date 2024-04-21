const mysql = require("mysql2");

// Create a MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promisify for Node.js async/await.
const promisePool = pool.promise();

// Simple function to test the connection
async function testConnection() {
  try {
    const [rows, fields] = await promisePool.query("SELECT 1 + 1 AS solution");
    console.log("Database connection test successful:", rows[0].solution); // Should log 2 if successful
  } catch (error) {
    console.error("Database connection test failed:", error);
  }
}

testConnection();

module.exports = promisePool;
