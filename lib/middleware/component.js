const lodash = require('lodash')

const log = require('../util/log')
const changes = require('../util/changes')

module.exports = (router, { debug = false, component = {} }) => {
  const { changesPath = 'webapp/changes', changeData = {}, data = {} } = component
  router.get('/sap/bc/lrep/flex/data/:component', async (req, res, next) => {
    try {
      if (debug) {
        log.info(`${req.method} ${req.originalUrl}`)
      }
      const { appVersion } = req.query
      const response = {
        changes: await changes({ debug, changesPath, appVersion, changeData })
      }
      lodash.merge(response, data)
      if (debug) {
        log.info(`Sending response: ${JSON.stringify(response)}`)
      }
      res.json(response)
    } catch (error) {
      log.error(error)
      next(error)
    }
  })
}
