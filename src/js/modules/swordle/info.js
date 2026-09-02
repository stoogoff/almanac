
import { STORAGE_KEY } from 'swordle/types.js'

export default {
	id: STORAGE_KEY,
	title: '6wordle',
	strapline: 'Six letter Wordle',
	url: '/swordle.html',
	last: false,
	best: false,
	showStats: false,
	scoreKey: 'guesses',
	format: x => x === 'x' ? 'failed' : `${x} guesses`,
	icon: null,
	rules: 'Guess the six-letter word. Green means the letter is in the word and in the correct position. Yellow means the letter is somewhere else in the word.',
}
