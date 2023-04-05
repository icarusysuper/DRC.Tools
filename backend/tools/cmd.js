const { toolParser } = require('./parser')

console.log(toolParser)
const remoteInputPath = 'C:\\Users\\luzhq\\Desktop\\remote'
const localInputPath = 'C:\\Users\\luzhq\\Desktop\\local'

toolParser(remoteInputPath, console.log)
toolParser(localInputPath, console.log)