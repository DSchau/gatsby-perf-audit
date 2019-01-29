const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts = {}, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results)
    });
  });
}

test('performance audit', async () => {
  const { lhr: report } = await launchChromeAndRunLighthouse('http://localhost:9000')

  const scores = Object.keys(report.categories).reduce((merged, category) => {
    merged[category] = report.categories[category].score
    return merged
  }, {})

  expect(scores.performance).toBe(1)
  expect(scores.accessibility).toBe(1)
  expect(scores['best-practices']).toBeGreaterThanOrEqual(0.93)
  expect(scores.seo).toBe(1)
})
