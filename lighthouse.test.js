const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const Table = require('cli-table')
const net = require('net')

const checkConnection = (host, port, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.end()
      return reject('timeout')
    }, timeout)
    const socket = net.createConnection(port, host, () => {
      clearTimeout(timer)
      socket.end()
      return resolve(true)
    })
    socket.on('error', err => {
      clearTimeout(timer)
      return reject(err)
    })
  })
}

const table = new Table()

const output = scores => {
  Object.keys(scores).forEach(category => {
    table.push([category, scores[category]])
  })
  return table.toString()
}

function launchChromeAndRunLighthouse(url, opts = {}, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port
      return lighthouse(url, opts, config).then(results => {
        return chrome.kill().then(() => results)
      })
    })
}

test('performance audit', async () => {
  const serverIsAlive = await checkConnection('localhost', 9000).catch(err => {
    console.warn(
      'Performance not tested due to server not being available',
      err
    )
  })
  if (serverIsAlive) {
    const { lhr } = await launchChromeAndRunLighthouse('http://localhost:9000')

    const scores = Object.keys(lhr.categories).reduce((merged, category) => {
      merged[category] = lhr.categories[category].score
      return merged
    }, {})

    console.log(output(scores))

    expect(scores.performance).toBe(1)
    expect(scores.accessibility).toBe(1)
    expect(scores['best-practices']).toBeGreaterThanOrEqual(0.93)
    expect(scores.seo).toBe(1)
  }
  return
}, 30000)
