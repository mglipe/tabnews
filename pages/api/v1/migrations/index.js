import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

const defaultMigrationOptions = {
  //databaseUrl: process.env.DATABASE_URL,
  dir: join("infra", "migrations"),
  direction: "up",
  dryRun: true,
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrate = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return response.status(200).json(pendingMigrate);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrate = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrate.length > 0) {
      return response.status(201).json(migratedMigrate);
    }

    return response.status(200).json(migratedMigrate);
  } finally {
    await dbClient.end();
  }
}
