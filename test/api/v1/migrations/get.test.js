import database from "infra/database.js";
import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await database.query("drop schema public cascade; create schema public;");
  await orchestrator.waitForAllServices();
});

test("get endpoint api/v1/migrations should be return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toEqual(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
