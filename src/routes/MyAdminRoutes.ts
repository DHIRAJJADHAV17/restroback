import express from "express";
import MyAdminController from "../controllers/MyAdminController";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the user collection
 *        name:
 *          type: string
 *          description: User name
 *        email:
 *          type: string
 *          description: User email address
 *        password:
 *          type: string
 *          description: User password should be greater than 6 characters
 *      example:
 *        name: John
 *        email: johndoes@gmail.com
 *        password: test@123
 */

/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: authentication apis
 */

/**
 * @swagger
 * /api/my/admin/login:
 *   post:
 *     summary: Log in an admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newAdmin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *               example:
 *                 newAdmin:
 *                   id: "GDHJGD788BJBJ"
 *                   name: "John"
 *                   email: "johndoes@gmail.com"
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Unauthorized access"
 */

router.post("/login", MyAdminController.getAdmin);

/**
 * @swagger
 * /api/my/admin/signup:
 *   post:
 *     summary: Sign up a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Successfully created a new admin
 *       400:
 *         description: error in creating admin
 */
router.post("/signup", MyAdminController.createAdmin);

export default router;
