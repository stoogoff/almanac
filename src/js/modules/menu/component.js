
import { local } from 'q/utils/storage.js'
import { min, sortByProperty } from 'q/utils/list.js'
import { formatTime } from 'utils/number.js'

export default {
	data: {
		games: [
			{
				id: 'mambo',
				title: '’Bo',
				strapline: 'Harmonise the grid of elements',
				url: '/mambo.html',
				last: false,
				best: false,
				showStats: false,
			},
		],
	},

	created() {
		this.data.games.forEach(game => {
			if(local.has(game.id)) {
				const times = local.get(game.id)

				if(times.length === 0) {
					return
				}

				game.best = formatTime(times.map(({ time }) => time).reduce(min, 1000))
				game.last = formatTime(times.sort(sortByProperty('date'))[0].time)
				game.showStats = true
			}
		})
	},
}