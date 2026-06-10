
import { local } from 'q/utils/storage.js'
import { min } from 'q/utils/list.js'
import { Save } from 'components/save.js'
import { formatTime } from 'utils/number.js'
import { STORAGE_KEY as MAMBO } from 'mambo/types.js'
import { STORAGE_KEY as QUEENS } from 'queens/types.js'

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
				icon: null,
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

				const save = new Save(game.id)

				if(save.hasPlayedToday) {
					game.icon = '/v1.1.1/media/trophy.svg' // TODO make this static media
				}

				game.best = formatTime(times.map(({ time }) => time).reduce(min, 1000))
				game.last = formatTime(times[times.length - 1].time)
				game.showStats = true
			}
		})
	},
}