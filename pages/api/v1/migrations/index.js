import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
export default async function migrations(request, response) {
  const defaultMigrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
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

  return response.status(405).end();
}
