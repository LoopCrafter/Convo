import "dotenv/config";
import express from "express";
import router from "./routers/index.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
