import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(200).send();
    }
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    const accessToken = jwt.sign({ newAdmin }, accessTokenSecret, {
      expiresIn: "7d",
    });
    res.status(201).json({ newAdmin, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error in creating admin" });
  }
};

const getAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const currentAdmin = await Admin.findOne({ email });
    if (!currentAdmin) {
      return res.status(404).json({ message: "Admin not Found" });
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    const accessToken = await jwt.sign({ currentAdmin }, accessTokenSecret, {
      expiresIn: "7d",
    });
    console.log(accessToken);

    if (
      currentAdmin.email == email &&
      (await currentAdmin.matchPassword(password))
    ) {
      return res.json({
        error: false,
        message: "login successful",
        accessToken,
        currentAdmin,
      });
    } else {
      return res.json({
        error: true,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "somthing went wrong while login" });
  }
};

export default {
  createAdmin,
  getAdmin,
};
