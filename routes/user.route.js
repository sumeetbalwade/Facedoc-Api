const router = require("express").Router();
const bcrypt = require("bcrypt");
const prisma = require("../helper/prismaClient");
const jwt = require("jsonwebtoken");
const checkUser = require("../middlewares/checkUser");

//get all users
router.get("/", checkUser, async (req, res, next) => {
	if (req.userData.role != "ADMIN") {
		return res.status(401).json({ message: "Not Allowed" });
	}
	try {
		const users = await prisma.User.findMany({});
		res.json(users);
	} catch (error) {
		next(error);
	}
});

//get user by id
router.get("/:id", checkUser, async (req, res, next) => {
	const { id } = req.params;
	if (
		(req.userData.id == Number(id) && req.userData.role == "USER") ||
		req.userData.role != "USER"
	) {
		try {
			const user = await prisma.User.findUnique({ where: { id: Number(id) } });
			res.json(user);
		} catch (error) {
			next(error);
		}
	} else {
		return res.status(401).json({ message: "Not Allowed" });
	}
});

//delete user
router.delete("/:id", async (req, res, next) => {
	const { id } = req.params;
	if (req.userData.role != "ADMIN") {
		return res.status(401).json({ message: "Not Allowed" });
	}
	try {
		const user = await prisma.User.delete({ where: { id: Number(id) } });
		res.json(user);
	} catch (error) {
		next(error);
	}
});

//update user
router.patch("/:id", async (req, res, next) => {
	const { id } = req.params;
	const data = req.body.data;

	if (
		!(
			(req.userData.id == Number(id) && req.userData.role == "USER") ||
			req.userData.role != "USER"
		)
	) {
		return res.status(401).json({ message: "Not Allowed" });
	}

	var passwordRexp =
		/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
	if (data.password.match(passwordRexp)) {
		bcrypt.hash(data.password, 10, async (err, hash) => {
			if (err) {
				return res.status(500).json({
					error: err,
				});
			} else {
				data.password = hash;
			}
		});
	} else {
		res.status(500).json({
			message: "Invalid Password",
		});
	}
	try {
		const user = await prisma.User.update({
			where: { id: Number(id) },
			data: data,
		});
		res.json(user);
	} catch (error) {
		next(error);
	}
});

// create user
router.post("/", async (req, res, next) => {
	const { name, email, mobileNumber, password } = req.body;

	if (!(email && password && mobileNumber)) {
		return res.status(404).json({
			message: "data is missing",
		});
	}
	if (email.length > 0 && mobileNumber.length > 0) {
		prisma.user
			.findFirst({
				where: {
					OR: [{ email: email }, { mobileNumber: mobileNumber }],
				},
			})
			.then((doc) => {
				if (doc) {
					console.log("user already exists");
					return res.status(409).json({ message: "User already exists" });
				} else {
					var passwordRexp =
						/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
					if (password.match(passwordRexp)) {
						bcrypt.hash(password, 10, async (err, hash) => {
							if (err) {
								return res.status(500).json({
									error: err,
								});
							} else {
								try {
									const u = await prisma.user.create({
										data: {
											name: name,
											email: email,
											mobileNumber: mobileNumber,
											password: hash,
										},
									});
									return res.json(u);
								} catch (error) {
									next(error);
								}
							}
						});
					} else {
						res.status(500).json({
							message: "Invalid Password",
						});
					}
				}
			});
	} else {
		res.status(400).json({
			message: "Enter Correct Details",
		});
	}
});

	module.exports = router;
