const { Router } = require("express");
const userClerkController = require("./controller/userClerk");
const router = Router();

router.put("/:userId", userClerkController.updateUser);

module.exports = router;
