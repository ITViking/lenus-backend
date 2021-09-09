const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require('pg')
const port = 3001;
const uuid = require('uuid');
const createAndSeedWeightsTable = require("./createAndSeedDatabase");

const db = new Pool({
  "user": "postgres",
  "host": "localhost",
  "database": "hytte_index",
  "password": "postgres",
  "port": 5432
});

//Uncomment line underneath to create and seed the database
// createAndSeedWeightsTable(db);

app.use(cors());
app.use(express.json())

app.get("/weight", (req, res) => {
  const userId = "1";
  db.query(`
      SELECT 
        data
      FROM weight
      WHERE userId = $1::text
      ORDER BY data ->> 'createdAt' ASC
    `,
    [ userId ]
  )
  .then((result) => {
    const weightList = result.rows.map(row => row.data);
    res.send(weightList);
  });
});

app.get("/weight/:id", (req, res) => {
  db.query(`
      SELECT 
        data
      FROM weight
      WHERE id = $1::uuid
    `,
    [ req.params.id ]
  )
  .then((result) => {
    const weight = result.rows[0];
    res.send(weight);
  });
});

app.post("/weight", (req, res) => {
  const now = (new Date()).toISOString();
  const userId = "1";
  const id = uuid.v4();
  const entry = {
    id,
    weight: req.body.weight,
    createdAt: (new Date(req.body.date)).toISOString(),
    updatedAt: now
  };

  db.query(`
      INSERT INTO weight (
        id,
        userId,
        data
      )
      VALUES (
        $1::uuid,
        $2::text,
        $3::json
      )
    `,
    [
      id,
      userId,
      {
        ...entry
      }
    ])
    .then(() => {
      res.send(entry);
    })
    .catch(err => {
      console.log("error", error);
    })
});

app.put("/weight/:id", (req, res) => {
  const now = (new Date()).toISOString();
  console.log("createdAt", req.body.date)
  const entry = {
    id: req.params.id,
    weight: req.body.weight,
    createdAt: (new Date(req.body.date)).toISOString(),
    updatedAt: now
  };

  console.log("entry", entry.createdAt);

  db.query(`
      UPDATE weight
      SET data = $1::json
      WHERE id = $2::uuid
    `,
    [
      entry,
      req.params.id,
    ])
    .then(() => {
      res.send(entry);
    })
    .catch((error) => {
      console.log("error", error);
    })
});

app.get("/health", (req, res) => {
  res.send("Server is alive and well");
});

app.listen(port,()=> {
  console.log(`backend listening on http://localhost:${port}`);
});
