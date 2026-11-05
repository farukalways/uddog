import { Router } from "express";
import { joins } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

export const joinsRouter = Router();

// GET /api/joins/mine -> events joined by the logged-in user, sorted by event date
joinsRouter.get("/mine", requireAuth, async (req, res) => {
  const data = await joins()
    .aggregate([
      { $match: { userEmail: req.user.email } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 1,
          joinedAt: 1,
          event: 1,
        },
      },
      { $sort: { "event.eventDate": 1 } },
    ])
    .toArray();
  res.json(data);
});