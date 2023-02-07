'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExecutionSchema extends Schema {
  up () {
    this.table('executions', (table) => {
      table
        .integer("business_id")
        .unsigned()
        .references("id")
        .inTable("businesses")
        .notNullable();
    })
  }

  down () {
    this.table('executions', (table) => {
      table.dropForeign("business_id")
    })
  }
}

module.exports = ExecutionSchema
