// 159

const assets = [
  './',
  './favicon.ico',
  './manifest.json',
  './desktop/icon.png',
  './desktop/sources/links/main.css',
  './desktop/sources/scripts/lib/acels.js',
  './desktop/sources/scripts/lib/theme.js',
  './desktop/sources/scripts/lib/history.js',
  './desktop/sources/scripts/lib/source.js',
  './desktop/sources/scripts/core/library.js',
  './desktop/sources/scripts/core/io.js',
  './desktop/sources/scripts/core/operator.js',
  './desktop/sources/scripts/core/orca.js',
  './desktop/sources/scripts/core/transpose.js',
  './desktop/sources/scripts/core/io/cc.js',
  './desktop/sources/scripts/core/io/midi.js',
  './desktop/sources/scripts/core/io/mono.js',
  './desktop/sources/scripts/core/io/osc.js',
  './desktop/sources/scripts/core/io/udp.js',
  './desktop/sources/scripts/clock.js',
  './desktop/sources/scripts/commander.js',
  './desktop/sources/scripts/cursor.js',
  './desktop/sources/scripts/client.js'
]

self.addEventListener('install', async function () {
  const cache = await caches.open('Orca')
  assets.forEach(function (asset) {
    cache.add(asset).catch(function () {
      console.error('serviceWorker','Cound not cache:', asset)
    })
  })
})

self.addEventListener('fetch', async function (event) {
  const request = event.request
  event.respondWith(cacheFirst(request))
})

async function cacheFirst (request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse === undefined) {
    console.error('serviceWorker','Not cached:', request.url)
    return fetch(request)
  }
  return cachedResponse
}
