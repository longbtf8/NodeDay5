const authConfig = {
  jwtSecret: process.env.AUTH_JWT_SECRET,
  accessTokenTTL: +process.env.AUTH_ACCESS_TOKEN_TTL || 3600,
  saltRounds: 10,
};
module.exports = authConfig;
