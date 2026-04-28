
import { notNull } from 'q/utils/assert.js'
import { game, States } from './state.js'

const pad = (input) => {
	input = input.toString()

	return input.length < 2 ? `0${input}` : input
}

export default {
	data: {
		seconds: 0
	},

	computed: {
		formattedTime() {
			const minute = Math.floor(this.data.seconds / 60)
			const seconds = this.data.seconds % 60

			return `${pad(minute)}:${pad(seconds)}`
		},
	},

	mounted() {
		game.on(States.GAMEOVER, () => {
			this.stop()
			game.time(this.data.seconds)
		})

		game.on(States.START, () => {
			this.start()
		})

		game.on(States.PAUSE, () => {
			this.stop()
		})
	},

	start() {
		if(notNull(this.timer)) {
			return
		}

		this.timer = window.setInterval(() => {
			this.data.seconds++
		}, 1000)
	},

	stop() {
		window.clearInterval(this.timer)
		this.timer = null
	},
}
