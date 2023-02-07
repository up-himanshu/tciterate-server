"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Business extends Model {
  static _params(request) {
    return request.only([
      "display_name",
      "legal_name",
      "slug",
      "gst",
      "address_line1",
      "address_line2",
      "city",
      "state",
      "postal_code",
      "country",
    ]);
  }
}

module.exports = Business;