import { Router } from "express";
import * as userClerkController from "./controller/userClerk.js";
const router = Router();

router.put("/:userId", userClerkController.updateUser);

export default router;
