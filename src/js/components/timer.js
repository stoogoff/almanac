
import { notNull } from 'q/utils/assert.js'
import { formatTime } from 'utils/number.js'
import { getGame, GameStates } from 'components/game.js'

export default {
	game: null,

	data: {
		seconds: 0
	},

	computed: {
		formattedTime() {
			return formatTime(this.data.seconds)
		},
	},

	mounted() {
		this.game = getGame(this.data.key)

		this.game.on(GameStates.GAMEOVER, () => {
			if(notNull(this.timer)) {
				this.stop()
				this.game.save({ score: { time: this.data.seconds }})
			}
		})

		this.game.on(GameStates.START, () => {
			if(notNull(this.game.state) && notNull(this.game.state.currentTime)) {
				this.data.seconds = this.game.state.currentTime
			}

			this.start()
		})
	},

	start() {
		if(notNull(this.timer)) {
			return
		}

		this.timer = window.setInterval(() => {
			this.data.seconds++

			if(notNull(this.game)) {
				this.game.save({ currentTime: this.data.seconds })
			}
		}, 1000)
	},

	stop() {
		window.clearInterval(this.timer)
		this.timer = null
	},
}
