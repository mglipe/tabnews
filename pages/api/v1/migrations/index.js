import { createRouter } from "next-connect";
import controller from "infra/controller";
import migration from "models/migrator";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandler);

async function getHandler(request, response) {
  const pendingMigrate = await migration.listPedingMigrations();
  return response.status(200).json(pendingMigrate);
}

async function postHandler(request, response) {
  const migratedMigrate = await migration.runMigrate();

  if (migratedMigrate.length > 0) {
    return response.status(201).json(migratedMigrate);
  }

  return response.status(200).json(migratedMigrate);
}
