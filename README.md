[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gCxlkD7T)
# Server-Side Programming CA2

This project was developed as part of the Server-Side Programming CA2 assignment.

## Project Overview
The application is a Node.js server-side system designed to securely process user data and store it in a MySQL database.  
It supports two data input methods:
- HTML form submission
- CSV file import with validation

The system focuses on data validation, security, and correct server-side processing.

## Technologies Used
- Node.js
- Express.js
- MySQL
- dotenv
- csv-parser
- Helmet

## Features
- Express server with middleware
- MySQL database connection using environment variables
- CSV data import with validation and error reporting
- HTML form with client-side and server-side validation
- Input sanitization to reduce XSS risks
- Basic security headers using Helmet

## How to Run the Project
1. Install dependencies:
npm install
2. Configure environment variables in a `.env` file

3. Start the server:
node index.js
4. Access the application:
- Form: http://localhost:3000/form
- CSV import: http://localhost:3000/import-csv

## Notes
This project was developed for educational purposes and follows best practices for server-side validation, security, and modular design.
