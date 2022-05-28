const router = require("express").Router();
const prisma = require("../helper/prismaClient");

//get user by id
router.get("/", async (req, res, next) => {
	const { role } = req.body;
	if (role == undefined) {
		return res.status(404).json({ message: "Role is Not Define" });
	}
	try {
		const axc = [];
		await prisma.role.findMany({ where: { role: role } }).then((e) => {
			e.forEach((element) => {
				axc.push(element.axcess);
			});
		});
		res.json({ role: role, axcess: axc });
	} catch (error) {
		next(error);
	}
});

//delete role
router.delete("/", async (req, res, next) => {
	const { role } = req.body;

	if (role == undefined) {
		return res.status(404).json({ message: "Role is Not Define" });
	}
	try {
		const user = await prisma.Role.deleteMany({ where: { role: role } });
		res.json(user);
	} catch (error) {
		next(error);
	}
});

//update user
router.delete("/permission", async (req, res, next) => {
	const { role, axcess } = req.body;

	if (role == undefined && axcess == undefined) {
		return res
			.status(404)
			.json({ message: "Role or Permission is Not Define" });
	}
	try {
		const user = await prisma.Role.deleteMany({
			where: { role: role, axcess: axcess },
		});
		res.json(user);
	} catch (error) {
		next(error);
	}
});

// create permssion
router.post("/", async (req, res, next) => {
	const { role, axcess } = req.body;

	if (role == undefined) {
		return res
			.status(404)
			.json({ message: "Role or Permission is Not Define" });
	}

	try {
		const u = await prisma.Role.create({
			data: { role: role, axcess: axcess },
		});
		res.json(u);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
