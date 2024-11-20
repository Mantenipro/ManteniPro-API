/* eslint-disable no-undef */
require("dotenv").config();

const server = require("./src/server");
const db = require("./src/lib/db");

const PORT = process.env.PORT || 8000;

db.connect()
  .then(() => {
    console.log("DB connected");
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });