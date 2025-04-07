const multer = require("multer");
const fs = require("fs");
const paths = require("path");


exports.multerStorage = (destination, allowedTypes=/jpeg|jpg|png|webp/) => {
    //* creating destination directory
    if (fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    //* Multer configs
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination);
        },

        filename: function (req, file, cb) {
            const unique = Date.now() * Math.floor(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${unique}${ext}`);
        },

    });

    const fileFormat = function (req, file, cb) {
        //* allow extension
        if (allowedTypes.test(file.mimtypes)) {
            cb(null, true);
        } else {
            cb(new Error('file type not allowed'));
        }
    }

    const upload = multer({
        storage,
        limits: {
            fileSize: 512000000
        },
        fileFilter: fileFormat
    });
};
