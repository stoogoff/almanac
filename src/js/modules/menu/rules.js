
import MAMBO from 'mambo/info.js'
import QUEENS from 'queens/info.js'
import SODUKU from 'soduku/info.js'
import SWORDLE from 'swordle/info.js'
import { onOpenRules } from 'menu/comms.js'

export default {
	data: {
		games: [
			{
				"title": "Knack",
				"rules": "Play each game once per day. No ads, no cookies, no fee (but you can donate if you want), no information leaves your browser.",
			},
			MAMBO, QUEENS, SWORDLE, SODUKU,
		],
	},

	created() {
		onOpenRules(() => this.node.classList.remove('hidden'))
	},

	close() {
		this.node.classList.add('hidden')
	},
}
