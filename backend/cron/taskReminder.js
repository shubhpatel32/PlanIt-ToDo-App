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

const sendReminderEmail = async (email, username, task, timeLeft) => {
  console.log(
    `📧 Sending ${timeLeft} reminder email to: ${email} for task: ${task.title}`
  );

  try {
    const localDeadline = moment(task.deadline)
      .tz("Asia/Kolkata")
      .format("Do MMM, YYYY hh:mm A");

    await transporter.sendMail({
      from: `"PlanIt Task Reminder" <${process.env.EMAIL}>`,
      to: email,
      subject: `Reminder: Your task "${
        task.title
      }" is due in ${timeLeft}! (${Date.now()})`,
      html: `
        <p>Hi <strong>${username}</strong>,</p>
        <p>This is a reminder that your task <strong>"${
          task.title
        }"</strong> is due in ${timeLeft}!</p>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${
          task.description || "No description provided."
        }</p>
        <p><strong>Deadline:</strong> ${localDeadline}</p>
        <p><strong>Status:</strong> ${task.status}</p>
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

const checkTasksAndSendEmails = async () => {
  const nowUtc = moment.utc();
  const timeIntervals = [
    { label: "24 hours", time: nowUtc.clone().add(24, "hours") },
    { label: "4 hours", time: nowUtc.clone().add(4, "hours") },
    { label: "30 minutes", time: nowUtc.clone().add(30, "minutes") },
  ];

  try {
    for (const interval of timeIntervals) {
      console.log(`🔍 Checking for ${interval.label} reminders...`);

      const tasks = await Todo.find({
        deadline: {
          $gte: interval.time.toDate(),
          $lt: interval.time.clone().add(1, "minute").toDate(),
        },
        status: { $nin: ["EXPIRED", "COMPLETE"] },
      }).populate("userId", "email username");

      console.log(
        `📌 Found ${tasks.length} task(s) for ${interval.label} reminder.`
      );

      tasks.forEach((task) => {
        if (task.userId?.email) {
          sendReminderEmail(
            task.userId.email,
            task.userId.username,
            task,
            interval.label
          );
        }
      });
    }
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
  }
};

cron.schedule("* * * * *", () => checkTasksAndSendEmails());

module.exports = { checkTasksAndSendEmails };
