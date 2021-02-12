"use strict";

// const Env = use("Env");
const BaseExceptionHandler = use("BaseExceptionHandler");
// var bugsnag = require("@bugsnag/js");
// var bugsnagClient = bugsnag(Env.get("BUGSNAG_KEY"));

class ExceptionHandler extends BaseExceptionHandler {
  async handle(error, { response }) {
    console.log(error.code);
    switch (error.code) {
      case "ER_NO_DEFAULT_FOR_FIELD":
        return response.status(422).send({
          errorStatus: 422,
          errorMessage: error.sqlMessage || error.message,
        });

      case "ER_ROW_IS_REFERENCED_2":
        return response.status(422).send({
          errorStatus: 422,
          errorMessage: "Cannot change or delete as there are dependant items.",
        });

      case "E_MISSING_DATABASE_ROW":
        return response.status(422).send({
          errorStatus: 422,
          errorMessage: "Resource being changed or deleted.",
        });

      case "ER_DUP_ENTRY":
        return response.status(422).send({
          errorStatus: 422,
          errorMessage:
            "Duplicate value for the field `" +
            error.sqlMessage.substring(
              error.sqlMessage.lastIndexOf(
                "_",
                error.sqlMessage.lastIndexOf("_") - 1
              ) + 1,
              error.sqlMessage.lastIndexOf("_unique")
            ) +
            "` not allowed.",
        });

      case "E_USER_NOT_FOUND":
        return response.status(error.status).send({
          errorStatus: error.status,
          errorMessage: error.sqlMessage || error.message.split(": ")[1],
        });

      case "E_PASSWORD_MISMATCH":
        return response.status(401).send({
          errorStatus: 401,
          errorMessage: error.message.split(": ")[1],
        });

      case "ER_NO_REFERENCED_ROW_2":
        console.log(
          "Himanshu",
          error.sqlMessage.substring(
            error.sqlMessage.lastIndexOf("KEY (") + 5,
            error.sqlMessage.lastIndexOf(") REFERENCES")
          )
        );
        return response.status(error.status).send({
          errorStatus: 400,
          errorMessage:
            "There is no client with provided " +
            error.sqlMessage.substring(
              error.sqlMessage.lastIndexOf("KEY (") + 5,
              error.sqlMessage.lastIndexOf(") REFERENCES")
            ),
        });

      default:
        return response.status(error.status).send({
          errorStatus: error.status,
          errorMessage: error.sqlMessage || error.message,
        });
    }
  }

  async report(error, { request }) {
    if (error.status === 500) {
      //   bugsnagClient.notify(error, {
      //     metaData: {
      //       params: request.all(),
      //       headers: request.headers(),
      //       complete: request,
      //     },
      //   });
    }
  }
}

module.exports = ExceptionHandler;
