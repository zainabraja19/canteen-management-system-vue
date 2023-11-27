const multer = require('multer')

const storage = multer.memoryStorage();

// configure upload options for profile picture
const profilePictureUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2 MB (in bytes)
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
});

const resumeUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB (in bytes)
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|docx)$/)) {
            return cb(new Error('Please upload only .pdf/.docx files.'))
        }

        cb(undefined, true)
    }
});

module.exports = { profilePictureUpload, resumeUpload }