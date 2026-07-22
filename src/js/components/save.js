
import { isNull, notNull } from 'q/utils/assert.js'
import { local } from 'q/utils/storage.js'

export class Save {
	#storageKey = ''

	constructor(key) {
		this.#storageKey = key
	}

	get hasPlayedToday() {
		const score = this.todaysScore

		console.log({ score })

		if(isNull(score)) return false
		if(isNull(score.score)) return false

		console.log('returning true')

		return true
	}

	get todaysScore() {
		if(!local.has(this.#storageKey)) {
			return null
		}

		const stats = local.get(this.#storageKey)
		const [now, ] = new Date().toISOString().split('T')
		const today = stats.find(row => row.date === now)

		return today
	}

	save(score) {
		if(!local.has(this.#storageKey)) {	
			local.set(this.#storageKey, [])
		}

		const current = local.get(this.#storageKey)
		const [now, ] = new Date().toISOString().split('T')
		const today = current.find(row => row.date === now)

		// there's an existing score for today so return it
		if(notNull(today)) {
			return today.score
		}

		current.push({ date: now, ...score })

		local.set(this.#storageKey, current)

		return score
	}
}
