const bcrypt = require("bcrypt");
const authService = require("@/service/auth.service");
const authConfig = require("@/config/auth");
const authModel = require("@/model/auth.model");
const { isValidEmail, isValidPassword } = require("@/utils/validator");

const register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);

  if (!isValidEmail(email)) {
    return res.error(400, null, "Email không hợp lệ");
  }
  if (!isValidPassword(password)) {
    return res.error(400, null, "Mật khẩu phải có ít nhất 6 ký tự");
  }

  // Kiểm tra email tồn tại
  const existingUser = await authModel.getInfoUserLogin(email);
  if (existingUser) {
    return res.error(400, null, "Email đã tồn tại");
  }
  const insertId = await authModel.registerUser(email, hashedPassword);

  const accessToken = await authService.signAccessToken(insertId);
  const newUser = {
    id: insertId,
    email,
    access_token: accessToken,
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
      access_token: accessToken,
    });
  }

  return res.error(401, null, "Unauthorized");
};
const getInfoUser = async (req, res) => {
  return res.success(req.currentUser);
};
module.exports = { register, login, getInfoUser };
