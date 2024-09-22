import { Request, Response } from "express";
import Restro from "../models/restro";
import cloudinary from "cloudinary";

const createMyRestro = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;

    const existing = await Restro.findOne({ user: email });
    if (existing) {
      return res.status(409).json({ message: "user restaurant already exits" });
    }

    // const imageUrl = await uploadImage(req.file as Express.Multer.File);
    const imageUrl = req.file
      ? (req.file as Express.MulterS3.File).location
      : "";

    const restaurant = new Restro(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = email;

    console.log(restaurant);

    await restaurant.save();
    res.status(201).json({ restro: restaurant.toObject() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    const restaurant = await Restro.findOne({ user: email });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    const restaurant = await Restro.findOne({ user: email });

    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.description = req.body.description;
    restaurant.review = req.body.review;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;

    const imageUrl = req.file
      ? (req.file as Express.MulterS3.File).location
      : "";
    restaurant.imageUrl = imageUrl;
    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};
export default {
  createMyRestro,
  getMyRestaurant,
  updateMyRestaurant,
};
