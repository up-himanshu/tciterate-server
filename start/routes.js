"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

const PREFIX = "api/v1";

Route.group(() => {
  Route.post("users/login", "UserController.login");
  Route.get("ping", ({ response }) => {
    response.json({ message: 20201229 });
  });
}).prefix(PREFIX);

Route.group(() => {
  //Users
  Route.get("users", "UserController.index");
  Route.post("users", "UserController.create");
  Route.delete("users", "UserController.logout");

  //Projects
  Route.get("projects", "ProjectController.index");
  Route.post("projects", "ProjectController.create");

  //Test Cases
  Route.get("testcases/:project_id", "TestCaseController.index");
  Route.post("testcases/:project_id", "TestCaseController.create");
  Route.put("testcases/:id", "TestCaseController.update");
  Route.delete("testcases/:id", "TestCaseController.destroy");

  //Executions
  Route.get("executions/:project_id", "ExecutionController.index");
  Route.post("executions/:project_id", "ExecutionController.create");

  //Execution Results
  Route.get(
    "executionresults/:execution_id",
    "ExecutionResultController.index"
  );
  Route.put("executionresults/:id", "ExecutionResultController.update");

  //Stats
  Route.get("stats", "StatController.index");
})
  .middleware(["APIAuth"])
  .prefix(PREFIX);

// Route.on("/").render("welcome");
Route.on("*").render("index");
