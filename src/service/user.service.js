const UserModel = require("@/model/user.model");
const paginationService = require("./pagination.service");
class userService {
  model = UserModel;
  constructor() {
    paginationService.apply(this);
  }
  async findUserAsEmail(email) {
    const user = await UserModel.findAsEmail(email);
    return user;
  }
}
module.exports = new userService();
