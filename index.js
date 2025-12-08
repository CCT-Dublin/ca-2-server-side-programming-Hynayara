console.log("Project started");
const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./database');
const fs = require('fs');
const csv = require('csv-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Server is running!");
});

// Endpoint to import CSV data into the database
app.get('/import-csv', (req, res) => {
  // Initialize counters and error tracking
  let rowNumber = 1;
  let errors = [];
  let inserted = 0;
  // Read and parse the CSV file
  fs.createReadStream('data/Personal_information.csv')
    .pipe(csv())
    .on('data', (row) => {
      rowNumber++;
      //destructure from the current CSV row
      const { first_name, second_name, email, phone, eircode } = row;
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
      db.query(sql, [first_name, second_name, email, phone, eircode], (err) => {
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
