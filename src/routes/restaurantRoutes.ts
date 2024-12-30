import express, {Request, Response} from 'express';
import {jwtCheck, jwtParse} from '../middleware/auth';
import { validateRestaurantInput } from '../middleware/validation';
import multer from 'multer';
import restaurantController from '../controllers/restaurantController';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});



// api/my/restaurant
router.post('/',  upload.single("imageFile"), validateRestaurantInput, jwtCheck, jwtParse, restaurantController.createRestaurant)

router.put("/", upload.single("imageFile"), validateRestaurantInput, jwtCheck, jwtParse, restaurantController.updateRestaurant);

router.get("/", jwtCheck, jwtParse, restaurantController.getCurrentRestaurant);

export default router