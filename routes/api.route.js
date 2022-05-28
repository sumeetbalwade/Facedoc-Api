const router = require("express").Router();

router.use("/user", require("./user.route"));
router.use("/doc", require("./document.route"));
router.use("/role", require("./role.route"));
router.get("/", async (req, res, next) => {
	res.send({ message: "Ok api is working 🚀" });
});

module.exports = router;
