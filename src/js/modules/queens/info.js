
import { formatTime } from 'utils/number.js'
import { STORAGE_KEY } from 'queens/types.js'

export default {
	id: STORAGE_KEY,
	title: 'Queens',
	strapline: 'Crown each region with a single Queen',
	url: '/queens.html',
	last: false,
	best: false,
	showStats: false,
	scoreKey: 'time',
	format: formatTime,
	icon: null,
	rules: '1 Queen in each row, column and colour. Queens can’t be next to each other.',
}
