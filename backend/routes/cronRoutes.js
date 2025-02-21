const express = require("express");
const { checkTasksAndSendEmails } = require("../cron/taskReminder");
const router = express.Router();

router.get("/run-cron", async (req, res) => {
  const interval = req.query.interval || "30minutes";

  try {
    await checkTasksAndSendEmails(interval);
    res.json({ message: `Cron job executed for ${interval}` });
  } catch (error) {
    console.error("Cron job execution failed:", error);
    res.status(500).json({ message: "Cron job execution failed" });
  }
});

module.exports = router;
