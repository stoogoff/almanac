
import { unique } from 'q/utils/list.js'
import { Grid } from 'components/grid.js'
import { ActionType, CssClass, TileColours, TileState } from 'queens/types.js'
import { Tile } from 'queens/tile.js'

export class Queens {
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
		this.#boardState = new Array(this.#grid.size)

		for(let i = 0; i < this.#boardState.length; i++) {
			this.#boardState[i] = new Tile(TileState.EMPTY, ActionType.NONE, i)
		}

		this.#board = board
	}

	create(node) {
		node.classList.add(`grid-${this.#grid.width}`)

		// create the board
		for(let i = 0; i < this.#grid.size; i++) {
			const span = document.createElement('span')

			span.id = `tile-${i}`
			span.classList.add('tile')

			// board colour
			span.classList.add(TileColours[this.#board[i]])

			span.onclick = () => {
				this.#history({ index: i, state: this.#boardState[i] })

				if(span.classList.contains(CssClass.DOT)) {
					// set tile from dot to queen
					this.#boardState[i] = new Tile(TileState.QUEEN, ActionType.PLAYER, i)
				}
				else if(span.classList.contains(CssClass.QUEEN)) {
					// set tile from queen to empty
					this.#boardState[i] = new Tile(TileState.EMPTY, ActionType.PLAYER, i)
				}
				else {
					// set tile to empty
					this.#boardState[i] = new Tile(TileState.DOT, ActionType.PLAYER, i)
				}

				window.setTimeout(() => {
					this.verifyBoard()
					this.drawBoard()
				}, 100)
			}

			node.appendChild(span)
		}
	}

	reset() {
		for(let i = 0; i < this.#boardState.length; i++) {
			this.#boardState[i] = new Tile(TileState.EMPTY, ActionType.NONE, i)
		}

		this.drawBoard()
	}

	undo(state) {
		this.#boardState[state.index] = state.state
		this.verifyBoard()
		this.drawBoard()
	}

	getRelatedTiles(tile) {
		const colour = this.#board[tile]

		return unique([
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
				.filter(item => item !== tile)
		])
	}

	drawBoard() {
		for(let i = 0; i < this.#boardState.length; i++) {
			const tile = document.getElementById(`tile-${i}`)

			if(this.#boardState[i].isEmpty) {
				tile.classList.remove(CssClass.DOT)
				tile.classList.remove(CssClass.QUEEN)
			}
			else if(this.#boardState[i].isDot) {
				tile.classList.add(CssClass.DOT)
				tile.classList.remove(CssClass.QUEEN)
			}
			else if(this.#boardState[i].isQueen) {
				tile.classList.remove(CssClass.DOT)
				tile.classList.add(CssClass.QUEEN)
			}

			if(this.#boardState[i].isError) {
				tile.classList.add(CssClass.ERROR)
			}
			else {
				tile.classList.remove(CssClass.ERROR)
			}
		}
	}

	verifyBoard() {
		// clear automatic dot cells
		const dotCells = this.#boardState.filter(state => state.isDot && state.isAutomatic)

		for(let i = 0; i < dotCells.length; i++) {
			this.#boardState[dotCells[i].cell] = new Tile(TileState.EMPTY, ActionType.NONE, dotCells[i].cell)
		}

		// get all queens
		const queens = this.#boardState.filter(state => state.isQueen)
		const errorCells = []

		for(let i = 0; i < queens.length; i++) {
			const cell = queens[i].cell

			this.#boardState[cell].error = false

			const checkCells = this.getRelatedTiles(cell)

			for(let j = 0; j < checkCells.length; j++) {
				const tile = checkCells[j]

				if(this.#boardState[tile].isQueen) {
					errorCells.push(tile, cell)
				}
				else if(this.#boardState[tile].isEmpty) {
					this.#boardState[tile] = new Tile(TileState.DOT, ActionType.AUTOMATIC, tile)
				}
			}
		}

		for(let i  = 0; i < errorCells.length; i++) {
			this.#boardState[errorCells[i]].error = true
		}

		// if there are no errors and all queens have been placed
		if(errorCells.length === 0 && queens.length === Math.sqrt(this.#boardState.length)) {
			this.#complete()
		}
	}
}
