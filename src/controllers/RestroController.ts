import Restro from "../models/restro";
import { Request, Response } from "express";

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restro.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const getAllRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restro.find();

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city; // Extract city from path params

    const restaurants = await Restro.find({
      $or: [
        { city: { $regex: new RegExp(city, "i") } },
        { restaurantName: { $regex: new RegExp(city, "i") } },
        { country: { $regex: new RegExp(city, "i") } },
      ],
    });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export default {
  getRestaurant,
  searchRestaurant,
  getAllRestaurant,
};
