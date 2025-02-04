export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Erro interno não esperado", {
      cause,
    });

    this.name = "Internal server error";
    this.action = "Entre em contato com o suporte";
    this.statusCode = 500;
  }

  //override
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
