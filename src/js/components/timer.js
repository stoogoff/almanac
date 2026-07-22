
import { notNull } from 'q/utils/assert.js'
import { formatTime } from 'utils/number.js'
import { getGame, GameStates } from 'components/game.js'

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
		const game = getGame(this.data.key)

		game.on(GameStates.GAMEOVER, () => {
			console.log(this.data.seconds)
			this.stop()
			game.save({ score: { time: this.data.seconds }})
		})

		game.on(GameStates.START, () => {
			this.start()
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
