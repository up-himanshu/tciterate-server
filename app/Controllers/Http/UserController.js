"use strict";

const CustomException = use("App/Exceptions/CustomException");
const User = use("App/Models/User");

class UserController {
  async index({ response }) {
    let users = await User.query()
      .withCount("test_cases")
      .withCount("executions")
      .withCount("execution_results")
      .fetch();
    response.json(users);
  }

  async login({ request, auth, response }) {
    try {
      let { email, password } = request.all();
      let token = await auth.attempt(email, password);
      if (!!token) {
        let user = await User.findByOrFail("email", email);
        Object.assign(user, token);
        response.status(201).json(user);
      } else {
        throw new CustomException("Email/Password do not match.", 401);
      }
    } catch (error) {
      throw error;
    }
  }

  async create({ request, response }) {
    let reqData = User._params(request);
    try {
      let resObj = await User.create(reqData);
      response.status(201).json(resObj);
    } catch (error) {
      throw error;
    }
  }

  async update({ request, response, auth }) {
    console.log("update profile request received");
    try {
      let reqData = User._params(request);
      let row = await User.findByOrFail("id", auth.user.id);
      if (reqData.password) {
        console.log("changing password");
        row.password = reqData.password;
        row.save();
      }
      console.log("responding");
      response.json(row);
    } catch (error) {
      throw error;
    }
  }

  async logout({ auth, response }) {
    await auth.authenticator("api").revokeTokens();
    return response.json({ message: "User logged out." });
  }
}

module.exports = UserController;
