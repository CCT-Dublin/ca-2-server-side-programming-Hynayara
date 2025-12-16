//database connection file
require('dotenv').config();
const mysql = require('mysql');

// Create connection (mysql does NOT support promises)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});
// Ensure the table exists
const checkTableSQL = `
  CREATE TABLE IF NOT EXISTS mysql_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    second_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    eircode VARCHAR(20)
  )
`;
connection.query(checkTableSQL, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'mysql_table' is ready");
  }
});

module.exports = connection;
