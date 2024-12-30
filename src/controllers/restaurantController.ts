import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from 'cloudinary';
import mongoose from "mongoose";
import {validationResult} from "express-validator"

// Create restaurant controller
const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
      }

      // Check for file
      if (!req.file) {
          res.status(400).json({ 
              errors: [{ 
                  type: 'field',
                  msg: 'Image file is required',
                  path: 'imageFile',
                  location: 'body'
              }]
          });
          return;
      }

      // Check for existing restaurant
      const existingRestaurant = await Restaurant.findOne({ user: req.userId });
      if (existingRestaurant) {
          res.status(400).json({ 
              errors: [{ 
                  type: 'field',
                  msg: 'User already has a restaurant',
                  path: 'user',
                  location: 'body'
              }]
          });
          return;
      }

      // Process image
      // const image = req.file;
      // const base64Image = Buffer.from(image.buffer).toString('base64');
      // const dataURI = `data:${image.mimetype};base64,${base64Image}`;

      // // Upload to Cloudinary
      // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
      const imageURL= await uploadImage(req.file as Express.Multer.File)

      // Create restaurant with validated data
      const newRestaurant = new Restaurant({
          restaurantName: req.body.restaurantName,
          city: req.body.city,
          country: req.body.country,
          deliveryPrice: parseInt(req.body.deliveryPrice),
          estimatedDeliveryTime: parseInt(req.body.estimatedDeliveryTime),
          cuisines: req.body.cuisines,
          menuItems: req.body.menuItems.map((item: any) => ({
              name: item.name,
              price: parseInt(item.price)
          })),
          imageUrl: imageURL,
          user: new mongoose.Types.ObjectId(req.userId),
          lastUpdated: new Date()
      });

      await newRestaurant.save();
      res.status(201).json(newRestaurant);
  } catch (error) {
      console.error('Restaurant creation error:', error);
      res.status(500).json({ 
          errors: [{ 
              type: 'server',
              msg: 'Error creating restaurant',
              path: null,
              location: 'server'
          }]
      });
  }
};

// Get current restaurant controller
const getCurrentRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
      const restaurant = await Restaurant.findOne({ user: req.userId });

      if (!restaurant) {
          res.status(404).json({ message: "Restaurant not found" });
          return;
      }

      res.status(200).json(restaurant);
  } catch (error) {
      console.error('Restaurant retrieval error:', error);
      res.status(500).json({ message: "Error retrieving restaurant" });
  }
};


const updateRestaurant = async ( req: Request, res: Response): Promise<void> => {
  try {
    const editRestaurant = await Restaurant.findOne({
      user: req.userId,
    })
    if (!editRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }
    editRestaurant.restaurantName = req.body.restaurantName;
    editRestaurant.city = req.body.city;
    editRestaurant.country = req.body.country;
    editRestaurant.deliveryPrice = req.body.deliveryPrice;
    editRestaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime
    editRestaurant.cuisines = req.body.cuisines;
    editRestaurant.menuItems = req.body.menuItems
    editRestaurant.lastUpdated = new Date();
    if(req.file){
      const imageURL= await uploadImage(req.file as Express.Multer.File)
      editRestaurant.imageUrl = imageURL
    }
    await editRestaurant.save();
    res.status(200).send(editRestaurant);
  } catch (error) {
    console.error('Restaurant update error:', error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
}

const uploadImage= async (file:Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString('base64');
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
}

export default { createRestaurant, getCurrentRestaurant, updateRestaurant };


