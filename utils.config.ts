import dotenv from "dotenv";
dotenv.config(); // load .env

const ENV = (process.env.NODE_ENV || "PROD").toUpperCase(); // DEV, STAGING, PROD

// API URLs
export const API_URL = process.env[`API_URL_${ENV}`]!;

// UI URLs
export const UI_URL = process.env[`UI_URL_${ENV}`]!;

// User credentials
export const VALID_USER = {
  email: process.env[`VALID_USER_EMAIL_${ENV}`]!,
  password: process.env[`VALID_USER_PASSWORD_${ENV}`]!,
};
