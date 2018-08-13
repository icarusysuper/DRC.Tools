const { parser } = require('../tools/parser')
const { getRootPath } = require('../config')
const path = require('path')

module.exports = (req, res, next) => {
  console.log(req.file, parser)

  const inputPath = path.join(getRootPath(), req.file.path)
  const outputPathRoot = path.join(getRootPath(), './public/_att/_extract')
  parser(inputPath, outputPathRoot, (err, path) => {
    err ? res.send({ success: false }) : res.send({ success: true, path })
  })
}
