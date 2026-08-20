
import { isNull } from 'q/utils/assert.js'
import { showToast } from 'utils/lib.js'
import { rand } from 'utils/seed.js'
import { getGame } from 'components/game.js'
import { Soduku } from 'soduku/soduku.js'
import { CssClass, Difficulty, STORAGE_KEY } from 'soduku/types.js'
import { generateBoard } from 'soduku/generator.js'

const game = getGame(STORAGE_KEY)

function getDifficulty() {
	// difficulties weighted towards the middle
	const difficulties = ['EASY', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD', 'EXTREME']
	const difficulty = Math.floor(rand() * difficulties.length);
	
	return difficulties[difficulty]
}

export default {
	data: {
		history: [],
		notes: false,
		difficulty: 'EASY',
	},

	mounted() {
		if(game.hasPlayedToday) {
			window.setTimeout(() => game.gameover(), 0)

			return
		}

		const difficulty = getDifficulty()

		this.data.difficulty = difficulty

		const board = generateBoard(Difficulty[difficulty], rand)
		const node = document.getElementById('soduku-board')

		this.soduku = new Soduku(board.puzzle, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})

		this.soduku.create(node)
		game.start()

		this.emit('change')
	},

	computed: {
		canUndo() {
			return this.data.history.length > 0
		},

		keyboardClass() {
			return this.data.notes ? CssClass.Notes : ''
		},

		complete1() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(1)
		},

		complete2() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(2)
		},

		complete3() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(3)
		},

		complete4() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(4)
		},

		complete5() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(5)
		},

		complete6() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(6)
		},

		complete7() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(7)
		},

		complete8() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(8)
		},

		complete9() {
			return isNull(this.soduku) ? false : this.soduku.isNumberComplete(9)
		},
	},

	type(_event, context) {
		const number = parseInt(context.node.innerText)

		if(this.data['complete' + number]) {
			return
		}

		try {
			if(this.data.notes) {
				this.soduku.setNote(number)
			}
			else {
				this.soduku.setNumber(number)
			}

			// Nasty, but force recompute
			this.emit('change')
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
		this.emit('change')
	},

	reset() {
		this.data.history = []
		game.start()
		this.soduku.reset()
	},
}
