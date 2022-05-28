const router = require("express").Router();
const { user } = require("../helper/prismaClient");
const prisma = require("../helper/prismaClient");
const { deleteFile } = require("../helper/helper");

const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, res, cb) {
		cb(null, "./uploads/documents");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

//get all document by userid
router.get("/:id", async (req, res, next) => {
	const { id } = req.params;
	const { role } = req.body;

	try {
		const doc = await prisma.documents.findMany({
			where: { userId: Number(id) },
			select: { documentName: true, documentUrl: true },
		});
		let docn = [];

		//finding doc axcess
		let docName = [];
		try {
			const requiredDoc = await prisma.role.findMany({
				where: { role: role },
				select: { axcess: true },
			});
			requiredDoc.forEach((element) => {
				docName.push(element.axcess);
			});
		} catch (error) {
			next(error);
		}

		doc.forEach((element) => {
			if (docName.includes(element.documentName)) {
				docn.push(element);
			}
		});
		res.json({ userId: id, data: docn });
	} catch (error) {
		next(error);
	}
});

//get perticular document by userid
router.get("/view/:id", async (req, res, next) => {
	const { id } = req.params;
	const { documentName } = req.body;

	try {
		const doc = await prisma.documents.findFirst({
			where: { userId: Number(id), documentName: documentName },
			select: { documentName: true, documentUrl: true },
		});
		res.json({ userId: id, data: doc });
	} catch (error) {
		next(error);
	}
});

// add/update document
router.post(
	"/:id",
	upload.fields([{ name: "document", maxCount: 1 }]),
	async (req, res, next) => {
		const { id } = req.params;
		const { documentName } = req.body;

		let documentUrl;
		if (req.files["document"] !== undefined) {
			if (req.files["document"].length > 0) {
				for (const i of req.files["document"]) {
					documentUrl = "uploads/documents/" + i.filename;
				}
			}
		}
		try {
			await prisma.documents
				.findMany({
					where: { userId: Number(id), documentName: documentName },
				})
				.then((doc) => {
					doc.forEach(async (e) => {
						const isDeleted = await deleteFile(e.documentUrl);
						if (isDeleted) {
							await prisma.documents.deleteMany({
								where: { userId: Number(id), documentName: documentName },
							});
						}
					});
				});
			const u = await prisma.documents.create({
				data: {
					userId: Number(id),
					documentName: documentName,
					documentUrl: documentUrl,
				},
			});
			res.json(u);
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
