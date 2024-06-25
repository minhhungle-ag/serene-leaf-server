function removeFile(filename, cb) {
  fs.unlink(`${filename}`, (error) => cb(error))
}

module.exports = { removeFile }
