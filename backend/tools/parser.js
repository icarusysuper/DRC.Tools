const fs = require('fs')
const unzip = require('unzip')
const XLSX = require('xlsx')
const path = require('path')

exports.parser = function (inputPath, outputPathRoot, callback) {
  const randomNum = Date.now() + '_' + Math.ceil((Math.random() * 10000))
  const outputPath = path.join(outputPathRoot, `./tmp_${randomNum}`)
  const ansFilename = `ans_${randomNum}.txt`
  const ansPath = path.join(outputPathRoot, ansFilename)
  try {
    fs.createReadStream(inputPath).pipe(unzip.Extract({ path: outputPath })).on('close', err => {
      if (err) throw err

      beginParse(outputPath, (err, result) => {
        if (err) throw err

        // callback(null, result)
        const fileStr = result.map(r => {
          return Object.keys(r).map(k => r[k]).join('\t')
        }).join('\r\n')

        fs.writeFile(ansPath, fileStr, { encoding: 'utf8' }, (err) => {
          if (err) throw err
          callback(null, `/_att/_extract/${ansFilename}`)
        })
      })
    })
  } catch (e) {
    callback(e)
  }
}

const toolParser = exports.toolParser = (inputPath, callback) => {
  beginParse(inputPath, (err, result) => {
    if (err) throw err
    const fileStr = result.map(r => {
      return Object.keys(r).map(k => r[k]).join('\t')
    }).join('\r\n')

    fs.writeFile(`${inputPath}/result.xlsx`, fileStr, { encoding: 'utf8' }, (err) => {
      if (err) throw err
      callback(null)
    })
  })
}

const beginParse = exports.beginParse = (outputPath, callback) => {
  let dirs = fs.readdir(outputPath, { encoding: 'utf8' }, (err, dirs) => {
    if (err) return callback(err)

    let result = []
    dirs.forEach(fileName => {
      const workbook = XLSX.readFile(`${outputPath}/${fileName}`, {
        cellFormula: false,
        cellHTML: false,
        cellNF: false,
        cellStyles: false,
        cellText: false,
        cellDates: false,
      })

      const allSheets = workbook.Sheets
      for (var sheetName in allSheets) {
        const { department, name, job } = parseSheetName(sheetName)
        try {

          const point = parsePoint(allSheets[sheetName])
          result.push({ department, name, job, point })
        } catch (e) { console.log('error', e, fileName, sheetName) }
      }
    })

    callback(null, result)
  })
}

const parsePoint = (sheet) => {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  const row = rows.find(arr => arr.find(r => r === '总得分' || r === '最终折算得分'))

  if (!row)
    throw new Error('没有“总得分”这一行')

  const point = row.reduce((val, r) => v = parseFloat(r) || val, null)

  return point
}

const parseSheetName = (name) => {
  const p = name.split(/-|－/)
  return {
    department: p[0] || '',
    name: p[1] || '',
    job: p[2] || ''
  }
}
