import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants.js";

function createAccessToken(user) {
  const expToken = new Date();
  expToken.setHours(expToken.getHours() + 24);

  const payload = {
    token_type: "access",
    user_id: user._id,
    iat: Date.now(),
    exp: expToken.getTime(),
  };

  return jsonwebtoken.sign(payload, JWT_SECRET_KEY);
}

function createRefreshToken(user) {
  const expToken = new Date();
  expToken.setMonth(expToken.getMonth() + 1);

  const payload = {
    token_type: "refresh",
    user_id: user._id,
    iat: Date.now(),
    exp: expToken.getTime(),
  };

  return jsonwebtoken.sign(payload, JWT_SECRET_KEY);
}

function decoded(token) {
  try {
    return jsonwebtoken.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
}

function hasExpiredToken(token) {
  const tokenData = decoded(token);
  
  if (!tokenData) {
    return true;
  }

  const { exp } = tokenData;
  const currentDate = new Date().getTime();

  if (exp <= currentDate) {
    return true;
  }

  return false;
}

export const jwt = {
  createAccessToken,
  createRefreshToken,
  decoded,
  hasExpiredToken,
};
