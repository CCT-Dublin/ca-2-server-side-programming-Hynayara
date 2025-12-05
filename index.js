console.log("Project started");
const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Server is running!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
