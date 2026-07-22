
import { isNull, notNull } from 'q/utils/assert.js'
import { Emitter } from 'q/utils/emitter.js'
import { local } from 'q/utils/storage.js'

export const GameStates = {
	FAIL: 'fail',
	GAMEOVER: 'gameover',
	PAUSE: 'pause', // TODO check this is used
	START: 'start',
}

class Game {
	#storageKey = ''
	#emitter = new Emitter()

	constructor(key) {
		this.#storageKey = key
	}

	// event emitter related
	on(event, callback) {
		this.#emitter.on(event, callback)
	}

	start() {
		this.#emitter.emit(GameStates.START)
	}

	gameover(args) {
		const score = this.save(args)

		this.#emitter.emit(GameStates.GAMEOVER, score)
	}

	fail(args) {
		const score = this.save(args)

		this.#emitter.emit(GameStates.FAIL, score)
	}

	// score properties
	get hasPlayedToday() {
		const score = this.state

		if(isNull(score)) return false
		if(isNull(score.score)) return false

		return true
	}

	get state() {
		if(!local.has(this.#storageKey)) {
			return null
		}

		const stats = local.get(this.#storageKey)
		const [now, ] = new Date().toISOString().split('T')
		const today = stats.find(row => row.date === now)

		return today
	}

	// saving state
	save(args) {
		if(!local.has(this.#storageKey)) {	
			local.set(this.#storageKey, [])
		}

		let score = null
		let current = local.get(this.#storageKey)
		const [now, ] = new Date().toISOString().split('T')
		const today = current.find(row => row.date === now)

		// no score so append
		if(isNull(today)) {
			score = { ...args, date: now }
		}
		// existing score so merge
		else {
			current = current.filter(row => row.date !== now)
			score = { ...today, ...args, date: now }
		}

		current.push(score)

		local.set(this.#storageKey, current)

		return score
	}
}

const games = {}

export const getGame = key => {
	if(!games[key]) games[key] = new Game(key)

	return games[key]
}
