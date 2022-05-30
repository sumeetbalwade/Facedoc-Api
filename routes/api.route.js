const router = require("express").Router();
const prisma = require("../helper/prismaClient");
const { catchError } = require("../helper/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.use("/user", require("./user.route"));
router.use("/doc", require("./document.route"));
router.use("/dataset", require("./dataset.route"));
router.use("/role", require("./role.route"));

router.use("/find", require("./find.route"));

router.get("/", async (req, res, next) => {
	res.send({ message: "Ok api is working 🚀" });
});
router.post("/token", (req, res) => {
	// Username could be email or phone number, just keeping a common variable name for both
	const email = req.body.email;
	const password = req.body.password;

	prisma.user
		.findFirst({
			where: {
				email: email,
			},
		})
		.then((user) => {
			console.log(user);
			if (!user) {
				return res.status(401).json({
					message: "Login Failed",
				});
			}
			bcrypt.compare(password, user.password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "Login Failed",
					});
				}
				if (result) {
					const token = jwt.sign(
						{
							email: user.email,
							id: user.id,
						},
						process.env.JWT_KEY,
						{
							expiresIn: "7d",
						}
					);
					console.log(email + " logged in");
					return res.status(200).json({
						message: "Login Successful",
						id: user.id,
						token: token,
						role: user.role,
					});
				} else {
					return res.status(401).json({
						message: "Login Failed",
					});
				}
			});
		})
		.catch((err) => {
			catchError(err, __filename);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
