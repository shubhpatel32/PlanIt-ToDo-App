const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Todo = require("../models/Todo");
const moment = require("moment-timezone");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendReminderEmail = async (email, username, task) => {
  console.log(`📧 Sending reminder email to: ${email} for task: ${task.title}`);

  try {
    const localDeadline = moment(task.deadline)
      .tz("Asia/Kolkata")
      .format("Do MMM, YYYY hh:mm A");

    await transporter.sendMail({
      from: `"PlanIt Task Reminder" <${process.env.EMAIL}>`,
      to: email,
      subject: `Reminder: Your task "${
        task.title
      }" is expiring soon! (${Date.now()})`,
      html: `
        <p>Hi <strong>${username}</strong>,</p>
        <p>This is a reminder that your task <strong>"${
          task.title
        }"</strong> is due soon.</p>
        <p><strong>Deadline:</strong> ${localDeadline}</p>
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

    console.log(
      `✅ Email sent successfully to ${email} for task: ${task.title}`
    );
  } catch (error) {
    console.error("❌ Error sending reminder email:", error);
  }
};

const checkTasksAndSendEmails = async (interval) => {
  const nowUtc = moment.utc().toDate();
  let timeRangeUtc;

  if (interval === "4hours") {
    timeRangeUtc = moment.utc().add(24, "hours").toDate();
    console.log(
      `⏳ Checking for tasks expiring within 24 hours... (${moment
        .utc(nowUtc)
        .format()})`
    );
  } else if (interval === "30minutes") {
    timeRangeUtc = moment.utc().add(30, "minutes").toDate();
    console.log(
      `⏳ Checking for tasks expiring in 30 minutes... (${moment
        .utc(nowUtc)
        .format()})`
    );
  }

  try {
    console.log("🔍 Querying database for matching tasks...");
    const tasks = await Todo.find({
      deadline: { $gte: nowUtc, $lt: timeRangeUtc },
      status: { $nin: ["EXPIRED", "COMPLETE"] },
    }).populate("userId", "email username");

    console.log(`📌 Found ${tasks.length} task(s) to send reminders for.`);

    tasks.forEach((task) => {
      if (task.userId?.email) {
        console.log(
          `📨 Preparing to send email for task: "${task.title}" (Deadline: ${task.deadline})`
        );
        sendReminderEmail(task.userId.email, task.userId.username, task);
      }
    });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
  }
};

// Schedule cron jobs
cron.schedule("0 */4 * * *", () => {
  console.log("🔔 Running 4-hour reminder check...");
  checkTasksAndSendEmails("4hours");
});

cron.schedule("*/30 * * * *", () => {
  console.log("🔔 Running 30-minute reminder check...");
  checkTasksAndSendEmails("30minutes");
});

module.exports = { checkTasksAndSendEmails };
