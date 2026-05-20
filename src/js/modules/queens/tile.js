
import { ActionType, TileState } from 'queens/types.js'

export class Tile {
	#state
	#action

	constructor(state, action) {
		this.#state = state
		this.#action = action
	}

	get isEmpty() {
		return this.#state === TileState.EMPTY
	}

	get isDot() {
		return this.#state === TileState.DOT
	}

	get isQueen() {
		return this.#state === TileState.QUEEN
	}

	get isAutomatic() {
		return this.#action === ActionType.AUTOMATIC
	}
}