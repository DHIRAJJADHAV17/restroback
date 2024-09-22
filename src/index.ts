import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import AdminRoutes from "./routes/MyAdminRoutes";
import RestroRoutes from "./routes/MyRestroRoutes";
import Restro from "./routes/RestroRoute";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import AWS from "aws-sdk";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure multer to use S3

mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log("connected to database"));


const app = express();
app.use(express.json());
app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restro API Documentation",
      version: "0.1",
      description:
        "This is a Restro Manage application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:7000",
      },
      {
        url: "http://13.234.21.155",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello!" });
});

app.use("/api/my/admin", AdminRoutes);
app.use("/api/my/restro", RestroRoutes);
app.use("/api/restro", Restro);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
