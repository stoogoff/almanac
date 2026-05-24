
import { ActionType, TileState } from 'queens/types.js'

export class Tile {
	#state
	#action
	#cell
	#error = false

	constructor(state, action, cell) {
		this.#state = state
		this.#action = action
		this.#cell = cell
	}

	get cell() {
		return this.#cell
	}

	set error(value) {
		this.#error = value === true
	}

	get isError() {
		return this.#error
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