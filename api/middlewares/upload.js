const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dowhdbh6w',
  api_key: '221516323487619',
  api_secret: 'asiXDTBR6gWRFQ8WvhEf0qPebt4',
})

// Set up storage engine
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   },
// })

// Configure multer storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0],
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
