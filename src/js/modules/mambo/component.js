
import { isNull } from 'q/utils/assert.js'
import { rand } from 'utils/seed.js'
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
		})

		this.mambo.create(board, rand)
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

		this.mambo.undo(state)
	},

	reset() {
		game.start()
		this.mambo.reset()
	},
}
