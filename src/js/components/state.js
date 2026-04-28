
import { Emitter } from 'q/utils/emitter.js'

const events = new Emitter()

export const States = {
	START: 'start',
	GAMEOVER: 'gameover',
	TIME: 'time',
	PAUSE: 'pause',
}

export const game = {
	start() {
		events.emit(States.START)
	},

	gameover() {
		events.emit(States.GAMEOVER)
	},

	time(time) {
		events.emit(States.TIME, time)
	},

	on(event, callback) {
		events.on(event, callback)
	},
}