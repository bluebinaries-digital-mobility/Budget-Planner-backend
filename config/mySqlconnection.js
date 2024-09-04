const mysql = require("mysql");
const util = require("util");
const nodeEnvConfig = require("../nodeEnvConfig");
nodeEnvConfig.envConfig();

const mysqlConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});

// Promisify the query method
mysqlConnection.query = util.promisify(mysqlConnection.query);

// Check initial connection
mysqlConnection.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    console.log(
      `Connected to the database "${process.env.DB_DATABASE}" in "${process.env.DB_HOST}" with user "${process.env.DB_USERNAME}" successfully!`
    );
    connection.release();
  }
});

// Handle connection errors
mysqlConnection.on("error", (err) => {
  console.error("Database error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Database connection was closed.");
  }
  if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("Database has too many connections.");
  }
  if (err.code === "ECONNREFUSED") {
    console.error("Database connection was refused.");
  }
});

module.exports = mysqlConnection;
