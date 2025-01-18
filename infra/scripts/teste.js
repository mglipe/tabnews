const { exec } = require("node:child_process");

function teste() {
  exec("docker ps", (error, stdout) => {
    console.log(stdout);
  });
}

console.log("Testando comandos de terminal via scripts");
teste();
