import "dotenv/config";
import express from "express";
import router from "./routers/index.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./../lib/socket.js";

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use("/api/v1", router);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
