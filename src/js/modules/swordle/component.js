
import { notNull } from 'q/utils/assert.js'
import { rand } from 'utils/seed.js'
import { getGame } from 'components/game.js'
import { Swordle } from 'swordle/swordle.js'
import { 
	FAILED_SCORE,
	GUESSES,
	KEYBOARD_BACKSPACE,
	KEYBOARD_ENTER,
	STORAGE_KEY,
} from 'swordle/types.js'
import { words } from 'swordle/words.js'

const game = getGame(STORAGE_KEY)

export default {
	words: [],

	mounted() {
		if(game.hasPlayedToday) {
			if(game.state.score.guesses === FAILED_SCORE) {
				game.fail()
			}
			else {
				game.gameover()
			}

			return
		}

		const word = words[Math.floor(rand() * words.length)]
		const node = document.getElementById('swordle-board')

		this.swordle = new Swordle(GUESSES, word, (guesses) => {
			game.gameover({ score: { word, guesses }})
		}, (word) => {
			game.fail({ score: { word, guesses: FAILED_SCORE }})
		})

		this.swordle.create(node)

		if(notNull(game.state?.words ?? null)) {
			this.words = game.state?.words ?? []
			this.swordle.setGuesses(game.state.words)
		}

		game.start()
	},

	type(_event, context) {
		const letter = context.node.innerText

		if(letter === KEYBOARD_ENTER) {
			const addedWord = this.swordle.enter()

			if(notNull(addedWord)) {
				this.words.push(addedWord)

				game.save({ words: [...this.words]})
			}
		}
		else if(context.node.classList.contains(KEYBOARD_BACKSPACE)) {
			this.swordle.backspace()
		}
		else {
			this.swordle.type(letter)
		}
	}
}
