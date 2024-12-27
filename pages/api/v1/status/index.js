import database from "infra/database.js";

export default async function status(request, response) {
  const result = await database.query("select 1 + 1;");
  console.log(result);
  return response.json({ status: "status here" });
}
