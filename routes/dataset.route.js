const router = require("express").Router();
const prisma = require("../helper/prismaClient");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: function (req, res, cb) {
		const { id } = req.params;
		const path = `uploads/dataset/raw/${id}/`;
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true });
		}
		req.body.path = path;
		cb(null, path);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });
// create Dataset
router.post(
	"/:id",
	upload.fields([{ name: "document", maxCount: 1 }]),
	async (req, res, next) => {
		const { id } = req.params;

		let documentUrl;
		if (req.files["document"] !== undefined) {
			if (req.files["document"].length > 0) {
				for (const i of req.files["document"]) {
					documentUrl = req.body.path + i.filename;
				}
			}
		}

		return res
			.status(200)
			.json({ message: "File Upload Unsucessful", path: documentUrl });
	}
);

module.exports = router;
