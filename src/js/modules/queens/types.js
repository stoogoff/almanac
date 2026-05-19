
export const STORAGE_KEY = 'queens'

export const TileState = {
	EMPTY: 0,
	DOT: 1,
	QUEEN: 2,
}

const QUEEN = 'queen'
const DOT = 'dot'

export const CssClass = {
	[TileState.EMPTY]: '',
	[TileState.QUEEN]: QUEEN,
	[TileState.DOT]: DOT,

	QUEEN,
	DOT,
}
