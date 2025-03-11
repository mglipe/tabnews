import retry from "async-retry";
import database from "infra/database";
import migration from "models/migrator";

const URL = "http://localhost:3000";

async function waitForAllServices() {
  await waitForWebServices();

  async function waitForWebServices() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage(bail, tryNumber) {
      console.log(tryNumber);
      const response = await fetch(`${URL}/api/v1/status`);

      if (response.status !== 200) {
        throw Error(`HTTP ERROR - ${response.status}`);
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public");
}

async function runPendingMigrations() {
  await migration.runMigrate();
}

export default {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};
