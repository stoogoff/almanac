
import { ActionType, TileState } from 'soduku/types.js'

export class Tile {
	#state
	#action
	#cell
	#error = false
	#notes = []
	#value = 0
	#highlight = false

	constructor(state, action, cell, value = 0) {
		this.#state = state
		this.#action = action
		this.#cell = cell
		this.#value = value
	}

	get value() {
		return this.#value
	}

	set value(value) {
		this.#value = value
	}

	get cell() {
		return this.#cell
	}

	get highlight() {
		return this.#highlight
	}

	set highlight(value) {
		this.#highlight = value === true
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

	get isFilled() {
		return this.#state === TileState.FILLED
	}

	get isAutomatic() {
		return this.#action === ActionType.AUTOMATIC
	}

	state() {
		return {
			value: this.#value,
			notes: this.#notes,
		}
	}
}
