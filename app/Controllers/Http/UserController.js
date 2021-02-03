"use strict";

const CustomException = use("App/Exceptions/CustomException");
const User = use("App/Models/User");

class UserController {
  async index({ response }) {
    let users = await User.all();
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
}

module.exports = UserController;
