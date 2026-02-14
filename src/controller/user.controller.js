const userService = require("@/service/user.service");
const findAll = async (req, res) => {
  const page = +req.query.page || 1;
  const users = await userService.pagination(page, 10, {
    email: req.query.email,
  });

  if (users) {
    return res.success(users);
  }
  return res.error(404, null, "Not Found");
};
const findEmail = async (req, res) => {
  const email = String(req.query.q);

  const users = await userService.findUserAsEmail(email);
  if (users) {
    return res.success(users);
  }
  return res.error(404, null, "Not Found");
};
module.exports = { findAll, findEmail };
