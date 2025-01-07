test("running endpoint status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
  const reqBody = await response.json();

  const databaseVersion = reqBody.dependencies.database.version;
  expect(databaseVersion).toEqual(16.0);

  const maxConnection = reqBody.dependencies.database.max_connections;
  expect(maxConnection).toEqual(100);

  const activeConnection = reqBody.dependencies.database.active_connection;
  expect(activeConnection).toEqual(1);
});
