
import { formatTime } from 'utils/number.js'
import { STORAGE_KEY } from 'soduku/types.js'

export default {
	id: STORAGE_KEY,
	title: 'Soduku',
	strapline: 'Numbers nine by nine',
	url: '/soduku.html',
	last: false,
	best: false,
	showStats: false,
	scoreKey: 'time',
	format: formatTime,
	icon: null,
	info: '',
}
