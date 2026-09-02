
import { isNull } from 'q/utils/assert.js'
import { pluck, EASY, MEDIUM, HARD } from 'utils/lib.js'
import { rand } from 'utils/seed.js'
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
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})

		this.queens.create(node)
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

		this.queens.undo(state)
	},

	reset() {
		game.start()
		this.queens.reset()
	},
}
