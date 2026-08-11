
import { directives } from 'q/reactive/directives.js'
import Timer from 'components/timer.js'
import Queens from 'queens/component.js'
import Success from 'queens/success.js'
import { STORAGE_KEY } from 'queens/types.js'

directives.registerComponent('timer', Timer)
directives.registerComponent('queens', Queens)
directives.registerComponent('success', Success)
directives.load(document.body, {
	data: {
		key: STORAGE_KEY,
	}
})
