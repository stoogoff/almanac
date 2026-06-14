
import { rand } from 'utils/seed.js'
import { game } from 'components/state.js'
import { Save } from 'components/save.js'
import { Swordle } from 'swordle/swordle.js'
import { GUESSES, STORAGE_KEY, KEYBOARD_ENTER, KEYBOARD_BACKSPACE } from 'swordle/types.js'
import { words } from 'swordle/words.js'

export default {
	mounted() {
		const index = Math.floor(rand() * words.length)
		const word = words[index]

		const save = new Save(STORAGE_KEY)

		if(save.hasPlayedToday) {
			const result = save.todaysScore

			if(result.score.guesses == 'x') {
				game.fail(result)
			}
			else {
				game.score(result)
				game.gameover()
			}

			return
		}

		const node = document.getElementById('swordle-board')

		this.swordle = new Swordle(GUESSES, word, (guesses) => {
			game.score({ word, guesses })
			game.gameover()
		}, (word) => {
			game.fail({ word, guesses: 'x' })
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
