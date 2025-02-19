const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Todo = require("../models/Todo");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendReminderEmail = async (email, username, task) => {
  console.log(`Sending reminder email to: ${email} for task: ${task.title}`);
  try {
    await transporter.sendMail({
      from: `"PlanIt Task Reminder" <${process.env.EMAIL}>`,
      to: email,
      subject: `Reminder: Your task "${task.title}" is expiring soon!`,
      html: `
        <p>Hi <strong>${username}</strong>,</p>
        <p>This is a reminder that your task <strong>"${
          task.title
        }"</strong> is due soon.</p>
        <p><strong>Deadline:</strong> ${new Date(task.deadline).toLocaleString(
          "en-IN"
        )}</p>
        <p><strong>Description:</strong> ${
          task.description || "No description provided."
        }</p>
        <p>Please make sure to complete it on time.</p>
        <p><a href="${
          process.env.FRONTEND_URL
        }/dashboard" style="color: blue; text-decoration: underline;">Go to App</a></p>
        <p>Best regards,<br>PlanIt Task Reminder</p>
      `,
    });
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
};

const checkTasksAndSendEmails = async (interval) => {
  const now = new Date();
  let timeRange;

  if (interval === "4hours") {
    timeRange = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours ahead
    console.log("Checking for tasks expiring within 24 hours...");
  } else if (interval === "30minutes") {
    timeRange = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes ahead
    console.log("Checking for tasks expiring in 30 minutes...");
  }

  try {
    const tasks = await Todo.find({
      deadline: { $gte: now, $lte: timeRange },
      status: { $nin: ["EXPIRED", "COMPLETE"] },
    }).populate("userId", "email username");

    tasks.forEach((task) => {
      if (task.userId?.email) {
        sendReminderEmail(task.userId.email, task.userId.username, task);
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

cron.schedule("0 */4 * * *", () => checkTasksAndSendEmails("4hours"));
cron.schedule("*/30 * * * *", () => checkTasksAndSendEmails("30minutes"));

module.exports = { checkTasksAndSendEmails };
