const { exec } = require("node:child_process");

function checkPostgres() {
  exec(
    "docker exec postgres_dev pg_isready --host localhost",
    (error, stdout) => {
      // if (error) {
      //   process.stderr.write(`❌ ERROR: ${error}`);
      //   return;
      // }

      if (stdout.search("accepting connections") === -1) {
        process.stdout.write(".");
        checkPostgres();
        return;
      }

      console.log("\n🟢 conexão pronta");
    },
  );
}
process.stdout.write("\n\n🔴 esperando conexão do banco ficar pronta\n");
checkPostgres();
