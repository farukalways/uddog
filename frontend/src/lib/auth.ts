import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client =
  globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI as string);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

const db = client.db(process.env.MONGODB_DB || "social_events");

export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    changeEmail: { enabled: false },
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
  hooks: {
    // Server-side password rule: one uppercase, one lowercase, at least 6 characters
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = (ctx.body as { password?: string } | undefined)?.password ?? "";
        if (!PASSWORD_RULE.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 6 characters and include an uppercase and a lowercase letter.",
          });
        }
      }
    }),
  },
});
