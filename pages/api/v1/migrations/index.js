import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ Erro: `method: ${request.method} not allowed` });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      //databaseUrl: process.env.DATABASE_URL,
      dbClient: dbClient,
      dir: join("infra", "migrations"),
      direction: "up",
      dryRun: true,
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "POST") {
      const migratedMigrate = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrate.length > 0) {
        return response.status(201).json(migratedMigrate);
      }

      return response.status(200).json(migratedMigrate);
    }

    if (request.method === "GET") {
      const pendingMigrate = await migrationRunner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrate);
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
