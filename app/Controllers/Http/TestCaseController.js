"use strict";

const TestCase = use("App/Models/TestCase");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with testcases
 */
class TestCaseController {
  /**
   * Show a list of all testcases.
   * GET testcases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, params }) {
    try {
      let list = await TestCase.query()
        .where({ project_id: params.project_id })
        .fetch();
      response.json(list);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Render a form to be used for creating a new testcase.
   * GET testcases/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth, params }) {
    let reqData = TestCase._params(request);
    reqData.project_id = params.project_id;
    reqData.user_id = auth.user.id;
    try {
      let resObj = await TestCase.create(reqData);
      response.status(201).json(resObj);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create/save a new testcase.
   * POST testcases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single testcase.
   * GET testcases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing testcase.
   * GET testcases/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update testcase details.
   * PUT or PATCH testcases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    try {
      let reqData = TestCase._params(request);
      let row = await TestCase.findByOrFail("id", params.id);
      row.title = reqData.title || row.title;
      row.description = reqData.description || row.description;
      row.expected_results = reqData.expected_results || row.expected_results;
      row.save();
      response.json(row);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a testcase with id.
   * DELETE testcases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      let row = await TestCase.findByOrFail("id", params.id);
      row.delete();
      response.json({ message: "Success" });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TestCaseController;
