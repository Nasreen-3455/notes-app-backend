const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(cors());
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");


app.use(express.json()); // VERY IMPORTANT

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
