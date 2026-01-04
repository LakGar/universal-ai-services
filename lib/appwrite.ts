import { Client, Account, Databases, Storage, ID } from "appwrite";

// Client configuration
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

// Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const COLLECTIONS = {
  ROBOTS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROBOTS || "",
  USERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS || "",
  ORDERS: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ORDERS || "",
  ACCESSORIES: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ACCESSORIES || "",
};

// Storage Bucket IDs
export const BUCKETS = {
  IMAGES: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_IMAGES || "",
  VIDEOS: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_VIDEOS || "",
};

// Helper to get ID
export { ID };

// Export client for advanced usage
export { client };



