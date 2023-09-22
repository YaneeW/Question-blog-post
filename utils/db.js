// Todo: Setup database connection here
import { MongoClient } from "mongodb";

const connectString = "mongodb://127.0.0.1:27017";
export const client = new MongoClient(connectString, {
  useUnifiedTopology: true,
});

export const db = client.db("practice-mongo");
