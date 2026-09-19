
import { isNull, notNull } from 'q/utils/assert.js'
import { rand } from 'utils/seed.js'
import { logger } from 'utils/logger.js'
import { getGame } from 'components/game.js'
import { Mambo } from 'mambo/mambo.js'
import { STORAGE_KEY } from 'mambo/types.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		history: [],
	},

	mounted() {
		if(game.hasPlayedToday) {
			window.setTimeout(() => game.gameover(), 0)

			return
		}

		const board = document.getElementById('mambo-board')

		this.mambo = new Mambo(6, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
			game.save({ picked: [ ...this.data.history ] })
		})

		this.mambo.create(board, rand)

		// set starting game based on previous state
		if(notNull(game.state?.picked ?? null)) {
			try {
				this.data.history = game.state.picked

				this.mambo.setBoardFromState(game.state.picked[game.state.picked.length - 1])
			}
			catch(error) {
				logger().error(error)
			}
		}

		game.start()
	},

	computed: {
		canUndo() {
			return this.data.history.length > 0
		}
	},

	undo() {
		const state = this.data.history.pop()

		this.data.history = [...this.data.history]

		if(isNull(state)) {
			return
		}

		this.mambo.setBoardFromState(state)
	},

	reset() {
		this.data.history = []
		this.mambo.reset()
		game.start()
	},
}
