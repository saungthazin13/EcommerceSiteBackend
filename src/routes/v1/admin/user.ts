import express from "express";
import { getAllUser } from "../../../controllers/admin/userController";

const router = express.Router();

router.get("/user", getAllUser);
export default router;
