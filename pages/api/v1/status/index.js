import database from "infra/database.js";
import { InternalServerError } from "infra/error.js";
export default async function status(request, response) {
  try {
    const updateAt = new Date();
    //versão postgres
    const databaseVersion = await database.query("SHOW server_version;");
    const databaseVersionValue = parseInt(
      databaseVersion.rows[0].server_version,
    );
    //conexão máxima
    const maxConnection = await database.query("SHOW max_connections;");
    const maxConnectionValue = parseInt(maxConnection.rows[0].max_connections);

    const datname = process.env.POSTGRES_DB;
    //conexão usada
    const activeConnection = await database.query({
      text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
      values: [datname],
    });

    const activeConnectionValue = activeConnection.rows[0].count;

    return response.json({
      update_at: updateAt,
      dependencies: {
        database: {
          active_connection: activeConnectionValue,
          max_connections: maxConnectionValue,
          version: databaseVersionValue,
        },
        webservice: {},
      },
    });
  } catch (error) {
    console.error("CATCH ERROR: ");
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}
