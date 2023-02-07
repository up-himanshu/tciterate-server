"use strict";

const Business = use("App/Models/Business");

/*
|--------------------------------------------------------------------------
| BusinessSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

class BusinessSeeder {
  async run() {
    await Business.create({
      display_name: "Test Business",
      slug: "test-business",
			country: "India"
    });
  }
}

module.exports = BusinessSeeder;