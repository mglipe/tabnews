import { Client } from "pg";
import { ServeiceError } from "./error";
async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const query = await client.query(queryObject);
    return query;
  } catch (error) {
    const serviceErrorObject = new ServeiceError({
      message: "Error on conection with database or on Query",
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSL(),
  });

  await client.connect();

  return client;
}

function getSSL() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

export default {
  query: query,
  getNewClient: getNewClient,
};
