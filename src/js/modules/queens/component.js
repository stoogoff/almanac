
import { isNull, notNull } from 'q/utils/assert.js'
import { pluck, EASY, MEDIUM, HARD } from 'utils/lib.js'
import { rand } from 'utils/seed.js'
import { logger } from 'utils/logger.js'
import { getGame } from 'components/game.js'
import { Queens } from 'queens/queens.js'
import { Difficulty, STORAGE_KEY } from 'queens/types.js'
import { generate } from 'queens/generator.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		history: [],
		difficulty: EASY,
	},

	mounted() {
		if(game.hasPlayedToday) {
			window.setTimeout(() => game.gameover(), 0)

			return
		}

		const difficulties = [EASY, MEDIUM, MEDIUM, HARD, HARD]
		const difficulty = pluck(difficulties, rand)

		this.data.difficulty = difficulty

		const node = document.getElementById('queens-board')
		const size = pluck([8, 9, 10], rand)
		const board = generate(size, rand, Difficulty[difficulty])

		this.queens = new Queens(board.board, () => {
			game.gameover()
		}, (history, current) => {
			this.data.history = [...this.data.history, history]
			game.save({ picked: [ ...this.data.history, current ] })
		})

		this.queens.create(node)

		// set starting game based on previous state
		if(notNull(game.state?.picked ?? null)) {
			try {
				const history = game.state.picked
				const current = history.pop()

				this.queens.setBoardFromState(current)
				this.data.history = history
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

		this.queens.setBoardFromState(state)
	},

	reset() {
		game.start()
		this.queens.reset()
	},
}
