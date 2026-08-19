
import { ActionType, TileState } from 'soduku/types.js'

export class Tile {
	#action
	#cell
	#error = false
	#notes = []
	#value = 0
	#highlight = false
	#match = false

	constructor(action, cell, value = 0) {
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

	get hasValue() {
		return this.#value !== 0
	}

	get notes() {
		return this.#notes
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

	get isMatch() {
		return this.#match
	}

	set match(value) {
		this.#match = value === true
	}

	set error(value) {
		this.#error = value === true
	}

	get hasError() {
		return this.#error
	}

	get isAutomatic() {
		return this.#action === ActionType.AUTOMATIC
	}

	toggleNote(number) {
		this.#notes = this.#notes.includes(number)
			? this.#notes.filter(note => note !== number)
			: [...this.#notes, number]
	}

	hasNote(number) {
		return this.#notes.includes(number)
	}

	clearNote(number) {
		this.#notes = this.#notes.filter(note => note !== number)
	}

	state() {
		return {
			value: this.#value,
			notes: this.#notes,
		}
	}
}
