
import { getGame, GameStates } from 'components/game.js'
import { STORAGE_KEY } from 'swordle/types.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		word: '',
	},

	created() {
		game.on(GameStates.FAIL, result => {
			this.data.word = result.score.word

			this.node.classList.remove('hidden')
		})
	}
}
