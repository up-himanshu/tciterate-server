"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ExecutionSchema extends Schema {
  up() {
    this.create("executions", (table) => {
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
      table.string("name").notNullable();
      table.string("type").notNullable(); // full, partial
      table.integer("unexecuted").notNullable();
      table.integer("passed").notNullable().defaultTo(0);
      table.integer("failed").notNullable().defaultTo(0);
      table.integer("blocked").notNullable().defaultTo(0);
      table.integer("total").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("executions");
  }
}

module.exports = ExecutionSchema;
