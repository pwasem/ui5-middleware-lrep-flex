const path = require('path')
const fs = require('fs-extra')
const lodash = require('lodash')

const log = require('./log')

module.exports = async ({ debug, changesPath, appVersion, changeData }) => {
  const changesDir = path.join(process.cwd(), changesPath)
  if (debug) {
    log.info(`Reading changes from: ${changesDir}`)
  }
  const files = await fs.readdir(changesDir)
  const changes = []
  for (const file of files) {
    const filePath = path.join(changesDir, file)
    const change = await fs.readJson(filePath)
    lodash.merge(change, changeData)
    changes.push(change)
  }
  return changes
}
