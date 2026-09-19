
import { isNull, notNull } from 'q/utils/assert.js'
import { pluck, showToast, EASY, MEDIUM, HARD, EXTREME, } from 'utils/lib.js'
import { logger } from 'utils/logger.js'
import { rand } from 'utils/seed.js'
import { getGame } from 'components/game.js'
import { Soduku } from 'soduku/soduku.js'
import { CssClass, Difficulty, STORAGE_KEY } from 'soduku/types.js'
import { generateBoard } from 'soduku/generator.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		history: [],
		notes: false,
		difficulty: EASY,
	},

	mounted() {
		if(game.hasPlayedToday) {
			window.setTimeout(() => game.gameover(), 0)

			return
		}

		const difficulties = [EASY, MEDIUM, MEDIUM, HARD, HARD, HARD, EXTREME, EXTREME]
		const difficulty = pluck(difficulties, rand)

		this.data.difficulty = difficulty

		const board = generateBoard(Difficulty[difficulty], rand)
		const node = document.getElementById('soduku-board')

		this.soduku = new Soduku(board.puzzle, () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
			game.save({ picked: [ ...this.data.history ]})
		})

		this.soduku.create(node)

		if(notNull(game.state?.picked ?? null)) {
			try {
				this.data.history = game.state.picked

				const state = this.data.history.pop()

				this.soduku.setBoardFromState(state)
			}
			catch(error) {
				logger().error(error)
			}
		}

		game.start()

		this.emit('change')

		// handling typing on desktop
		document.addEventListener('keyup', event => {
			if(event.key === 'Enter') {
				this.toggleNotes()
				return
			}

			const key = parseInt(event.key)

			if(!isNaN(key)) {
				this.handleType(key)
			}
		})
	},

	computed: {
		easyMode() {
			return this.data.difficulty === EASY
		},

		canUndo() {
			return this.data.history.length > 0
		},

		keyboardClass() {
			return this.data.notes ? CssClass.Notes : ''
		},

		complete1() {
			return this.soduku?.isNumberComplete(1) ?? false
		},

		complete2() {
			return this.soduku?.isNumberComplete(2) ?? false
		},

		complete3() {
			return this.soduku?.isNumberComplete(3) ?? false
		},

		complete4() {
			return this.soduku?.isNumberComplete(4) ?? false
		},

		complete5() {
			return this.soduku?.isNumberComplete(5) ?? false
		},

		complete6() {
			return this.soduku?.isNumberComplete(6) ?? false
		},

		complete7() {
			return this.soduku?.isNumberComplete(7) ?? false
		},

		complete8() {
			return this.soduku?.isNumberComplete(8) ?? false
		},

		complete9() {
			return this.soduku?.isNumberComplete(9) ?? false
		},
	},

	type(_event, context) {
		this.handleType(parseInt(context.node.innerText))
	},

	handleType(number) {
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
			logger().error(error)
			showToast('No cell selected')
		}
	},

	toggleNotes() {
		if(this.data.easyMode) {
			return
		}

		this.data.notes = !this.data.notes
	},

	undo() {
		const state = this.data.history.pop()

		this.data.history = [...this.data.history]

		if(isNull(state)) {
			return
		}

		// TODO 

		this.soduku.setBoardFromState(state)
		this.emit('change')
	},

	reset() {
		this.data.history = []
		game.save({ picked: null })
		game.start()
		this.soduku.reset()
		this.emit('change')
	},
}
