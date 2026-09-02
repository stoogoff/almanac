
import {
	EASY,
	MEDIUM,
	HARD,
	EXTREME,
} from 'utils/lib.js'

export const STORAGE_KEY = 'soduku'

export const BOARD_SIZE = 9

export const CENTRES = [10, 13, 16, 37, 40, 43, 64, 67, 70]

export const CssClass = {
	Tile: 'tile',
	Highlight: 'highlight',
	Notes: 'notes',
	Error: 'error',
	Chosen: 'chosen',
	Match: 'matched',
}

export const ActionType = {
	NONE: 0,
	AUTOMATIC: 1,
	PLAYER: 2,
}

export const Difficulty = {
	[EASY]: 48,
	[MEDIUM]: 40,
	[HARD]: 34,
	[EXTREME]: 30,
}
