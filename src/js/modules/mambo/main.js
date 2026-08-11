
import { directives } from 'q/reactive/directives.js'
import Timer from 'components/timer.js'
import Mambo from 'mambo/component.js'
import Success from 'mambo/success.js'
import { STORAGE_KEY } from 'mambo/types.js'

directives.registerComponent('timer', Timer)
directives.registerComponent('mambo', Mambo)
directives.registerComponent('success', Success)
directives.load(document.body, {
	data: {
		key: STORAGE_KEY,
	}
})
