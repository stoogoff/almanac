
export const STORAGE_KEY = 'soduku'

export const BOARD_SIZE = 9

export const CssClass = {
	Tile: 'tile',
	Highlight: 'highlight',
	Notes: 'notes',
	Error: 'error',
	Chosen: 'chosen',
	Match: 'matched',
}

export const TileState = {
	EMPTY: 0,
	FILLED: 1,
}

export const ActionType = {
	NONE: 0,
	AUTOMATIC: 1,
	PLAYER: 2,
}

export const DIFFICULTY = {
	Easy: 40,
	Medium: 32,
	Hard: 26
}
