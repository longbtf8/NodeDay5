const authConfig = require("@/config/auth");
const jwt = require("jsonwebtoken");

class AuthService {
  async signAccessToken(id) {
    const ttl = authConfig.accessTokenTTL;
    const accessToken = await jwt.sign(
      {
        sub: id,
        exp: Date.now() / 1000 + ttl,
      },
      process.env.AUTH_JWT_SECRET,
    );
    return accessToken;
  }
  async verifyAccessToken(accessToken) {
    const payload = jwt.verify(accessToken, authConfig.jwtSecret);
    return payload;
  }
}
module.exports = new AuthService();
