"use strict";

const Execution = use("App/Models/Execution");
const TestCase = use("App/Models/TestCase");
const ExecutionResult = use("App/Models/ExecutionResult");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with executions
 */
class ExecutionController {
  /**
   * Show a list of all executions.
   * GET executions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, params, auth}) {
    try {
      let list = await Execution.query()
        .where({
          project_id: params.project_id,
          business_id: auth.user.business_id
        })
        .fetch();
      response.json(list);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Render a form to be used for creating a new execution.
   * GET executions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth, params }) {
    try {
      let reqData = Execution._params(request);
      reqData.project_id = params.project_id;
      reqData.user_id = auth.user.id;
      reqData.business_id = auth.user.business_id;
      let totalTCCount = await TestCase.query()
        .where({ 
          project_id: params.project_id,
          business_id: auth.user.business_id
         })
        .getCount();
      reqData.type =
        totalTCCount == request.body.test_case_ids.length ? "full" : "partial";
      reqData.unexecuted = request.body.test_case_ids.length;
      reqData.total = request.body.test_case_ids.length;
      let resObj = await Execution.create(reqData);
      response.status(201).json(resObj);
      let eArray = [];
      request.body.test_case_ids.map((tcId) => {
        let obj = {};
        obj.project_id = params.project_id;
        obj.execution_id = resObj.id;
        obj.test_case_id = tcId;
        eArray.push(obj);
      });
      await ExecutionResult.createMany(eArray);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create/save a new execution.
   * POST executions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single execution.
   * GET executions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing execution.
   * GET executions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update execution details.
   * PUT or PATCH executions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a execution with id.
   * DELETE executions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ExecutionController;
