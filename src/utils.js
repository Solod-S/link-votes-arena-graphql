const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { APP_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } =
  process.env;

const getTokenPayload = token => {
  return jwt.verify(token, APP_SECRET);
};

const getUserId = (req, authToken) => {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
};

const generateAccessToken = payload => {
  return jwt.sign(payload, APP_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION,
  });
};

const generateRefreshToken = payload => {
  return jwt.sign(payload, APP_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};

const hashPassword = async password => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  APP_SECRET,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  getUserId,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
};
