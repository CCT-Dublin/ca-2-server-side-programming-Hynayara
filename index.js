//main server file responsible for handling routes and server setup
console.log("Project started");
const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./database');//import database connection
const fs = require('fs');//file system module
const csv = require('csv-parser');//csv parser module
const path = require('path');//path module to handle file paths
const helmet = require('helmet');//security middleware

app.use(helmet());
app.use(express.json());//middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));//middleware to parse request bodies
app.use(express.static('public'));//static files middleware
// Basic route to check server status
app.get('/', (req, res) => {
  res.send("Server is running!");
});
// Serve the HTML form
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});
// Handle form submission
app.post('/submit-form', (req, res) => {
  const { first_name, second_name, email, phone, eircode } = req.body;
  // Sanitize inputs
  const safeFirstName = sanitizeInput(first_name);
  const safeSecondName = sanitizeInput(second_name);
  const safeEmail = sanitizeInput(email);
  const safePhone = sanitizeInput(phone);
  const safeEircode = sanitizeInput(eircode);
  // SQL Insert statement
  const sql = `
    INSERT INTO mysql_table
    (first_name, second_name, email, phone, eircode) 
    VALUES (?, ?, ?, ?, ?)
  `;
  // Execute the insert query
  db.query(
    sql, [safeFirstName, safeSecondName, safeEmail, safePhone, safeEircode],
    (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Error inserting data");
        return;
      }   
      res.send("Data inserted successfully");
    } );
}); 
// Function to sanitize input to prevent XSS attacks
function sanitizeInput(value) {
  return value.replace(/[<>]/g, "");
}
// Endpoint to import CSV data into the database
app.get('/import-csv', (req, res) => {

  // Initialize counters and error tracking
  let rowNumber = 1;
  let errors = [];
  let inserted = 0;
  // Read and parse the CSV file
  fs.createReadStream(path.join(__dirname, 'data', 'personal_information.csv'))

    .pipe(csv({
    mapHeaders: ({ header }) =>
    header.trim().toLowerCase().replace(/\s+/g, '_')
  }))
    .on('data', (row) => {
      if (!row || object.keys(rom).length === 0) return;
      rowNumber++;
      //destructure from the current CSV row
      const { First_Name, Second_Name, Email, Phone, Eircode } = row;
      // Sanitize inputs  
      const safeFirstName = sanitizeInput(first_name);
      const safeSecondName = sanitizeInput(second_name);
      const safeEmail = sanitizeInput(email);
      const safePhone = sanitizeInput(phone);
      const safeEircode = sanitizeInput(eircode);
      // Validate data
      const nameRegex = /^[A-Za-z0-9]{1,20}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      const eircodeRegex = /^[0-9][A-Za-z0-9]{5}$/;
      // If any validation fails, log the error and skip insertion
      if (
        !nameRegex.test(first_name) ||
        !nameRegex.test(second_name) ||
        !emailRegex.test(email) ||
        !phoneRegex.test(phone) ||
        !eircodeRegex.test(eircode)
      ) {
        errors.push(`Invalid data at row ${rowNumber}`);
        return;
      }
      //SQL Insert statement
      const sql = `
        INSERT INTO mysql_table
        (first_name, second_name, email, phone, eircode)
        VALUES (?, ?, ?, ?, ?)
      `;
      // Execute the insert query
      db.query(
      sql, [safeFirstName, safeSecondName, safeEmail, safePhone, safeEircode], 
      (err) => {
        if (!err) inserted++;
      });
    })
    // When the CSV parsing is done, send the response
    .on('end', () => {
      res.json({
        inserted_records: inserted,
        errors: errors
      });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
