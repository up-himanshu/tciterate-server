'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table
        .integer("business_id")
        .unsigned()
        .references("id")
        .inTable("businesses")
        .notNullable();
      table
        .enu("user_type", ["admin","user"])
        .notNullable()
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropForeign("business_id")
      table.dropColumn("user_type");
    })
  }
}

module.exports = UserSchema
