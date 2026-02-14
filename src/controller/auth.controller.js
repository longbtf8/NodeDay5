const bcrypt = require("bcrypt");
const authService = require("@/service/auth.service");
const authConfig = require("@/config/auth");
const authModel = require("@/model/auth.model");

const register = async (req, res) => {
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, authConfig.saltRounds);

  const insertId = await authModel.registerUser(email, password);

  const accessToken = await authService.signAccessToken(insertId);
  const newUser = {
    id: insertId,
    email,
    accessToken: accessToken,
  };

  return res.success(newUser);
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authModel.getInfoUserLogin(email);
  if (!user) {
    return res.error(401, null, " Resource not found");
  }
  const result = await bcrypt.compare(password, user.password);
  if (result) {
    const accessToken = await authService.signAccessToken(user.id);

    return res.success({
      id: user.id,
      email: user.email,
      access_Token: accessToken,
    });
  }

  return res.error(401, null, "Unauthorized");
};
const getInfoUser = async (req, res) => {
  return res.success(req.currentUser);
};
module.exports = { register, login, getInfoUser };
