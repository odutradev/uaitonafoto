const http = require('http')

const check = (port, path = '/health') =>
  new Promise((resolve) => {
    const req = http.get(
      {
        host: '127.0.0.1',
        port,
        path,
        timeout: 3000
      },
      (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 503)
      }
    )

    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
  })

async function run() {
  const primaryPort = Number(process.env.PORT) || 80
  const okPrimary = (await check(primaryPort, '/health')) || (await check(primaryPort, '/api/health'))
  if (okPrimary) {
    process.exit(0)
  }

  if (primaryPort !== 3000) {
    const okFallback = (await check(3000, '/health')) || (await check(3000, '/api/health'))
    if (okFallback) {
      process.exit(0)
    }
  }

  process.exit(1)
}

run()
