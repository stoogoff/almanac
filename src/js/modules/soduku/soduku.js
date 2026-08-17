
import { Grid } from 'components/grid.js'
import { ActionType, CssClass, TileState, BOARD_SIZE } from 'soduku/types.js'
import { Tile } from 'soduku/tile.js'

export class Soduku {
	#startingState = []
	#boardState = []
	#grid
	#complete = () => {}
	#history = (_state) => {}

	constructor(board, onComplete, history) {
		this.#complete = onComplete
		this.#history = history
		this.#startingState = board
		this.#grid = new Grid(BOARD_SIZE, BOARD_SIZE)

		this.setBoardState()
	}

	get selectedTile() {
		return this.#boardState.find(tile => tile.highlight)
	}

	create(node) {
		// load the template to clone cells from
		const template = document.getElementById('cell')

		// create the board
		for(let i = 0; i < this.#boardState.length; i++) {
			const clone = template.content.cloneNode(true)
			const cell = clone.firstElementChild

			cell.id = `tile-${i}`
			cell.onclick = () => {
				const current = this.selectedTile

				if(current) current.highlight = false

				this.#boardState[i].highlight = true

				this.setMatch(i)
				this.draw()
			}

			node.appendChild(cell)
		}

		this.draw()
	}

	setMatch(index) {
		// set matching tiles
		this.#boardState.forEach(tile => tile.match = false)

		if(this.#boardState[index].hasValue) {
			this.#boardState
				.filter(tile => tile.value === this.#boardState[index].value && tile.cell !== this.#boardState[index].cell)
				.forEach(tile => tile.match = true)
		}
	}

	setNote(number) {
		const tile = this.selectedTile

		if(!tile) throw new Error("No tile selected")

		if(tile.hasValue || tile.isAutomatic) return

		tile.toggleNote(number)
	}

	setNumber(number) {
		const tile = this.selectedTile

		if(!tile) throw new Error("No tile selected")

		if(tile.isAutomatic) return

		const index = tile.cell

		this.#history({ index , state: this.#boardState[index].state() })
		this.#boardState[index].value = number

		this.setMatch(index)
		this.verify()
		this.draw()
	}

	setBoardState() {
		this.#boardState = new Array(this.#grid.size)

		for(let i = 0; i < this.#boardState.length; i++) {
			if(this.#startingState[i] !== 0) {
				this.#boardState[i] = new Tile(ActionType.AUTOMATIC, i, this.#startingState[i])
			}
			else {
				this.#boardState[i] = new Tile(ActionType.NONE, i)
			}
		}
	}

	reset() {
		this.setBoardState()
		this.draw()
	}

	undo(state) {
		this.#boardState[state.index].value = state.state.value
		//this.#boardState[state.index].notes = state.state.notes

		this.setMatch(state.index)
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

		const complete = this.#boardState.filter(tile => tile.hasValue && !tile.hasError)

		if(complete.length === this.#boardState.length) {
			this.#complete()
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

			if(tile.isAutomatic) {
				node.classList.add(CssClass.Chosen)
			}

			if(tile.hasError) {
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

			if(tile.isMatch) {
				node.classList.add(CssClass.Match)
			}
			else {
				node.classList.remove(CssClass.Match)
			}	

			// if tile.hasValue else draw notes
			//node.innerText = tile.value || ''
			const value = Array.from(node.getElementsByClassName('value'))
			console.log({ value })
			value[0].innerText = '1'//tile.value || ''
		}
	}
}
