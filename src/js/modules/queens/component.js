
import { isNull } from 'q/utils/assert.js'
import { mulberry32 } from 'utils/mulberry32.js'
import { game } from 'components/state.js'
import { Save } from 'components/save.js'
import { Queens } from 'queens/queens.js'
import { STORAGE_KEY } from 'queens/types.js'

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
		const board = document.getElementById('queens-board')

		this.queens = new Queens(10, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})
		this.queens.create(board, randomiser)
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
