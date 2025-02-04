class ValidationError extends Error {
  constructor(message, status) {
    super(message, status);
    this.status = status;
  }
}

function saveUser(input) {
  if (!input) {
    throw new ReferenceError("input necessário");
  }

  if (!input.name) {
    throw new ValidationError("Preencha seu nome", 400);
  }

  return input;
}

try {
  const data = saveUser({});
  console.log("este código rodou?", data);
} catch (error) {
  if (error instanceof ReferenceError) {
    throw error;
  }

  if (error instanceof ValidationError) {
    console.log(error);
    console.log(error.status);
    return;
  }
}
