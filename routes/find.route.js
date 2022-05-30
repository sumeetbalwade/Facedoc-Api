const router = require("express").Router();
const prisma = require("../helper/prismaClient");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: function (req, res, cb) {
		const { id } = req.params;
		const path = `uploads/temp`;
		cb(null, path);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });
// create Dataset
router.post(
	"/",
	upload.fields([{ name: "document", maxCount: 1 }]),
	async (req, res, next) => {
		let documentUrl;
		let fileName;
		if (req.files["document"] !== undefined) {
			if (req.files["document"].length > 0) {
				for (const i of req.files["document"]) {
					documentUrl = `uploads/temp` + i.filename;
					fileName = i.filename;
				}
			}
		}

		return res.status(200).json({
			message: "File Upload sucessful",
			path: documentUrl,
			fileName: fileName,
		});
	}
);

// get user using imagename
router.get("/", async (req, res, next) => {
	let id = 1;
	if (req.body.fileName) {
		console.log("got file");
		//call algorithm
	}

	if (id) {
		prisma.user
			.findUnique({ where: { id: id }, include: { documents: true } })
			.then((doc) => {
				res.json(doc);
			});
	}
});

module.exports = router;
