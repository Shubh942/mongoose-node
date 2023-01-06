const express = require("express");
const multer = require("multer");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

// router.post("/signup", authController.signup);
// router.post("/login", authController.login);
// router.post("/forgotPassword", authController.forgotPassword);
// router.post("/resetPassword/:token", authController.resetPassword);

// router.patch(
//   "/updateMyPassword",
//   authController.protect,
//   authController.updatePassword
// );
// router.get(
//   "/me",
//   authController.protect,
//   userController.getMe,
//   userController.getUser
// );

// router.patch("/updateMe", authController.protect, userController.updateMe);
// router.delete("/deleteMe", authController.protect, userController.deleteMe);

// router.use(authController.restrictTo("admin"));

// router
//   .route("/")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin"),
//     userController.getAllUsers
//   )
//   .post(
//     authController.protect,
//     authController.restrictTo("admin"),
//     userController.createUser
//   );

// router
//   .route("/:id")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin"),
//     userController.getUser
//   )
//   .patch(
//     authController.protect,
//     authController.restrictTo("admin"),
//     userController.updateUser
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin"),
//     userController.deleteUser
// );

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.resizeUserPhoto,
  userController.uploadUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
