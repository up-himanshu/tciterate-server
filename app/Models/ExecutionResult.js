"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ExecutionResult extends Model {
  static _params(request) {
    return request.only(["status", "actual_results"]);
  }

  test_case() {
    return this.belongsTo("App/Models/TestCase");
  }
}

module.exports = ExecutionResult;
