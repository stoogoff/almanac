
import { isNull } from 'q/utils/assert.js'
import { mulberry32 } from 'utils/mulberry32.js'
import { game } from 'components/state.js'
import { Mambo } from 'mambo/mambo.js'
import { hasPlayedToday, save } from 'mambo/save.js'

export default {
	data: {
		history: [],
	},

	mounted() {
		if(hasPlayedToday()) {
			game.time(save(0))
			game.gameover()

			return
		}

		const now = new Date()
		const seed = now.getFullYear() + (now.getMonth() * 100) + now.getDate()
		const randomiser = mulberry32(seed)
		const board = document.getElementById('mambo-board')

		this.mambo = new Mambo(6, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})
		this.mambo.create(board, randomiser)
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
