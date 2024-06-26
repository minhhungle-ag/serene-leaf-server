function removeFile(filename, cb) {
  fs.unlink(`${filename}`, (error) => cb(error))
}

function numberToCurrencyUSD(number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
}

module.exports = { removeFile, numberToCurrencyUSD }
