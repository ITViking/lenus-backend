const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.send("Server is alive and well");
});

app.listen(3000,()=> {
  console.log("backend listening on 3000");
});