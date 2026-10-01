import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectMongo(): Promise<void> {
  await mongoose.connect(config.mongoUrl, { dbName: config.mongoName });
  console.log(`Connected to MongoDB database: ${config.mongoName}`);
}
