const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkLoggedIn } = require("../../../middleware/auth");
const { validateRequestBody } = require("../../../middleware/schemaValidator");
const { signupSchema, loginSchema } = require("../../schema/authSchema");

const authController = require("../../controllers/auth/authController");

router.post(
    "/signup",
    checkLoggedIn,
    validateRequestBody(signupSchema),
    passport.authenticate("signup"),
    authController.signup
);
router.post(
    "/login",
    checkLoggedIn,
    validateRequestBody(loginSchema),
    passport.authenticate("login"),
    authController.login
);
router.get("/autoLogin", authController.autoLogin);
router.get("/logout", authController.logout);

module.exports = router;
