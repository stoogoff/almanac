
import { isNull } from 'q/utils/assert.js'
import { rand } from 'utils/seed.js'
import { Save } from 'components/save.js'
import { game } from 'components/state.js'
import { Mambo } from 'mambo/mambo.js'
import { STORAGE_KEY } from 'mambo/types.js'

export default {
	data: {
		history: [],
	},

	mounted() {
		const save = new Save(STORAGE_KEY)

		if(save.hasPlayedToday) {
			game.score({ time: 0 })
			game.gameover()

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
