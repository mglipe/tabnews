import { InternalServerError, MethodNotAllowedError } from "infra/error";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErroHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

export default {
  errorHandler: {
    onNoMatch: onNoMatchHandler,
    onError: onErroHandler,
  },
};
