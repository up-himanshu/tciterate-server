"use strict";

const User = use("App/Models/User");
const CustomException = use("App/Exceptions/CustomException");

class ApiAuth {
  async handle({ request, auth }, next) {
    try {
      console.log("SDFSFSFSDFSDFSDFSDFSDFSFSDFSDF");
      let { email, password } = request.all();
      let requestUrl = request.url();
      if (requestUrl == "/api/v1/users/login" && !!email && !!password) {
        let token = await auth.attempt(email, password);
        if (!!token) {
          let user = await User.findBy({ email });
          Object.assign(user, token);
          request.user = user;
          await next();
        } else {
          throw new Error("Email/Password do not match.");
        }
      } else if (!!auth.user) {
        console.log("auth.user");
        await next();
      } else if (requestUrl == "/api/v1/users/logout") {
        await next();
      } else {
        console.log("Unauthorized");
        throw new CustomException("Unauthorized", 401);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ApiAuth;
