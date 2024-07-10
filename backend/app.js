const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const UserAPI = require("./router/user");
const TaskAPI = require("./router/task");
app.use(cors());
app.use(express.json());

// Localhost:1000/api/v1/Sign-In
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);


const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
