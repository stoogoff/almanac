
import { notEmptyArray } from 'q/utils/assert.js'
import { sum, unique } from 'q/utils/list.js'
import { CssClass, TileState } from 'mambo/types.js'

export class Mambo {
	#isVerifying = false
	#size = 4 // number of tiles on each side
	#length = 16 // total number of tiles on the board
	#boardState = []
	#startingState = []
	#complete = () => {}
	#history = () => {}

	constructor(size, onComplete, history) {
		this.#size  = size
		this.#length = size * size
		this.#complete = onComplete
		this.#startingState = this.#boardState = new Array(this.#length)
		this.#history = history
	}

	get size() {
		return this.#size
	}

	get length() {
		return this.#length
	}

	/**
	 * Create the board and attach it to the supplied node.
	 */
	create(node, randomiser) {
		const puzzle = this.generatePuzzle(randomiser, 14)
		//const puzzle = this.generateSolution(randomiser)

		this.#boardState = [...puzzle]
		this.#startingState = [...puzzle]

		node.classList.add(`grid-${this.size}`)

		// create the board
		for(let i = 0; i < this.length; i++) {
			const span = document.createElement('span')

			if(this.#boardState[i] !== TileState.EMPTY) {
				span.classList.add(CssClass[this.#boardState[i]])
			}

			span.id = `tile-${i}`
			span.classList.add('tile')

			// click cycles through the tiles
			// then checks the board state
			span.onclick = () => {
				this.#history({ index: i, state: this.#boardState[i] })

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
			span.classList.remove('error')
		})

		this.#boardState = [...this.#startingState]

		for(let i = 0; i < this.length; i++) {
			if(this.#boardState[i] === TileState.EMPTY) {
				continue;
			}

			document.getElementById(`tile-${i}`).classList.add(CssClass[this.#boardState[i]])
		}
	}

	undo(state) {
		this.#boardState[state.index] = state.state

		const tile = document.getElementById(`tile-${state.index}`)

		tile.classList.remove('green')
		tile.classList.remove('blue')

		if(state.state !== TileState.EMPTY) {
			tile.classList.add(CssClass[state.state])
		}

		this.verifyBoard()
	}

	verifyBoard() {
		this.#isVerifying = true

		// each row when complete should have an equal number of each colour
		// each column when complete should have an equal number of each colour
		// no more than two of the same colour can be next to each other

		// clear errors
		Array.from(document.getElementsByClassName('error')).forEach(span => span.classList.remove('error'))

		const errors = this.isValid(this.#boardState)

		// mark tiles as an error
		errors.forEach(index => document.getElementById(`tile-${index}`).classList.add('error'))

		if(errors.length === 0 && this.#boardState.reduce(sum, 0) === (this.length + this.length / 2)) {
			this.#complete()
		}

		this.#isVerifying = false
	}

	isValid(boardState) {
		const errors = []

		for(let tile = 0; tile < this.size; ++tile) {
			const rows = []
			const cols = []

			// check row - row indexes are sequential
			for(let i = tile * this.size; i < (tile * this.size) + this.size; i++) {
				rows.push(i)
			}

			// check column - columnn indexes are length apart
			for(let i = tile; i < this.length; i += this.size) {
				cols.push(i)
			}

			errors.push(...this.checkRowOrCol(boardState, rows), ...this.checkRowOrCol(boardState, cols))
		}

		return errors
	}

	checkRowOrCol(boardState, tiles) {
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

			if(boardState[index] === lastState && boardState[index] !== TileState.EMPTY) {
				stateIndexes = unique([...stateIndexes, tiles[i - 1], index])
			}
			else {
				stateIndexes  = []
			}

			// only two of the same colour can appear in a row
			if(stateIndexes.length > 2) {
				errorIndexes = [...errorIndexes, ...stateIndexes]
			}

			lastState = boardState[index]

			tileCount[boardState[index]]++
		}

		if(tileCount[TileState.EMPTY] === 0 && tileCount[TileState.GREEN] !== tileCount[TileState.BLUE]) {
			errorIndexes = unique([...errorIndexes, ...tiles])
		}

		return errorIndexes
	}

	generateSolution(randomiser) {
		const board = new Array(this.length).fill(TileState.EMPTY)

		const solve = idx => {
			if(idx === this.length) return true
			
			const row = Math.floor(idx / this.size)
			const col = idx % this.size
			
			const colours = randomiser() < 0.5 ? [TileState.GREEN, TileState.BLUE] : [TileState.BLUE, TileState.GREEN]
			
			for(const colour of colours) {
				board[idx] = colour

				const errors = this.isValid(board)

				if(errors.length === 0 && solve(idx + 1)) {
					return true
				}
			}
			
			board[idx] = TileState.EMPTY
			return false
		}
		
		solve(0)
		return board
	}

	generatePuzzle(randomiser, keep) {
		const solution = this.generateSolution(randomiser)
		const puzzle = [...solution]
		const indices = Array.from({ length: this.length }, (_, i) => i)

		for(let i = indices.length - 1; i > 0; i--) {
			const j = Math.floor(randomiser() * (i + 1))
			const [a, b] = [indices[j], indices[i]]

			indices[i] = a
			indices[j] = b
		}
		
		const toRemove = this.length - keep

		for(let i = 0; i < toRemove; i++) {
			puzzle[indices[i]] = TileState.EMPTY
		}
		
		return puzzle
	}
}
