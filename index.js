const express = require("express");
const app = express();
const { Pool } = require('pg')
const port = 3000;

const db = new Pool({
  "user": "postgres",
  "host": "localhost",
  "database": "hytte_index",
  "password": "postgres",
  "port": 5432
});

app.get("/health", (req, res) => {
  res.send("Server is alive and well");
});

app.listen(port,()=> {
  console.log(`backend listening on http://localhost:${port}`);
});