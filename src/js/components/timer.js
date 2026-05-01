
import { notNull } from 'q/utils/assert.js'
import { formatTime } from 'utils/number.js'
import { game, States } from './state.js'

export default {
	data: {
		seconds: 0
	},

	computed: {
		formattedTime() {
			return formatTime(this.data.seconds)
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
