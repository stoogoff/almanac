
import { Emitter } from 'q/utils/emitter.js'

const events = new Emitter()

export const States = {
	FAIL: 'fail',
	GAMEOVER: 'gameover',
	PAUSE: 'pause',
	START: 'start',
	SCORE: 'score',
}

export const game = {
	start() {
		events.emit(States.START)
	},

	gameover() {
		events.emit(States.GAMEOVER)
	},

	fail() {
		events.emit(States.FAIL)
	},

	score(score) {
		events.emit(States.SCORE, score)
	},

	on(event, callback) {
		events.on(event, callback)
	},
}