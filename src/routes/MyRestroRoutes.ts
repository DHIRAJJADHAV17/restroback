import MyRestroController from "../controllers/MyRestroController";
import AccessToken from "../middleware/AccessToken";

import express, { Request, Response, NextFunction } from "express";
import AWS from "aws-sdk";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const router = express.Router();
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID as string,
    secretAccessKey: process.env.SECRETACCESSKEY as string,
  },
  region: process.env.REGION as string,
});
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, //5mb
//   },
// });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "storeimgeons3",
    acl: "public-read",
    metadata: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, metadata?: any) => void
    ) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

/**
 *  @swagger
 *  tags:
 *    name: Restaurants Management
 *    description: manage restro with auth  api
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Restro:
 *       type: object
 *       required:
 *         - restaurantName
 *         - city
 *         - country
 *         - cuisines
 *         - menuItems
 *         - imageUrl
 *         - review
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the restaurant
 *         user:
 *           type: string
 *           description: User ID associated with the restaurant
 *         restaurantName:
 *           type: string
 *           description: Name of the restaurant
 *         city:
 *           type: string
 *           description: City where the restaurant is located
 *         country:
 *           type: string
 *           description: Country where the restaurant is located
 *         cuisines:
 *           type: array
 *           items:
 *             type: string
 *           description: List of cuisines offered by the restaurant
 *         menuItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the menu item
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the menu item
 *               _id:
 *                 type: string
 *                 description: Unique identifier of the menu item
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to an image of the restaurant
 *         review:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the reviewer
 *               rating:
 *                 type: integer
 *                 format: int32
 *                 description: Rating given by the reviewer
 *               about:
 *                 type: string
 *                 description: Review text
 *               _id:
 *                 type: string
 *                 description: Unique identifier of the review
 *         description:
 *           type: string
 *           description: Description of the restaurant
 *       example:
 *         _id: "66b1d8150e427e4e45a4cc24"
 *         user: "jhon@hmail.com"
 *         restaurantName: "The Gourmet Bistro"
 *         city: "New York"
 *         country: "USA"
 *         cuisines:
 *           - "Italian"
 *           - "French"
 *         menuItems:
 *           - name: "Spaghetti Carbonara"
 *             price: 12.99
 *             _id: "66b1d8150e427e4e45a4cc25"
 *           - name: "Beef Wellington"
 *             price: 24.99
 *             _id: "66b1d8150e427e4e45a4cc26"
 *         imageUrl: "http://example.com/image.jpg"
 *         review:
 *           - name: "John Doe"
 *             rating: 5
 *             about: "Amazing food and great ambiance!"
 *             _id: "66b1d8150e427e4e45a4cc27"
 *           - name: "Jane Smith"
 *             rating: 4
 *             about: "Great experience, but a bit pricey."
 *             _id: "66b1d8150e427e4e45a4cc28"
 *         description: "A cozy bistro offering a fine dining experience with a mix of Italian and French cuisine."
 */

/**
 * @swagger
 * /api/restro/manage:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the restaurant
 *         user:
 *           type: string
 *           description: User ID associated with the restaurant
 *         restaurantName:
 *           type: string
 *           description: Name of the restaurant
 *         city:
 *           type: string
 *           description: City where the restaurant is located
 *         country:
 *           type: string
 *           description: Country where the restaurant is located
 *         cuisines:
 *           type: array
 *           items:
 *             type: string
 *           description: List of cuisines offered by the restaurant
 *         menuItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the menu item
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the menu item
 *               _id:
 *                 type: string
 *                 description: Unique identifier of the menu item
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to an image of the restaurant
 *         review:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the reviewer
 *               rating:
 *                 type: integer
 *                 format: int32
 *                 description: Rating given by the reviewer
 *               about:
 *                 type: string
 *                 description: Review text
 *               _id:
 *                 type: string
 *                 description: Unique identifier of the review
 *     responses:
 *       201:
 *         description: Successfully created restaurant
 *       500:
 *         description: Bad request Unauthorized
 */

// router.post(
//   "/manage",
//   upload.single("imageFile"),
//   AccessToken,
//   MyRestroController.createMyRestro
// );

/**
 * @swagger
 * /api/restro/manage:
 *   get:
 *     summary: Retrieve restaurant details
 *     tags: [Restaurants Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restro'
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/manage",
  upload.single("imageFile"),
  AccessToken,
  MyRestroController.getMyRestaurant
);

/**
 * @swagger
 * /api/restro/manage:
 *   put:
 *     summary: Update an existing restaurant
 *     tags: [Restaurants Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageFile:
 *                 type: string
 *                 format: binary
 *                 description: Image file associated with the restaurant (optional)
 *               restaurantData:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the restaurant
 *                   restaurantName:
 *                     type: string
 *                     description: Name of the restaurant
 *                   city:
 *                     type: string
 *                     description: City where the restaurant is located
 *                   country:
 *                     type: string
 *                     description: Country where the restaurant is located
 *                   cuisines:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of cuisines offered by the restaurant
 *                   description:
 *                     type: string
 *                     description: Description of the restaurant
 *             required:
 *               - restaurantData
 *     responses:
 *       200:
 *         description: Successfully updated restaurant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restro'
 *       500:
 *         description: Bad request
 */
// router.put(
//   "/manage",
//   upload.single("imageFile"),
//   AccessToken,
//   MyRestroController.updateMyRestaurant
// );

export default router;
