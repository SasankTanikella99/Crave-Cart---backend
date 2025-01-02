import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const searchRestaurants = async (req: Request, res: Response): Promise<any> => {
    try {
        const city = req.params.city;
        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisine = (req.query.selectedCuisine as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        // Query construction
        let query: any = { city: new RegExp(city, "i") };

        if (selectedCuisine) {
            const cuisinesArray = selectedCuisine.split(",").map(cuisine => new RegExp(cuisine, "i"));
            query["cuisines"] = { $all: cuisinesArray };
        }

        if (searchQuery) {
            const searchRegExp = new RegExp(searchQuery, "i");
            query["$or"] = [
                { restaurantName: searchRegExp },
                { cuisines: { $in: [searchRegExp] } },
            ];
        }

        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        // Fetch data
        const restaurants = await Restaurant.find(query)
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize);
        
        const total = await Restaurant.countDocuments(query);

        // Response
        if (restaurants.length === 0) {
            return res.status(404).json({ message: "No restaurants found matching the criteria." });
        }

        res.json({
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error("Error during search:", error); // Log for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export default {searchRestaurants};