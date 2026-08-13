
import { local } from 'q/utils/storage.js'
import { min } from 'q/utils/list.js'
import { getGame } from 'components/game.js'
import { isMobile, showToast } from 'utils/lib.js'
import { logger } from 'utils/logger.js'
import { formatTime } from 'utils/number.js'
import { STORAGE_KEY as MAMBO } from 'mambo/types.js'
import { STORAGE_KEY as QUEENS } from 'queens/types.js'
import { STORAGE_KEY as SODUKU } from 'soduku/types.js'
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
			{
				id: SODUKU,
				title: 'Soduku',
				strapline: '',
				url: '/soduku.html',
				last: false,
				best: false,
				showStats: false,
				scoreKey: 'time',
				format: formatTime,
				icon: null,
			},
		],
	},

	computed: {
		canShare() {
			return this.data.games.every(game => {
				const currentGame = getGame(game.id)

				return currentGame.hasPlayedToday
			})
		},
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
						.filter(({ score }) => !!score)
						.map(({ score }) => game.scoreKey in score ? score[game.scoreKey] : null)
						.filter(score => !isNaN(parseInt(score)))
						.reduce(min, 1000)

					game.best = best === 1000 ? '–' : game.format(best)

					for(let i = stats.length - 1; i >= 0; i--) {
						const stat = stats[i]

						if('score' in stat && game.scoreKey in stat.score) {
							game.last = game.format(stat.score[game.scoreKey])
							break
						}
					}

					game.showStats = true
				}
				catch(err) {
					logger().error(err)

					game.best = false
					game.last = false
					game.showStats = false
				}
			}
		})
	},

	async share() {
		const gameInfo = this.data.games.map(game => {
			const currentGame = getGame(game.id)

			return `${currentGame.failedToday ? '❌' : '✅'} ${game.title}: ${game.last}`
		})

		const text = `${gameInfo.join('\n')}\n\nPlay at: knack.we-evolve.co.uk\n\n#DailyWordPuzzle #IndieDev`

		if(isMobile() && navigator.share) {
			try {
				await navigator.share({ title: "A Knack for Games", text })

				return
			}
			catch(e) {
				logger().error(e)
			}
		}

		try {
			await navigator.clipboard.writeText(text)

			showToast("Copied to Clipboard!")
		}
		catch(e) {
			showToast("Error: Could not copy");
		}
	},
}
