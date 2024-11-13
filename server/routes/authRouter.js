const router = require("express").Router();
const { login, register } = require("../controllers/authController");

router.route("/login").post(login);
router.route("/signup").post(register);

module.exports=router