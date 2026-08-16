
import { isNull } from 'q/utils/assert.js'
import { showToast } from 'utils/lib.js'
import { rand } from 'utils/seed.js'
import { getGame } from 'components/game.js'
import { Soduku } from 'soduku/soduku.js'
import { CssClass, STORAGE_KEY } from 'soduku/types.js'
import { generateBoard } from 'soduku/generator.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		history: [],
		notes: false,
	},

	mounted() {
		if(game.hasPlayedToday) {
			window.setTimeout(() => game.gameover(), 0)

			return
		}

		// TODO fade number out when all are selected

		const board = generateBoard('Easy', 0)

		console.log(board)

		const node = document.getElementById('soduku-board')

		this.soduku = new Soduku(board.puzzle, () => {
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
		},

		keyboardClass() {
			return this.data.notes ? CssClass.Notes : ''
		},
	},

	type(_event, context) {
		const number = parseInt(context.node.innerText)

		try {
			if(this.data.notes) {
				this.soduku.setNote(number)
			}
			else {
				this.soduku.setNumber(number)
			}
		}
		catch(error) {
			showToast('No cell selected')
		}
	},

	toggleNotes() {
		this.data.notes = !this.data.notes
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
		this.data.history = []
		game.start()
		this.soduku.reset()
	},
}
