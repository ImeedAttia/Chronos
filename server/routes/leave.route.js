// leaveRoutes.js

import express from "express";
import {
  createLeave,
  getAllLeavesController,
  updateLeave,
  deleteLeave,
  getAllLeavesByUserId, // Import the controller for fetching leaves by user ID
} from "../controllers/leave/leave.controller.js";
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
import { SUPERUSER_ROLE } from '../constants/constants.js'

const router = express.Router();

router.get("/", isUserAuthenticated, getAllLeavesController);
router.post("/user", isUserAuthenticated, getAllLeavesByUserId); // Route for fetching leaves by user email in the body
router.post("/", isUserAuthenticated,  createLeave);
router.put("/:id", isUserAuthenticated, updateLeave);
router.delete("/:leaveId", isUserAuthenticated, deleteLeave);

export default router;
