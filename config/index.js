import dotenv from "dotenv";

dotenv.config();

export const { PORT, DEV_MODE, DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET } =
  process.env;
