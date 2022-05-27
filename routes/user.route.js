const router = require("express").Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
	try {
		const users = await prisma.User.findMany({});
		res.json(users);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
