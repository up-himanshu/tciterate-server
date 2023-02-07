'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TestCaseSchema extends Schema {
  up () {
    this.table('test_cases', (table) => {
      table
        .integer("business_id")
        .unsigned()
        .references("id")
        .inTable("businesses")
        .notNullable();
    })
  }

  down () {
    this.table('test_cases', (table) => {
      table.dropForeign("business_id")
    })
  }
}

module.exports = TestCaseSchema
