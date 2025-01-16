import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    //databaseUrl: process.env.DATABASE_URL,
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    dryRun: true,
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const methods = ["GET", "POST"];

  if (!methods.includes(request.method)) {
    await dbClient.end();
    return response.status(401).json({ Erro: "Unauthorized" });
  }

  if (request.method === "POST") {
    const migratedMigrate = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrate.length > 0) {
      return response.status(201).json(migratedMigrate);
    }

    return response.status(200).json(migratedMigrate);
  }

  if (request.method === "GET") {
    const pendingMigrate = await migrationRunner(defaultMigrationOptions);

    await dbClient.end();

    return response.status(200).json(pendingMigrate);
  }

  return response.status(405).end();
}
