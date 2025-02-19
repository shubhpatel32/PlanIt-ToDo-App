require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { checkTasksAndSendEmails } = require("./cron/taskReminder");
const app = express();
app.use(express.json());
const cors = require("cors");
const API_URL = import.meta.env.VITE_API_URL;

app.use(
  cors({
    origin: API_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
