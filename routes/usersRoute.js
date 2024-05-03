const express = require("express");
const userControllers = require("./../controllers/userControllers");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassowrd", authController.forgotPassowrd);
router.patch("/resetPassowrd/:token", authController.resetPassowrd);
router.patch("/updateMyPassword", authController.protect,authController.updatePassword);

router.patch("/updateMe", authController.protect,userControllers.updateMe);
router.delete("/deleteMe", authController.protect,userControllers.deleteMe);
//ROUTERS USERS
router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route("/:id")
  .get(userControllers.getSingleUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
