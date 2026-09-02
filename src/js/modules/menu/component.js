
import { local } from 'q/utils/storage.js'
import { min } from 'q/utils/list.js'
import { getGame } from 'components/game.js'
import { isMobile, showToast } from 'utils/lib.js'
import { logger } from 'utils/logger.js'
import { openRules } from 'menu/comms.js'
import MAMBO from 'mambo/info.js'
import QUEENS from 'queens/info.js'
import SODUKU from 'soduku/info.js'
import SWORDLE from 'swordle/info.js'

export default {
	data: {
		games: [MAMBO, QUEENS, SWORDLE, SODUKU],
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
			logger().error(e)
			showToast("Error: Could not copy");
		}
	},

	rules() {
		openRules()
	},
}
