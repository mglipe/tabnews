export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Erro interno não esperado", {
      cause,
    });

    this.name = "Internal server error";
    this.action = "Entre em contato com o suporte";
    this.statusCode = statusCode || 500;
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

export class ServeiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service unavailable", {
      cause,
    });

    this.name = "ServiceError";
    this.action = "check if the service is available";
    this.statusCode = 503;
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

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not permission for this endpoint");

    this.name = "MethodNotAllowedError";
    this.action = "Verify if th method HTTP sent is valid for this endpoint";
    this.statusCode = 405;
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

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "an error of validation happened", {
      cause,
    });

    this.name = "ValidationError";
    this.action = action || "Adjust the send datas and try again";
    this.statusCode = 400;
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
