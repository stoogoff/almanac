
import MAMBO from 'mambo/info.js'
import QUEENS from 'queens/info.js'
import SODUKU from 'soduku/info.js'
import SWORDLE from 'swordle/info.js'
import { onOpenRules } from 'menu/comms.js'

export default {
	data: {
		games: [MAMBO, QUEENS, SWORDLE, SODUKU],
	},

	created() {
		onOpenRules(() => this.node.classList.remove('hidden'))
	},

	close() {
		this.node.classList.add('hidden')
	},
}
