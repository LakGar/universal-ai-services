# Appwrite Setup Guide

## Installation Complete ✅

Appwrite SDK has been installed. Now you need to:

## 1. Configure Environment Variables

Create a `.env.local` file in the root directory with your Appwrite credentials:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id-here

# Appwrite API Keys (Server-side only - never expose in client)
APPWRITE_API_KEY=your-api-key-here

# Appwrite Collections (you'll create these in Appwrite dashboard)
NEXT_PUBLIC_APPWRITE_COLLECTION_ROBOTS=your-robots-collection-id
NEXT_PUBLIC_APPWRITE_COLLECTION_USERS=your-users-collection-id
NEXT_PUBLIC_APPWRITE_COLLECTION_ORDERS=your-orders-collection-id
NEXT_PUBLIC_APPWRITE_COLLECTION_ACCESSORIES=your-accessories-collection-id

# Appwrite Storage Buckets
NEXT_PUBLIC_APPWRITE_BUCKET_IMAGES=your-images-bucket-id
NEXT_PUBLIC_APPWRITE_BUCKET_VIDEOS=your-videos-bucket-id
```

## 2. Get Your Appwrite Credentials

1. **Endpoint**:

   - Cloud: `https://cloud.appwrite.io/v1`
   - Self-hosted: `https://your-domain.com/v1`

2. **Project ID**:

   - Go to Appwrite Dashboard → Your Project → Settings → Project ID

3. **Database ID**:

   - Create a Database in Appwrite Dashboard → Databases → Create Database
   - Copy the Database ID

4. **API Key**:
   - Go to Appwrite Dashboard → Your Project → Settings → API Keys
   - Create a new API Key with appropriate scopes (read, write, delete)

## 3. Create Collections in Appwrite

You'll need to create these collections in your Appwrite database:

### Robots Collection

- Collection ID: `robots` (or your preferred name)
- Permissions:
  - Read: `any` (public)
  - Create/Update/Delete: `users` with role `admin`

### Users Collection (for user profiles)

- Collection ID: `userProfiles`
- Permissions:
  - Read: `users` (own profile)
  - Create/Update: `users` (own profile)
  - Delete: `users` with role `admin`

### Orders Collection

- Collection ID: `orders`
- Permissions:
  - Read: `users` (own orders)
  - Create: `users`
  - Update/Delete: `users` with role `admin`

### Accessories Collection

- Collection ID: `accessories`
- Permissions:
  - Read: `any` (public)
  - Create/Update/Delete: `users` with role `admin`

## 4. Create Storage Buckets

### Images Bucket

- Bucket ID: `robot-images`
- Permissions:
  - Read: `any` (public)
  - Create/Update/Delete: `users` with role `admin`

### Videos Bucket

- Bucket ID: `robot-videos`
- Permissions:
  - Read: `any` (public)
  - Create/Update/Delete: `users` with role `admin`

## 5. Next Steps

After setting up your environment variables:

1. Update `.env.local` with your actual credentials
2. The Appwrite client is already configured in `lib/appwrite.ts`
3. You can now use Appwrite services in your components

## Example Usage

```typescript
import { databases, COLLECTIONS, DATABASE_ID } from "@/lib/appwrite";
import { ID } from "appwrite";

// Create a robot
const createRobot = async (robotData: any) => {
  return await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ROBOTS,
    ID.unique(),
    robotData
  );
};

// Get all robots
const getRobots = async () => {
  return await databases.listDocuments(DATABASE_ID, COLLECTIONS.ROBOTS);
};
```


