// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

// Restores a User
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) {
    console.log(req.user);
    return next();
  }

  const err = new Error("Authentication required");
  err.status = 401;
  return next(err);
};

const checkDate = function (req, _res, next) {
  const now = new Date().getTime();
  let { startDate, endDate } = req.body;
  startDate = new Date(startDate).getTime();
  endDate = new Date(endDate).getTime();

  if (endDate > startDate && startDate >= now) return next();

  const err = new Error("Bad Request");
  err.errors = {};

  if (endDate <= startDate) {
    err.errors.endDate = "endDate cannot be on or before startDate";
  }

  if (startDate < now) {
    err.errors.startDate = "startDate cannot be in the past";
  }
  err.status = 400;
  return next(err);
};

module.exports = { restoreUser, setTokenCookie, requireAuth, checkDate };
