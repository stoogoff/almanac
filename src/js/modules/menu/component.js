
import { local } from 'q/utils/storage.js'
import { min } from 'q/utils/list.js'
import { getGame } from 'components/game.js'
import { formatTime } from 'utils/number.js'
import { STORAGE_KEY as MAMBO } from 'mambo/types.js'
import { STORAGE_KEY as QUEENS } from 'queens/types.js'
import { STORAGE_KEY as SWORDLE } from 'swordle/types.js'

export default {
	data: {
		games: [
			{
				id: MAMBO,
				title: '’Bo',
				strapline: 'Harmonise the grid of elements',
				url: '/mambo.html',
				last: false,
				best: false,
				showStats: false,
				scoreKey: 'time',
				format: formatTime,
				icon: null,
			},
			{
				id: QUEENS,
				title: 'Queens',
				strapline: 'Crown each region with a single Queen',
				url: '/queens.html',
				last: false,
				best: false,
				showStats: false,
				scoreKey: 'time',
				format: formatTime,
				icon: null,
			},
			{
				id: SWORDLE,
				title: '6wordle',
				strapline: 'Six letter Wordle',
				url: '/swordle.html',
				last: false,
				best: false,
				showStats: false,
				scoreKey: 'guesses',
				format: x => x === 'x' ? 'failed' : `${x} guesses`,
				icon: null,
			},
		],
	},

	created() {
		this.data.games.forEach(game => {
			if(local.has(game.id)) {
				const stats = local.get(game.id)

				if(stats.length === 0) {
					return
				}

				const currentGame = getGame(game.id)

				if(currentGame.hasPlayedToday) {
					game.icon = currentGame.failedToday ? '/media/shock.svg' : '/media/trophy.svg'
				}

				try {
					const best = stats
						.map(({ score }) => score[game.scoreKey])
						.filter(score => !isNaN(parseInt(score)))
						.reduce(min, 1000)

					game.best = best === 1000 ? '–' : game.format(best)
					game.last = game.format(stats[stats.length - 1].score[game.scoreKey])
					game.showStats = true
				}
				catch {
					game.best = false
					game.last = false
					game.showStats = false
				}
			}
		})
	},
}
