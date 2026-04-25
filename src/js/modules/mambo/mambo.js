
import { notEmptyArray } from 'q/utils/assert.js'
import { sum, unique } from 'q/utils/list.js'
import { CssClass, TileState } from './types.js'

// TODO generate random board state

export class Mambo {
	#isVerifying = false
	#size = 4 // number of tiles on each side
	#length = 16 // total number of tiles on the board
	#boardState = []
	#complete = () => {}

	constructor(size, onComplete) {
		this.#size  = size
		this.#length = size * size
		this.#boardState = new Array(this.#length)
		this.#complete = onComplete
	}

	get size() {
		return this.#size
	}

	/**
	 * Create the board and attach it to the supplied node.
	 */
	create(node, startingState = []) {
		if(notEmptyArray(startingState) && startingState.length === this.#length) {
			this.#boardState = startingState
		}

		node.classList.add(`grid-${this.#size}`)

		// create the board
		for(let i = 0; i < this.#length; i++) {
			const span = document.createElement('span')

			if(this.#boardState[i] === undefined) {
				this.#boardState[i] = TileState.EMPTY
			}

			if(this.#boardState[i] !== TileState.EMPTY) {
				span.classList.add(CssClass[this.#boardState[i]])
			}

			span.id = `tile-${i}`
			span.classList.add('tile')
			span.innerHTML = i

			// click cycles through the tiles
			// then checks the board state
			span.onclick = () => {
				if(span.classList.contains(CssClass.GREEN)) {
					span.classList.remove(CssClass.GREEN)
					span.classList.add(CssClass.BLUE)
					this.#boardState[i] = TileState.BLUE
				}
				else if(span.classList.contains(CssClass.BLUE)) {
					span.classList.remove(CssClass.BLUE)
					this.#boardState[i] = TileState.EMPTY
				}
				else {
					span.classList.add(CssClass.GREEN)
					this.#boardState[i] = TileState.GREEN
				}

				window.setTimeout(() => {
					if(!this.#isVerifying) {
						this.verifyBoard(i)
					}
				}, 300)
			}

			node.appendChild(span)
		}
	}

	reset() {
		Array.from(document.getElementsByClassName('tile')).forEach(span => {
			span.classList.remove('green')
			span.classList.remove('blue')
		})

		this.#boardState = new Array(this.#length)

		for(let i = 0; i < this.#length; i++) {
			this.#boardState[i] = TileState.EMPTY
		}
	}

	verifyBoard() {
		this.#isVerifying = true

		// each row when complete should have an equal number of each colour
		// each column when complete should have an equal number of each colour
		// no more than two of the same colour can be next to each other

		// clear errors
		Array.from(document.getElementsByClassName('error')).forEach(span => span.classList.remove('error'))

		const errors = []

		for(let tile = 0; tile < this.#size; ++tile) {
			const rows = []
			const cols = []

			// check row - row indexes are sequential
			for(let i = tile * this.#size; i < (tile * this.#size) + this.#size; i++) {
				rows.push(i)
			}

			// check column - columnn indexes are length apart
			for(let i = tile; i < this.#length; i += this.#size) {
				cols.push(i)
			}

			errors.push(...this.checkRowOrCol(rows), ...this.checkRowOrCol(cols))
		}

		// mark tiles as an error
		errors.forEach(index => document.getElementById(`tile-${index}`).classList.add('error'))

		if(errors.length === 0 && this.#boardState.reduce(sum, 0) === (this.#length + this.#length / 2)) {
			this.#complete()
		}

		this.#isVerifying = false
	}

	checkRowOrCol(tiles) {
		let lastState = null
		let errorIndexes = []
		let stateIndexes = []
		const tileCount = {
			[TileState.EMPTY]: 0,
			[TileState.GREEN]: 0,
			[TileState.BLUE]: 0,
		}

		// check row - row indexes are sequential
		for(let i = 0; i < tiles.length; i++) {
			const index = tiles[i]

			if(this.#boardState[index] === lastState && this.#boardState[index] !== TileState.EMPTY) {
				stateIndexes = unique([...stateIndexes, tiles[i - 1], index])
			}
			else {
				stateIndexes  = []
			}

			// only two of the same colour can appear in a row
			if(stateIndexes.length > 2) {
				errorIndexes = [...errorIndexes, ...stateIndexes]
			}

			lastState = this.#boardState[index]

			tileCount[this.#boardState[index]]++
		}

		if(tileCount[TileState.EMPTY] === 0 && tileCount[TileState.GREEN] !== tileCount[TileState.BLUE]) {
			errorIndexes = unique([...errorIndexes, ...tiles])
		}

		return errorIndexes
	}
}
