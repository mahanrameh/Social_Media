const multer = require("multer");
const fs = require("fs");
const path = require("path");


const types =  /image\/jpeg|image\/jpg|image\/png|image\/webp|video\/mp4|video\/mkv/;

exports.multerStorage = (destination, allowedTypes= types) => {
    //* creating destination directory
    if (!fs.existsSync(destination)) {
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

    const fileFilter = function (req, file, cb) {
        //* allow extension
        if (allowedTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('file type not allowed'));
        }
    }

    return multer({  
        storage,
        limits: { fileSize: 512000000 },
        fileFilter
    });
};
