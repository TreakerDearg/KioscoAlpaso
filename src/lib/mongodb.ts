import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
let client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usamos una variable global para no saturar la base de datos
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;