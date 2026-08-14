
import { Grid } from 'components/grid.js'
import { ActionType, CssClass, TileState } from 'soduku/types.js'
import { Tile } from 'soduku/tile.js'

const BOARD_SIZE = 9

export class Soduku {
	#startingState = []
	#boardState = []
	#grid
	#complete = () => {}
	#history = () => {}

	constructor(board, onComplete, history) {
		this.#complete = onComplete
		this.#history = history
		this.#startingState = board
		this.#grid = new Grid(BOARD_SIZE, BOARD_SIZE)
		this.#boardState = new Array(this.#grid.size)

		console.log(this.#boardState.length)

		// TODO this is going to need to be called from reset as well
		for(let i = 0; i < this.#boardState.length; i++) {
			if(board[i]) {
				this.#boardState[i] = new Tile(TileState.FILLED, ActionType.AUTOMATIC, i, board[i])
			}
			else {
				this.#boardState[i] = new Tile(TileState.EMPTY, ActionType.NONE, i)
			}
		}
	}

	get selectedTile() {
		return this.#boardState.find(tile => tile.highlight)
	}

	create(node) {
		// create the board
		for(let i = 0; i < this.#boardState.length; i++) {
			const span = document.createElement('span')

			span.id = `tile-${i}`
			span.classList.add(CssClass.Tile)
			span.onclick = () => {console.log('onclick')
				const current = this.selectedTile

				if(current) current.highlight = false

				this.#boardState[i].highlight = true
				this.draw()
			}
			node.appendChild(span)
		}
	}

	setNote(number) {
		const tile = this.selectedTile

		if(!tile) throw new Error("No tile selected")

		// TODO draw small numbers as notes
		// these will all need to be visible but are cleared if are number is written
		// they need to be stored in the history so if someone adds a number over a square
		// with notes in then presses undo it will clear the number and put the notes back
	}

	setNumber(number) {
		const tile = this.selectedTile

		if(!tile) throw new Error("No tile selected")

		const index = tile.cell

		this.#history({ index , state: this.#boardState[index].state() })
		this.#boardState[index].value = number
		this.verify()
		this.draw()
	}

	reset() {
		//this.#boardState = this.#startingState
		//this.draw()
	}

	undo(state) {
		this.#boardState[state.index].value = state.state.value
		//this.#boardState[state.index].notes = state.state.notes
		this.verify()
		this.draw()
	}

	verify() {
		function validate(tiles) {
			const seen = {}

			for(const tile of tiles) {
				if(tile.value === 0) {
					continue
				}

				seen[tile.value] = seen[tile.value] ?? []
				seen[tile.value].push(tile)
			}

			for(const tiles of Object.values(seen)) {
				if(tiles.length > 1) {
					tiles.forEach(t => t.error = true)
				}
			}
		}

		function validateGroup(boardState, indices) {
			const tiles = []

			for(let j = 0; j < indices.length; j++) {
				tiles.push(boardState[indices[j]])
			}

			validate(tiles)			
		}

		// clear error state for the whole board
		this.#boardState.forEach(tile => tile.error = false)

		// go through every column and check the numbers
		for(let i = 0; i < this.#grid.width; i++) {
			validateGroup(this.#boardState, this.#grid.rowIndices(i))
		}

		// go through every row and check the numbers
		for(let i = 0; i < this.#grid.height; i++) {
			validateGroup(this.#boardState, this.#grid.columnIndices(i))
		}

		// go through the nine grids
		const neighbours = [10, 13, 16, 37, 40, 43, 64, 67, 70]

		for(let i = 0; i < neighbours.length; i++) {
			validateGroup(this.#boardState, this.#grid.neighbours(neighbours[i]))
		}
	}

	draw() {
		for(let i = 0, len = this.#boardState.length; i < len; i++) {
			const node = document.getElementById(`tile-${i}`)
			const tile = this.#boardState[i]

			if(!node) {
				console.error(`Node with ID: 'tile-${i}'' not found`)
				continue
			}

			if(tile.isError) {
				node.classList.add(CssClass.Error)
			}
			else {
				node.classList.remove(CssClass.Error)
			}

			if(tile.highlight) {
				node.classList.add(CssClass.Highlight)
			}
			else {
				node.classList.remove(CssClass.Highlight)
			}

			node.innerText = tile.value || ''
		}
	}
}
