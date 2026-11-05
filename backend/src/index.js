import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./lib/db.js";
import { eventsRouter } from "./routes/events.js";
import { joinsRouter } from "./routes/joins.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:3000").split(","),
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "Social Events API", status: "running" });
});

app.use("/api/events", eventsRouter);
app.use("/api/joins", joinsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on our side. Please try again." });
});

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

export default app;