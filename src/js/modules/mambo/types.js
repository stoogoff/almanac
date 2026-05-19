
export const STORAGE_KEY = 'mambo'

export const TileState = {
	EMPTY: 0,
	GREEN: 1,
	BLUE: 2,
}

const GREEN = 'green'
const BLUE = 'blue'

export const CssClass = {
	[TileState.EMPTY]: '',
	[TileState.GREEN]: GREEN,
	[TileState.BLUE]: BLUE,

	GREEN,
	BLUE,
}
