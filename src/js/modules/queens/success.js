
import { Victory } from 'components/victory.js'
import { getGame, GameStates } from 'components/game.js'
import { STORAGE_KEY } from 'queens/types.js'
import { formatTime } from 'utils/number.js'

const game = getGame(STORAGE_KEY)

export default {
	data: {
		time: '00:00',
	},

	created() {
		game.on(GameStates.GAMEOVER, () => {
			this.data.time = formatTime(game.state?.score.time)
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
