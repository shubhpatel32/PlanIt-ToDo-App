require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { checkTasksAndSendEmails } = require("./cron/taskReminder");
const app = express();
app.use(express.json());
const API_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: API_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));
app.use("/api", require("./routes/cronRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
