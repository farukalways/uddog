import { Router } from "express";
import { ObjectId } from "mongodb";
import { events, joins } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Distribution",
  "Blood Donation",
  "Other",
];

function parseId(raw) {
  return typeof raw === "string" && ObjectId.isValid(raw) ? new ObjectId(raw) : null;
}

/** Adds participantsCount to events using the joins collection. */
function withParticipants(match) {
  return [
    { $match: match },
    {
      $lookup: {
        from: "joins",
        localField: "_id",
        foreignField: "eventId",
        as: "participants",
      },
    },
    { $addFields: { participantsCount: { $size: "$participants" } } },
    { $project: { participants: 0 } },
  ];
}

export const eventsRouter = Router();

// GET /api/events/types
eventsRouter.get("/types", (_req, res) => {
  res.json(EVENT_TYPES);
});

// GET /api/events  -> upcoming events only (public)
eventsRouter.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 0, 100);
  const type = typeof req.query.type === "string" ? req.query.type : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const match = { eventDate: { $gte: new Date() } };
  if (type && type !== "All") match.eventType = type;
  if (search) {
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    match.$or = [
      { title: { $regex: safe, $options: "i" } },
      { location: { $regex: safe, $options: "i" } },
    ];
  }

  const pipeline = withParticipants(match);
  if (limit > 0) pipeline.push({ $limit: limit });

  const data = await events().aggregate(pipeline).toArray();
  res.json(data);
});

// GET /api/events/mine -> events created by the logged-in user
eventsRouter.get("/mine", requireAuth, async (req, res) => {
  const data = await events()
    .aggregate([
      ...withParticipants({ creatorEmail: req.user.email }),
      { $sort: { eventDate: 1 } },
    ])
    .toArray();
  res.json(data);
});

// GET /api/events/:id (public)
eventsRouter.get("/:id", async (req, res) => {
  const _id = parseId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid event id." });

  const [event] = await events().aggregate(withParticipants({ _id })).toArray();
  if (!event) return res.status(404).json({ message: "This event could not be found." });
  res.json(event);
});

// POST /api/events (private)
eventsRouter.post("/", requireAuth, async (req, res) => {
  const { title, description, eventType, thumbnail, location, eventDate } = req.body;

  if (!title || !description || !eventType || !thumbnail || !location || !eventDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const parsedDate = new Date(eventDate);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() <= Date.now()) {
    return res.status(400).json({ message: "Event date must be a valid future date." });
  }

  const doc = {
    title,
    description,
    eventType,
    thumbnail,
    location,
    eventDate: parsedDate,
    creatorEmail: req.user.email,
    creatorName: req.user.name,
    createdAt: new Date(),
  };

  const result = await events().insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
});

// PUT /api/events/:id (private, owner only)
eventsRouter.put("/:id", requireAuth, async (req, res) => {
  const _id = parseId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid event id." });

  const { title, description, eventType, thumbnail, location, eventDate } = req.body;

  if (!title || !description || !eventType || !thumbnail || !location || !eventDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const parsedDate = new Date(eventDate);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() <= Date.now()) {
    return res.status(400).json({ message: "Event date must be a valid future date." });
  }

  const existing = await events().findOne({ _id });
  if (!existing) return res.status(404).json({ message: "This event could not be found." });
  if (existing.creatorEmail !== req.user.email) {
    return res.status(403).json({ message: "You can only update events you created." });
  }

  await events().updateOne(
    { _id },
    { $set: { title, description, eventType, thumbnail, location, eventDate: parsedDate } },
  );
  res.json({ message: "Event updated successfully." });
});

// DELETE /api/events/:id (private, owner only)
eventsRouter.delete("/:id", requireAuth, async (req, res) => {
  const _id = parseId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid event id." });

  const existing = await events().findOne({ _id });
  if (!existing) return res.status(404).json({ message: "This event could not be found." });
  if (existing.creatorEmail !== req.user.email) {
    return res.status(403).json({ message: "You can only delete events you created." });
  }

  await events().deleteOne({ _id });
  await joins().deleteMany({ eventId: _id });
  res.json({ message: "Event deleted successfully." });
});

// POST /api/events/:id/join (private)
eventsRouter.post("/:id/join", requireAuth, async (req, res) => {
  const _id = parseId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid event id." });

  const event = await events().findOne({ _id });
  if (!event) return res.status(404).json({ message: "This event could not be found." });
  if (event.eventDate.getTime() < Date.now()) {
    return res.status(400).json({ message: "This event has already taken place." });
  }

  try {
    await joins().insertOne({
      eventId: _id,
      userEmail: req.user.email,
      userName: req.user.name,
      joinedAt: new Date(),
    });
  } catch (err) {
    if (typeof err === "object" && err && "code" in err && err.code === 11000) {
      return res.status(409).json({ message: "You have already joined this event." });
    }
    throw err;
  }
  res.status(201).json({ message: "You have joined this event." });
});

// GET /api/events/:id/joined (private) -> has the current user joined?
eventsRouter.get("/:id/joined", requireAuth, async (req, res) => {
  const _id = parseId(req.params.id);
  if (!_id) return res.status(400).json({ message: "Invalid event id." });
  const found = await joins().findOne({ eventId: _id, userEmail: req.user.email });
  res.json({ joined: Boolean(found) });
});