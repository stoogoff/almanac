
import { formatTime } from 'utils/number.js'
import { STORAGE_KEY } from 'mambo/types.js'

export default {
	id: STORAGE_KEY,
	title: '’Bo',
	strapline: 'Harmonise the grid of elements',
	url: '/mambo.html',
	last: false,
	best: false,
	showStats: false,
	scoreKey: 'time',
	format: formatTime,
	icon: null,
	rules: 'An even number of each colour in every row and column. No more than two colours in a sequence.',
}