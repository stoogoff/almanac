
import { isNull } from 'q/utils/assert.js'
import { rand } from 'utils/seed.js'
import { getGame } from 'components/game.js'
import { Soduku } from 'soduku/soduku.js'
import { STORAGE_KEY } from 'soduku/types.js'

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

		// TODO click on a tile should highlight it
		// TODO clicking on a button adds the number if NOTES is off
		// TODO clicking on a button adds a note if NOTES is on
		// TODO clicking on a filled tile should do nothing

		const node = document.getElementById('soduku-board')

		this.soduku = new Soduku(0, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})

		this.soduku.create(node)
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

		this.soduku.undo(state)
	},

	reset() {
		game.start()
		this.soduku.reset()
	},
}
