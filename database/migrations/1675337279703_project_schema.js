'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectSchema extends Schema {
  up () {
    this.table('projects', (table) => {
      table
        .integer("business_id")
        .unsigned()
        .references("id")
        .inTable("businesses")
        .notNullable();
    })
  }

  down () {
    this.table('projects', (table) => {
      table.dropForeign("business_id")
    })
  }
}

module.exports = ProjectSchema
