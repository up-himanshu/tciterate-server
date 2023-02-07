'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BusinessesSchema extends Schema {
  up () {
    this.create('businesses', (table) => {
      table.increments();
      table.string("display_name", 100).notNullable().unique();
      table.string("legal_name", 200).unique();
      table.string("slug", 20).notNullable().unique().index();
      table.string("gst", 15).unique();
      table.string("address_line1", 100);
      table.string("address_line2", 100);
      table.string("city", 50);
      table.string("state", 50);
      table.string("postal_code", 10);
      table.string("country", 30).notNullable();
      table.string("phone", 14);
      table.string("email");
      table.timestamps()
    })
  }

  down () {
    this.drop('businesses')
  }
}

module.exports = BusinessesSchema
