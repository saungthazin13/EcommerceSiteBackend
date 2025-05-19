import express from "express";
import {
  register,
  verifyOtp,
  confirmPassword,
  login,
  logout,
} from "../../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/confirmPassword", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);

export default router;
