import { config } from "dotenv";

config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!process.env.DB_HOST) {
  throw new Error("DB_HOST is not defined");
}

export default {
  // application configurations
  appName: process.env.APP_NAME,
  appPort: process.env.APP_PORT || 3000,
};
