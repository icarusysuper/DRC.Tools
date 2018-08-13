const fs = require('fs')

const read = function(path, opts = {}) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, opts, (err, data) => err ? reject(err) : resolve(data))
  })
}

const readSync = async function() {
  console.log(1)
  const data = await read('./parse1.js', { encoding: 'utf8' })
  console.log(data)
  console.log(2)
}

readSync()

process.on('uncaughtException', err => {
  console.log('err: ', err)
})

process.on('unhandledRejection', err => {
  console.log('err: ', err, err.stack)
})

console.log(3)