const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

module.exports = {
  /*********************************************/
  /************** SIGN UP A USER ***************/
  /*********************************************/
  addUser: async function (req, res, next) {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const checkDupe = await User.findOne({
      where: {
        [Op.or]: {
          email,
          username,
        },
      },
    });

    if (!checkDupe) {
      const user = await User.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName,
      });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser,
      });
    }
    const err = new Error("User already exists");
    err.errors = {};
    if (checkDupe.dataValues.email === email) {
      err.errors.email = "User with that email already exists";
    }

    if (checkDupe.dataValues.username === username) {
      err.errors.username = "User with that username already exists";
    }

    return next(err);
  },
  /*********************************************/
  /***************** MIDDLEWARE ****************/
  validateSignup: [
    check("email")
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Invalid email"),
    check("username")
      .exists({ checkFalsy: true })
      .withMessage("Username is required"),
    check("firstName")
      .exists({ checkFalsy: true })
      .withMessage("First Name is required"),
    check("lastName")
      .exists({ checkFalsy: true })
      .withMessage("Last Name is required"),
    handleValidationErrors,
  ],
};
