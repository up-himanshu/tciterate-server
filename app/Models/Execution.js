"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Execution extends Model {
  static _params(request) {
    return request.only([
      "name",
      "type",
      "unexecuted",
      "pass",
      "fail",
      "blocked",
      "total",
    ]);
  }
}

module.exports = Execution;
