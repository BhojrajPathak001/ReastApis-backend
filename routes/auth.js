const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const user = require("../models/user");
const isAuth = require("../middlware/is-auth");

const router = express.Router();
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return user.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);
router.post("/login", authController.login);
router.get("/status", isAuth, authController.getUserStatus);
router.patch(
  "/status",
  isAuth,
  [body("status").trim().notEmpty()],
  authController.updateUserStatus
);

module.exports = router;
