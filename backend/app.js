var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var multer  = require('multer')
var upload = multer({
  dest: 'public/_att/',
}).single('drcfile')


var parserHandler = require('./routes/parser')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


let guidSno = 0
app.get('/api/guid', (req, res) => {
  const guid = Date.now() + '_' + (++guidSno)
  res.send({ guid })
})

app.post('/api/upload', upload, parserHandler)

module.exports = app
