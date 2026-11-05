import { MongoClient, ObjectId } from "mongodb";

let client;
let db;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.DB_NAME || "social_events");

  const eventsCollection = db.collection("events");
  await eventsCollection.createIndexes([
    { key: { eventDate: 1 } },
    { key: { creatorEmail: 1 } }
  ]);

  const joinsCollection = db.collection("joins");
  await joinsCollection.createIndexes([
    { key: { eventId: 1, userEmail: 1 }, unique: true },
    { key: { userEmail: 1 } }
  ]);
}

export const events = () => db.collection("events");
export const joins = () => db.collection("joins");