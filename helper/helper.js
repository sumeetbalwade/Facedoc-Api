const fs = require("fs");

exports.deleteFile = async (file_path) => {
	try {
		fs.unlinkSync(file_path);
		return 1;
	} catch (error) {
		console.log(error);
		return 0;
	}
};

exports.catchError = (err, filename) => {
	console.log("Error at: ", filename);
	console.log(err);
};
