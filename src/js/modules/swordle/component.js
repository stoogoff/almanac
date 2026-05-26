
import { isNull } from 'q/utils/assert.js'
import { mulberry32 } from 'utils/mulberry32.js'
import { game } from 'components/state.js'
import { Save } from 'components/save.js'
import { Swordle } from 'swordle/swordle.js'
import { STORAGE_KEY, KEYBOARD_ENTER, KEYBOARD_BACKSPACE } from 'swordle/types.js'
//import { generate } from 'swordle/generator.js'

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

		//const now = new Date()
		//const seed = now.getFullYear() + (now.getMonth() * 100) + now.getDate()
		//const randomiser = mulberry32(seed)
		const node = document.getElementById('swordle-board')

		//const SIZE = 8
		//const board = generate(SIZE, randomiser)

		this.swordle = new Swordle('should', () => {
			game.gameover()
		}, (state) => {
			this.data.history = [...this.data.history, state]
		})
		this.swordle.create(node)
		game.start()
	},

	type(event) {
		const letter = event.srcElement.innerText

		if(letter === KEYBOARD_ENTER) {
			this.swordle.enter()
		}
		else if(letter === KEYBOARD_BACKSPACE) {
			this.swordle.backspace()
		}
		else {
			this.swordle.type(letter)
		}
	}

	/*computed: {
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

		this.swordle.undo(state)
	},

	reset() {
		game.start()
		this.swordle.reset()
	},*/
}
