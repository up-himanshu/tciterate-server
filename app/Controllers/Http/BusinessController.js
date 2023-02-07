"use strict";

const Business = use("App/Models/Business");
const User = use("App/Models/User");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with executionresults
 */
class BusinessController {
  /**
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, params, auth }) {
    try {
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response }) {
    try {
      let reqData = Business._params(request);
      console.log("reqData", reqData);
      let email = request.body.email;
      let password = request.body.password;
      console.log("email and password", email, password);
      let business = await Business.create(reqData);
      console.log("business create", business);
      let user = await User.create({
        business_id: business.id,
        email,
        password,
        user_type: "admin",
      });
      console.log("business user create", user);
      response.json({ message: "success" });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing executionresult.
   * GET executionresults/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    try {
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = BusinessController;
