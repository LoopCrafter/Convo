import "dotenv/config";
import express from "express";
import router from "./routers/index.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 10000;

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

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(distPath));

  app.get(/.*/, (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    res.sendFile(indexPath);
  });
} else {
  app.get("/", (req, res) => {
    res.send("Dev mode!");
  });
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});
