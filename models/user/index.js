import database from "infra/database";
import { ValidationError } from "infra/error";
async function create(userInputValues) {
  //rules

  await validateUniqueEmail(userInputValues.email);
  await validationUniqueUser(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT 
          email 
        FROM 
          users 
        WHERE 
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The email requested already was registered.",
        action: "Use another email for signup.",
      });
    }
  }

  async function validationUniqueUser(username) {
    const results = await database.query({
      text: `
        SELECT 
          username
        FROM 
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The username requested already was registered",
        action: "use another username for signup",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
          INSERT INTO 
            users (username, email, password)
          VALUES 
            ($1, $2, $3)
          RETURNING
            *
          ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
