import database from "infra/database";
import orchestrator from "test/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
test("POST endpoint user", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "emailduplicado",
      email: "duplicado@gmail.com",
      password: "senha123",
    }),
  });

  const users = await database.query("select * from users");
  console.log(users.rows);

  expect(response1.status).toBe(201);

  // const responseBody = await response1.json();

  // expect(responseBody).toEqual({
  //   id: responseBody.id,
  //   username: "Marcelo",
  //   email: "marcelogarcia000@gmail.com",
  //   password: "senha123",
  //   create_at: responseBody.create_at,
  //   update_at: responseBody.update_at,
  // });

  // expect(uuidVersion(responseBody.id)).toBe(4);
  // expect(Date.parse(responseBody.create_at)).not.toBeNaN();
  // expect(Date.parse(responseBody.update_at)).not.toBeNaN();
});

test("With duplicated 'email'", async () => {
  const response2 = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "Emailduplicado",
      email: "Duplicado@gmail.com",
      password: "senha123",
    }),
  });

  expect(response2.status).toBe(400);

  const responseBody2 = await response2.json();
  console.log(responseBody2);
  expect(responseBody2).toEqual({
    name: "ValidationError",
    message: `${responseBody2.message}`,
    action: `${responseBody2.action}`,
    statusCode: 400,
  });
});
