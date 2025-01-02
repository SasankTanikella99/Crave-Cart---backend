import express from 'express';
import {param} from 'express-validator';
import {jwtCheck, jwtParse} from '../middleware/auth';
import allRestaurantsController from '../controllers/allRestaurantsController';


const router = express.Router();


// /api/restaurants/search/London
router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be required"), allRestaurantsController.searchRestaurants)

export default router