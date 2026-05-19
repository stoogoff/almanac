
import { CssClass, TileState } from 'queens/types.js'

export class Queens {
	#isVerifying = false
	#size = 10 // number of tiles on each side
	#length = 100 // total number of tiles on the board
	#boardState = []
	#startingState = []
	#complete = () => {}
	#history = () => {}

	constructor(size, onComplete, history) {
		this.#complete = onComplete
		this.#history = history
		this.#size  = size
		this.#length = size * size
		this.#startingState = this.#boardState = new Array(this.#length)
	}

	get size() {
		return this.#size
	}

	get length() {
		return this.#length
	}

	create(node, randomiser) {
		const puzzle = this.generatePuzzle(randomiser)

		node.classList.add(`grid-${this.size}`)

		// create the board
		for(let i = 0; i < this.length; i++) {
			const span = document.createElement('span')

			/*if(this.#boardState[i] !== TileState.EMPTY) {
				span.classList.add(CssClass[this.#boardState[i]])
			}*/

			span.id = `tile-${i}`
			span.classList.add('tile')

			span.onclick = () => {
				this.#history({ index: i, state: this.#boardState[i] })

				if(span.classList.contains(CssClass.DOT)) {
					// TODO setting a queen should set all empty tiles to dots under the following conditions:
					// all in column
					// all in row
					// all adjacent
					// all in colour
					span.classList.remove(CssClass.DOT)
					span.classList.add(CssClass.QUEEN)
					this.#boardState[i] = TileState.QUEEN
				}
				else if(span.classList.contains(CssClass.QUEEN)) {
					// TODO remove dots that would be set by this queen
					span.classList.remove(CssClass.QUEEN)
					this.#boardState[i] = TileState.EMPTY
				}
				else {
					span.classList.add(CssClass.DOT)
					this.#boardState[i] = TileState.DOT
				}

				window.setTimeout(() => {
					this.updateBoard()

					/*if(!this.#isVerifying) {
						this.verifyBoard()
					}*/
				}, 300)
			}

			node.appendChild(span)
		}
	}

	reset() {
		// TODO clear the board
	}

	undo(state) {
		this.#boardState[state.index] = state.state

		const tile = document.getElementById(`tile-${state.index}`)

		tile.classList.remove(CssClass.QUEEN)
		tile.classList.remove(CssClass.DOT)

		if(state.state !== TileState.EMPTY) {
			tile.classList.add(CssClass[state.state])
		}

		//this.verifyBoard()*/
	}

	updateBoard() {
		console.log(this.#boardState, TileState.QUEEN)

		for(let tile = 0; tile < this.length; ++tile) {
			if(this.#boardState[tile] === TileState.QUEEN) {
				console.log(`got QUEEN at ${tile}`)
			}
		}

		/*for(let tile = 0; tile < this.size; ++tile) {
			console.log(this.#boardState[tile] === TileState.QUEEN)
			if(this.#boardState[tile] !== TileState.QUEEN) {
				continue
			}


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

			this.fillRowOrColWithDot([...rows, ...cols])
		}*/
	}

	fillRowOrColWithDot(tiles) {
		console.log('fillRowOrColWithDot', tiles)

		for(let i = 0; i < tiles.length; i++) {
			if(this.#boardState[i] === TileState.EMPTY) {
				const tile = document.getElementById(`tile-${i}`)

				tile.classList.add(CssClass.DOT)
			}
		}
	}

	verifyBoard() {
		this.#isVerifying = true

		// can't have more than one queen in a row or column
		// queens can't be adjacent
		// TODO colours
		// if a queen is set the rows, columns and adjacent should be dotted

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

		/*for(let tile = 0; tile < this.size; ++tile) {
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
		}*/

		return errors
	}

	generatePuzzle(randomiser) {
		// TODO randomly place queens following the rules of the game
		// TODO randomly generate contiguous colour blocks around the queens
	}
}
