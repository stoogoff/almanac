
import config from "./utils/config.js"

console.log(`Purging end point: ${config.PurgeUrl}`)

const url = new URL('https://api.bunny.net/purge')

url.searchParams.set('url', config.PurgeUrl)

const response = await fetch(url, {
	method: 'POST',
	headers: {
		AccessKey: config.ApiKey,
	}
})

console.log(`Response: (${response.status}) ${response.statusText}`)
