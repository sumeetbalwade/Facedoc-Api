const router = require("express").Router();

router.use("/user", require("./user.route"));
router.get("/", async (req, res, next) => {
	res.send({ message: "Ok api is working 🚀" });
});

module.exports = router;
