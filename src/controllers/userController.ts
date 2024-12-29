import {Request, Response } from "express"
import User from "../models/user"

const createCurrentUser = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const {auth0Id} = req.body;
        const existingUser = await User.findOne({auth0Id})
        if(existingUser){
            res.status(200).json({message: "User already exists"})
            return;  // Exit the function early if user already exists
        }
        const newUser = new User(req.body)
        await newUser.save()
        res.status(201).json(newUser.toObject()) // .toObject() Converts this document into a plain-old JavaScript object
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error creating User"})
    }

}

const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const updatedUser = await User.findById(req.userId)
        if(!updatedUser){
            res.status(404).json({message: "User not found"})
            return;
        }
        updatedUser.name = name;
        updatedUser.addressLine1 = addressLine1;
        updatedUser.country = country;
        updatedUser.city = city;

        await updatedUser.save()

        res.status(200).send(updatedUser)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error updating User"})
    }
}

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUser = await User.findOne({_id:req.userId})
        if(!currentUser){
            res.status(404).json({message: "User not found"})
            return;
        }
        res.status(200).json(currentUser)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error retrieving User"})
    }
}

export default { createCurrentUser, updateCurrentUser, getCurrentUser }
