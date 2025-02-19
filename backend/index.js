require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { checkTasksAndSendEmails } = require("./cron/taskReminder");
const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
//     credentials: true,
//   })
// );

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
