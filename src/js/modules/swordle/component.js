
import { mulberry32 } from 'utils/mulberry32.js'
import { game } from 'components/state.js'
import { Save } from 'components/save.js'
import { Swordle } from 'swordle/swordle.js'
import { STORAGE_KEY, KEYBOARD_ENTER, KEYBOARD_BACKSPACE } from 'swordle/types.js'

export default {
	mounted() {
		const save = new Save(STORAGE_KEY)

		if(save.hasPlayedToday) {
			game.score({ guesses: 0 })
			game.gameover()

			return
		}

		//const now = new Date()
		//const seed = now.getFullYear() + (now.getMonth() * 100) + now.getDate()
		//const randomiser = mulberry32(seed)
		const node = document.getElementById('swordle-board')

		//const SIZE = 8
		//const board = generate(SIZE, randomiser)

		this.swordle = new Swordle('should', (guesses) => {
			game.score({ guesses })
			game.gameover()
		}, () => {
			console.log('fail')
			// TODO what to do in a fail
			game.fail()
		})
		this.swordle.create(node)
		game.start()
	},

	type(_event, context) {
		const letter = context.node.innerText

		if(letter === KEYBOARD_ENTER) {
			this.swordle.enter()
		}
		else if(context.node.classList.contains(KEYBOARD_BACKSPACE)) {
			this.swordle.backspace()
		}
		else {
			this.swordle.type(letter)
		}
	}
}
