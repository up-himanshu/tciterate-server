"use strict";

const CustomException = use("App/Exceptions/CustomException");
const ExecutionResult = use("App/Models/ExecutionResult");
const Execution = use("App/Models/Execution");
const TestCase = use("App/Models/TestCase");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with executionresults
 */
class ExecutionResultController {
  /**
   * Show a list of all executionresults.
   * GET executionresults
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, params, auth}) {
    try {
      let info = await Execution.findByOrFail({
        id: params.execution_id,
      });
      let data = await ExecutionResult.query()
        .with("test_case")
        .where({
          execution_id: params.execution_id,
          business_id: auth.user.business_id
        })
        .fetch();
      info.test_cases = data;
      response.json(info);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Render a form to be used for creating a new executionresult.
   * GET executionresults/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new executionresult.
   * POST executionresults
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single executionresult.
   * GET executionresults/:id
   *
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

  requireActualResult(status) {
    if (status == "passed" || status == "unexecuted") {
      return false;
    } else return true;
  }

  /**
   * Update executionresult details.
   * PUT or PATCH executionresults/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    try {
      let reqData = ExecutionResult._params(request);
      let row = await ExecutionResult.findByOrFail("id", params.id);
      let testCase = await TestCase.findByOrFail({ id: row.test_case_id });
      let operation = row.status + "-" + reqData.status;
      if (this.requireActualResult(reqData.status) && !reqData.actual_results) {
        throw new CustomException("Actual Results are missing.", 400);
      }
      row.user_id = auth.user.id;
      row.status = reqData.status || row.status;
      row.actual_results =
        reqData.status == "passed"
          ? "Same as expected."
          : reqData.status == "unexecuted"
          ? null
          : reqData.actual_results;
      let execution = await Execution.findByOrFail({ id: row.execution_id });
      console.log("operation", operation);
      switch (operation) {
        case "passed-failed":
          execution.passed = execution.passed - 1;
          execution.failed = execution.failed + 1;
          break;
        case "passed-blocked":
          execution.passed = execution.passed - 1;
          execution.blocked = execution.blocked + 1;
          break;
        case "passed-unexecuted":
          execution.passed = execution.passed - 1;
          execution.unexecuted = execution.unexecuted + 1;
          break;
        case "failed-passed":
          execution.failed = execution.failed - 1;
          execution.passed = execution.passed + 1;
          break;
        case "failed-blocked":
          execution.failed = execution.failed - 1;
          execution.blocked = execution.blocked + 1;
          break;
        case "failed-unexecuted":
          execution.failed = execution.failed - 1;
          execution.unexecuted = execution.unexecuted + 1;
          break;
        case "blocked-passed":
          execution.blocked = execution.blocked - 1;
          execution.passed = execution.passed + 1;
          break;
        case "blocked-failed":
          execution.blocked = execution.blocked - 1;
          execution.failed = execution.failed + 1;
          break;
        case "blocked-unexecuted":
          execution.blocked = execution.blocked - 1;
          execution.unexecuted = execution.unexecuted + 1;
          break;
        case "unexecuted-passed":
          console.log("HERE");
          execution.unexecuted = execution.unexecuted - 1;
          execution.passed = execution.passed + 1;
          break;
        case "unexecuted-failed":
          execution.unexecuted = execution.unexecuted - 1;
          execution.failed = execution.failed + 1;
          break;
        case "unexecuted-blocked":
          execution.unexecuted = execution.unexecuted - 1;
          execution.blocked = execution.blocked + 1;
          break;
        default:
          throw new CustomException("Not Allowed", 400);
      }
      await row.save();
      row.execution = execution;
      row.test_case = testCase;
      response.json(row);
      await execution.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a executionresult with id.
   * DELETE executionresults/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ExecutionResultController;
