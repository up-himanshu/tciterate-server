"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TestCaseSchema extends Schema {
  up() {
    this.create("test_cases", (table) => {
      table.increments();
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .notNullable();
      table.string("title").notNullable();
      table.text("description");
      table.text("expected_results").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("test_cases");
  }
}

module.exports = TestCaseSchema;
