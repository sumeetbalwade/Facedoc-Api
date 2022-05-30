const jwt = require("jsonwebtoken");
const prisma = require("../helper/prismaClient");
require("dotenv").config();

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];

		let decoded = jwt.verify(token, process.env.JWT_KEY);

		prisma.user.findFirst({ where: { id: decoded.id } }).then((doc) => {
			if (doc !== null && doc !== undefined) {
				req.userData = doc;
				next();
			} else {
				return res.status(401).json({
					message: "Auth Failed",
				});
			}
		});
	} catch (error) {
		return res.status(401).json({
			message: "Auth Failed",
		});
	}
};
