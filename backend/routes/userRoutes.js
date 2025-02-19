const express = require("express");
const {
  registerUser,
  loginUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/userMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  loginSchema,
  signupSchema,
  changePasswordSchema,
  forgotPasswordSchema,
} = require("../validators/userValidator");
const router = express.Router();

router.post("/register", validate(signupSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.put(
  "/update-password",
  validate(changePasswordSchema),
  authenticateUser,
  updatePassword
);

router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  validate(forgotPasswordSchema),
  resetPassword
);

module.exports = router;
