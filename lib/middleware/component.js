const lodash = require('lodash')

const log = require('../util/log')
const changes = require('../util/changes')

module.exports = (router, { debug = false, component = {} }) => {
  const { changesPath = 'webapp/changes', changeData = {}, data = {} } = component
  router.get('/sap/bc/lrep/flex/data/:component', async (req, res, next) => {
    try {
      if (debug) {
        const { method, originalUrl } = req
        log.info(`${method} ${originalUrl}`)
      }
      const response = {
        changes: await changes({ debug, changesPath, changeData })
      }
      lodash.merge(response, data)
      if (debug) {
        log.info(`Sending response: ${JSON.stringify(response)}`)
      }
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(JSON.stringify(response))
    } catch (error) {
      log.error(error)
      next(error)
    }
  })
}
