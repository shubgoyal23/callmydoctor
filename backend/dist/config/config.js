import dotenv from "dotenv";
dotenv.config();
const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ORIGIN?.split(";") || "https://callmydoctor-red.vercel.app",
};
export default config;
