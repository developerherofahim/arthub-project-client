import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const authBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";
const authIssuer = new URL(authBaseURL).origin;

let client;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db("arthub-project-db");

export const auth = betterAuth({
  baseURL: authBaseURL,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: true,
      },
      subscriptionTier: {
        type: "string",
        defaultValue: "free",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "artist" ? "artist" : "user",
            subscriptionTier: "free",
          },
        }),
      },
      update: {
        before: async (user) => {
          const safeUser = { ...user };
          delete safeUser.role;
          delete safeUser.subscriptionTier;
          return { data: safeUser };
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: authIssuer,
        audience: authIssuer,
        definePayload: ({ user }) => ({
          email: user.email,
          role: user.role || "user",
        }),
      },
    }),
  ],
});