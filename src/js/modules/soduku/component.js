
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
		complete1: false,
		complete2: false,
		complete3: false,
		complete4: false,
		complete5: false,
		complete6: false,
		complete7: false,
		complete8: false,
		complete9: false,
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

		if(this.data['complete' + number]) {
			return
		}

		try {
			if(this.data.notes) {
				this.soduku.setNote(number)
			}
			else {
				const complete = this.soduku.setNumber(number)

				if(complete) {
					this.data['complete' + number] = true
				}
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

		const number = this.soduku.undo(state)

		this.data['complete' + number] = false
	},

	reset() {
		this.data.history = []
		game.start()
		this.soduku.reset()
	},
}
