const db = require("@/config/database");
const authService = require("@/service/auth.service");
const jwt = require("jsonwebtoken");

async function authRequired(req, res, next) {
  const accessToken = req.headers?.authorization?.slice(6)?.trim();
  const payload = await authService.verifyAccessToken(accessToken);
  if (payload.exp < Date.now() / 1000) {
    return res.error(401, null, "Unauthorized");
  }
  const [users] = await db.query(
    `select id,email,created_at from users where id=?`,
    [payload.sub],
  );
  const user = users[0];
  if (!user) {
    return res.error(401, null, "Unauthorized");
  }
  req.currentUser = user;
  next();
}

module.exports = authRequired;
