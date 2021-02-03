"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ExecutionResultSchema extends Schema {
  up() {
    this.create("execution_results", (table) => {
      table.increments();
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .notNullable();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table
        .integer("execution_id")
        .unsigned()
        .references("id")
        .inTable("executions")
        .notNullable();
      table
        .integer("test_case_id")
        .unsigned()
        .references("id")
        .inTable("test_cases")
        .notNullable();
      table.string("status").notNullable().defaultTo("unexecuted"); // unexecuted, passed, failed, blocked
      table.text("actual_results");
      table.timestamps();
    });
  }

  down() {
    this.drop("execution_results");
  }
}

module.exports = ExecutionResultSchema;
