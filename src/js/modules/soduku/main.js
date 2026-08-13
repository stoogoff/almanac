
import { directives } from 'q/reactive/directives.js'
import Timer from 'components/timer.js'
import Soduku from 'soduku/component.js'
import Success from 'soduku/success.js'
import { STORAGE_KEY } from 'soduku/types.js'

directives.registerComponent('timer', Timer)
directives.registerComponent('soduku', Soduku)
directives.registerComponent('success', Success)
directives.load(document.body, {
	data: {
		key: STORAGE_KEY,
	}
})
