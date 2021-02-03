"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class TestCase extends Model {
  static _params(request) {
    return request.only(["title", "description", "expected_results"]);
  }
}

module.exports = TestCase;
