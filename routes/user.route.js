const router = require("express").Router();
const prisma = require("../helper/prismaClient");

//get all users
router.get("/", async (req, res, next) => {
	try {
		const users = await prisma.User.findMany({});
		res.json(users);
	} catch (error) {
		next(error);
	}
});

//get user by id
router.get("/:id", async (req, res, next) => {
	const { id } = req.params;
	try {
		const user = await prisma.User.findUnique({ where: { id: Number(id) } });
		res.json(user);
	} catch (error) {
		next(error);
	}
});

//delete user
router.delete("/:id", async (req, res, next) => {
	const { id } = req.params;
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
	try {
		const user = await prisma.User.update({
			where: { id: Number(id) },
			data: req.body.data,
		});
		res.json(user);
	} catch (error) {
		next(error);
	}
});

// create user
router.post("/", async (req, res, next) => {
	const { name, email, mobileNumber, password } = req.body;

	try {
		const u = await prisma.user.create({
			data: {
				name: name,
				email: email,
				mobileNumber: mobileNumber,
				password: password,
			},
		});
		res.json(u);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
