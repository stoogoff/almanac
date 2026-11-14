
const KEY = 'knack'
const CACHE_VERSION = '~VERSION~'
const CACHE_NAME = `${KEY}-${CACHE_VERSION}`
const PRECACHE = [
	'/index.html',
	'/mambo.html',
	'/queens.html',
	'/soduku.html',
	'/swordle.html',
	'/media/logo-192.png',
	'/media/logo-512.png',
	'/media/shock.svg',
	'/media/trophy.svg',
	// START block which gets path rewritten to add version
	'/css/colours.css',
	'/css/mambo.css',
	'/css/queens.css',
	'/css/reset.css',
	'/css/soduku.css',
	'/css/styles.css',
	'/css/swordle.css',
	'/css/variables.css',
	'/js/register.js',
	'/js/components/game.js',
	'/js/components/grid.js',
	'/js/components/timer.js',
	'/js/components/victory.js',
	'/js/migrations/01-convert-time-to-score.js',
	'/js/migrations/index.js',
	'/js/modules/mambo/component.js',
	'/js/modules/mambo/info.js',
	'/js/modules/mambo/main.js',
	'/js/modules/mambo/mambo.js',
	'/js/modules/mambo/success.js',
	'/js/modules/mambo/types.js',
	'/js/modules/menu/comms.js',
	'/js/modules/menu/component.js',
	'/js/modules/menu/main.js',
	'/js/modules/menu/rules.js',
	'/js/modules/queens/component.js',
	'/js/modules/queens/generator.js',
	'/js/modules/queens/info.js',
	'/js/modules/queens/main.js',
	'/js/modules/queens/queens.js',
	'/js/modules/queens/success.js',
	'/js/modules/queens/tile.js',
	'/js/modules/queens/types.js',
	'/js/modules/soduku/main.js',
	'/js/modules/swordle/component.js',
	'/js/modules/swordle/dictionary.js',
	'/js/modules/swordle/fail.js',
	'/js/modules/swordle/info.js',
	'/js/modules/swordle/main.js',
	'/js/modules/swordle/success.js',
	'/js/modules/swordle/swordle.js',
	'/js/modules/swordle/types.js',
	'/js/modules/swordle/words.js',
	'/js/utils/lib.js',
	'/js/utils/logger.js',
	'/js/utils/number.js',
	'/js/utils/seed.js',
	// END block which gets path rewritten to add version
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/component.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/config.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/context.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/attribute.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/boolean.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/component.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/each.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/event.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/include.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/index.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/input.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/store.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/template.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/reactive/directives/text.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/utils/assert.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/utils/emitter.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/utils/list.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/utils/logger.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/utils/storage.js',
	'https://cdn.we-evolve.co.uk/js/q/v1.1.1/utils/string.js',
]

self.addEventListener('install', event => {
	event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)))
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys
				.filter((key) => key.startsWith(`${KEY}-`) && key !== CACHE_NAME)
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
