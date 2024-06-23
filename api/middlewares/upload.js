const multer = require('multer')
const path = require('path')

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
})

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 300000 }, // Limit file size to 300KB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

module.exports = upload
