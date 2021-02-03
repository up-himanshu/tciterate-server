"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Project extends Model {
  static _params(request) {
    return request.only(["name"]);
  }

  executions() {
    return this.hasMany("App/Models/Execution");
  }
}

module.exports = Project;
