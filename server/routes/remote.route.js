// remoteWorkRoutes.js

import express from "express";
import {
  createRemoteWork,
  getAllRemoteWorksController,
  updateRemoteWork,
  deleteRemoteWork,
  getUserProjects,
  getAllRemoteWorksByEmail, getStatusOfEmployees, // Import the controller for fetching remote works by user email
} from "../controllers/remote/remote.controller.js"; // Adjust the path as per your project structure
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'; // Adjust the path as per your project structure
import {PROJECT_MANAGER_ROLE, SUPERUSER_ROLE} from '../constants/constants.js'; // Adjust the path as per your project structure

const router = express.Router();

router.get("/", isUserAuthenticated, checkUserRole([SUPERUSER_ROLE]), getAllRemoteWorksController);
router.post("/user", isUserAuthenticated, getAllRemoteWorksByEmail); // Route for fetching remote works by user email in the body
router.post("/", isUserAuthenticated, createRemoteWork);
router.put("/:id", isUserAuthenticated, updateRemoteWork);
router.delete("/:remoteWorkId", isUserAuthenticated, deleteRemoteWork);
router.post("/status", isUserAuthenticated,checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]), getStatusOfEmployees);
router.post('/projects', isUserAuthenticated, getUserProjects);

export default router;
