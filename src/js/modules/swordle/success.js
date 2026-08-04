
import { Victory } from 'components/victory.js'
import { getGame, GameStates } from 'components/game.js'
import { STORAGE_KEY } from 'swordle/types.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		word: '',
		guesses: 0,
	},

	created() {
		game.on(GameStates.GAMEOVER, result => {
			this.data.word = result.score.word
			this.data.guesses = result.score.guesses

			this.node.classList.remove('hidden')

			document.getElementById('victory').classList.remove('hidden')

			const victory = new Victory('victory')

			victory.init(
				victory.width / 2,
				victory.height * 0.55,
				Math.floor((Math.random() * 50) + 150)
			)

			victory.start()
		})
	}
}
