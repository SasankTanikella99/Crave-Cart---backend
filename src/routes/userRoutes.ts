import express from 'express';
import userController from "../controllers/userController"

import {jwtCheck, jwtParse} from '../middleware/auth';
import { validateMyUserRequest } from '../middleware/validation';

const router = express.Router();

// /api/my/user
router.post("/", jwtCheck, userController.createCurrentUser);

router.put("/", jwtCheck, jwtParse, validateMyUserRequest, userController.updateCurrentUser)

router.get("/", jwtCheck, jwtParse, userController.getCurrentUser)

export default router;