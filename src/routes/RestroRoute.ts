import express from "express";
import { param } from "express-validator";
import RestroController from "../controllers/RestroController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: API for  restaurants details
 */

/**
 * @swagger
 * /api/restro/discrip/{restaurantId}:
 *   get:
 *     summary: Get restaurant details by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurant details
 *       500:
 *         description: Invalid restaurant ID
 */

router.get(
  "/discrip/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId paramenter must be a valid string"),
  RestroController.getRestaurant
);

/**
 * @swagger
 * /api/restro:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurant details
 *       500:
 *         description: Error in finding restro

 */
router.get("/", RestroController.getAllRestaurant);

/**
 * @swagger
 * /api/restro/search/{city}:
 *   get:
 *     summary: Search for restaurants by city
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: The city to search for restaurants in
 *     responses:
 *       200:
 *         description: Successfully retrieved restaurants in the specified city
 *       500:
 *         description: An error occurred no restaurants in the specified city
 *
 *
 */

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must be a valid string"),
  RestroController.searchRestaurant
);

export default router;
