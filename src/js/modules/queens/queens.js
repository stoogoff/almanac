
import { Grid } from 'components/grid.js'
import { ActionType, CssClass, TileColours, TileState } from 'queens/types.js'
import { Tile } from 'queens/tile.js'

export class Queens {
	#isVerifying = false
	#grid = null
	#boardState = []
	#board = []
	#complete = () => {}
	#history = () => {}

	constructor(board, onComplete, history) {
		const size = Math.sqrt(board.length)

		this.#complete = onComplete
		this.#history = history
		this.#grid = new Grid(size, size)
		this.#boardState = new Array(this.#grid.size).fill(
			new Tile(TileState.EMPTY, ActionType.NONE)
		)
		this.#board = board
	}

	create(node, randomiser) {
		//const puzzle = this.generatePuzzle(randomiser)
		console.log({ boardState: this.#boardState })

		node.classList.add(`grid-${this.#grid.width}`)



		// create the board
		for(let i = 0; i < this.#grid.size; i++) {
			const span = document.createElement('span')

			/*if(this.#boardState[i] !== TileState.EMPTY) {
				span.classList.add(CssClass[this.#boardState[i]])
			}*/

			span.id = `tile-${i}`
			span.classList.add('tile')
			//span.innerHTML = i

			// board colour
			span.classList.add(TileColours[this.#board[i]])

			span.onclick = () => {
				this.#history({ index: i, state: this.#boardState[i] })

				if(span.classList.contains(CssClass.DOT)) {
					// TODO setting a queen should set all empty tiles to dots under the following conditions:
					// all in column
					// all in row
					// all adjacent
					// all in colour

					// set tile from dot to queen
					span.classList.remove(CssClass.DOT)
					span.classList.add(CssClass.QUEEN)
					this.#boardState[i] = new Tile(TileState.QUEEN, ActionType.PLAYER)
					this.setDotsFromQueen(i)
				}
				else if(span.classList.contains(CssClass.QUEEN)) {
					// set tile from queen to empty
					span.classList.remove(CssClass.QUEEN)
					this.#boardState[i] = new Tile(TileState.EMPTY, ActionType.PLAYER)
					this.clearDotsFromQueen(i)
				}
				else {
					// set tile to empty
					span.classList.add(CssClass.DOT)
					this.#boardState[i] = new Tile(TileState.DOT, ActionType.PLAYER)
				}

				window.setTimeout(() => {
					

					/*if(!this.#isVerifying) {
						this.verifyBoard()
					}*/
				}, 100)

				//this.#complete()
			}

			node.appendChild(span)
		}
	}

	reset() {
		// TODO clear the board
	}

	undo(state) {
		/*this.#boardState[state.index] = state.state

		const tile = document.getElementById(`tile-${state.index}`)

		tile.classList.remove(CssClass.QUEEN)
		tile.classList.remove(CssClass.DOT)

		if(state.state !== TileState.EMPTY) {
			tile.classList.add(CssClass[state.state])
		}*/

		//this.verifyBoard()*/
	}

	getRelatedTiles(tile) {
		const colour = this.#board[tile]

		return [
			...this.#grid.rowIndicesExclusive(tile),
			...this.#grid.columnIndicesExclusive(tile),
			...this.#grid.neighbours(tile),
			...this.#board
				.map((colour, index) => ({
					colour,
					index,
				}))
				.filter(item => item.colour === colour)
				.map(item => item.index)
		]
	}

	setDotsFromQueen(tile) {
		if(!this.#boardState[tile].isQueen) {
			return
		}

		const tiles = this.getRelatedTiles(tile)

		for(let i = 0; i < tiles.length; i++) {
			const index = tiles[i]

			if(this.#boardState[index].isEmpty) {
				const tile = document.getElementById(`tile-${index}`)

				tile.classList.add(CssClass.DOT)
				this.#boardState[index] = new Tile(TileState.DOT, ActionType.AUTOMATIC)
			}
		}
	}

	clearDotsFromQueen(tile) {
		if(this.#boardState[tile].isQueen) {
			return
		}

		const tiles = this.getRelatedTiles(tile)

		for(let i = 0; i < tiles.length; i++) {
			const index = tiles[i]

			// TODO may need to rethink this as it clears dots which have been set by another queen
			if(this.#boardState[index].isDot && this.#boardState[index].isAutomatic) {
				const tile = document.getElementById(`tile-${index}`)

				tile.classList.remove(CssClass.DOT)
				this.#boardState[index] = new Tile(TileState.EMPTY, ActionType.AUTOMATIC)
			}
		}
	}

	/*setRowOrCol(tiles, tileState) {
		for(let i = 0; i < tiles.length; i++) {
			const index = tiles[i]

			if(this.#boardState[index].isEmpty) {
				const tile = document.getElementById(`tile-${index}`)

				tile.classList.add(CssClass.DOT)
				this.#boardState[index] = new Tile(TileState.DOT, ActionType.AUTOMATIC)
			}
		}
	}*/

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
}
