
export const STORAGE_KEY = 'queens'

export const TileState = {
	EMPTY: 0,
	DOT: 1,
	QUEEN: 2,
}

export const ActionType = {
	NONE: 0,
	AUTOMATIC: 1,
	PLAYER: 2,
}

const QUEEN = 'queen'
const DOT = 'dot'

export const CssClass = {
	[TileState.EMPTY]: '',
	[TileState.QUEEN]: QUEEN,
	[TileState.DOT]: DOT,

	QUEEN,
	DOT,
	ERROR: 'error',
}

export const TileColours = {
	0: 'blue',
	1: 'amber',
	2: 'cyan',
	3: 'red',
	4: 'emerald',
	5: 'lime',
	6: 'purple',
	7: 'pink',
	8: 'orange',
	9: 'indigo',
}
