const express = require("express");

const router = express.Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

// router.use(authController.isLoggedIn)
router.get("/", authController.isLoggedIn,viewController.getOverview);

router.get("/tours/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.post("/login", viewController.getLoggedIn);
router.get("/me", authController.isLoggedIn,authController.protect, viewController.getAccount);

router.post("/get-me-updated",authController.isLoggedIn,authController.protect, viewController.updateUserData);
module.exports = router;
