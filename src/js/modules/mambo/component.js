
import { state } from '../../components/state.js'
import { Mambo } from './mambo.js'

export default {
	data: {
		mambo: null,
	},

	mounted() {
		// TODO fetch the tileset from the server

		const board = this.node.getElementsByClassName('board')

		this.data.mambo = new Mambo(4, () => {
			state.emit('gameover')
		})
		this.data.mambo.create(board[0])
		state.emit('start')
	},

	undo() {

	},

	reset() {
		state.emit('start')
		this.data.mambo.reset()
	},
}
