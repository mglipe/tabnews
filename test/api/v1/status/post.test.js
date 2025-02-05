import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("POST /api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status", {
    method: "POST",
  });
  expect(response.status).toBe(405);

  const responseBody = await response.json();
  expect(responseBody).toEqual({
    name: "MethodNotAllowedError",
    message: "Method not permission for this endpoint",
    action: "Verify if th method HTTP sent is valid for this endpoint",
    statusCode: 405,
  });
});
