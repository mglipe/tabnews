import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();
    const query = client.query(queryObject);
    return query;
  } catch (error) {
    await client.end();
    throw new Error("Database error: " + error);
  }
}

export default {
  query: query,
};
