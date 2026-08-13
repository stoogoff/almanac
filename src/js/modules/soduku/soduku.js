
const BOARD_SIZE = 9 * 9

export class Soduku {
	#boardState = []
	#complete = () => {}
	#history = () => {}

	constructor(board, onComplete, history) {
		this.#complete = onComplete
		this.#history = history
	}

	create(node) {
		// create the board
		for(let i = 0; i < BOARD_SIZE; i++) {
			const span = document.createElement('span')

			span.id = `tile-${i}`
			node.appendChild(span)
		}
	}

	reset() {

	}

	undo(state) {
		this.#boardState[state.index] = state.state
	}
}
