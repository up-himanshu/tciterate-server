'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExecutionResultSchema extends Schema {
  up () {
    this.table('execution_results', (table) => {
      table
        .integer("business_id")
        .unsigned()
        .references("id")
        .inTable("businesses")
        .notNullable();
    })
  }

  down () {
    this.table('execution_results', (table) => {
      table.dropForeign("business_id")
    })
  }
}

module.exports = ExecutionResultSchema
