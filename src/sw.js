
// This file needs to be copied to the root directory
const CACHE_VERSION = '$VERSION'
const CACHE_NAME = `knack-${CACHE_VERSION}`

// TODO fill with all available files, including those from the CDN
// this should be part of the build process
const PRECACHE = $PATHS

self.addEventListener('install', event => {
	event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)))
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys
				.filter((key) => key.startsWith('knack-') && key !== CACHE_NAME)
				.map((key) => caches.delete(key))
		))
	)
	self.clients.claim()
})

self.addEventListener('fetch', (event) => {
	if(event.request.method !== 'GET') return
	
	event.respondWith(
		caches.match(event.request).then(cached => {
			if(cached) return cached

			return fetch(event.request).then(response => {
				if(response.ok && response.type === 'basic') {
					const clone = response.clone()

					caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
				}

				return response
			})
		})
	)
})
