import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

const defaultMigrationOptions = {
  //databaseUrl: process.env.DATABASE_URL,
  dir: join("infra", "migrations"),
  direction: "up",
  dryRun: true,
  //tunelamento dos logs
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPedingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrate = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendingMigrate;
  } finally {
    await dbClient.end();
  }
}

async function runMigrate() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrate = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrate;
  } finally {
    await dbClient.end();
  }
}

const migration = {
  listPedingMigrations,
  runMigrate,
};

export default migration;
