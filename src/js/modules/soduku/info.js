
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
	rules: 'Each number can only appear once in a row, column, or large square. Tap a square to enter a number. Use the pencil to toggle between entering a number and adding a note.',
}
