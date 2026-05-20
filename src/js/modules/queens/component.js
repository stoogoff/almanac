
import { isNull } from 'q/utils/assert.js'
import { mulberry32 } from 'utils/mulberry32.js'
import { game } from 'components/state.js'
import { Save } from 'components/save.js'
import { Queens } from 'queens/queens.js'
import { STORAGE_KEY } from 'queens/types.js'
import { generate } from 'queens/generator.js'

export default {
	data: {
		history: [],
	},

	mounted() {
		const save = new Save(STORAGE_KEY)

		if(save.hasPlayedToday) {
			game.time(save.save(0))
			game.gameover()

			return
		}

		const now = new Date()
		const seed = now.getFullYear() + (now.getMonth() * 100) + now.getDate()
		const randomiser = mulberry32(seed)
		const node = document.getElementById('queens-board')

		const SIZE = 10
		const board = generate(SIZE, randomiser)

		this.queens = new Queens(board.board, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})
		this.queens.create(node, randomiser)
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
