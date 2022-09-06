import { config } from "dotenv";
config();

export const PORT = 4000;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SICAAL";
