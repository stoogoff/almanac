
import { directives } from 'q/reactive/directives.js'
import Swordle from 'swordle/component.js'
import Success from 'swordle/success.js'
import Fail from 'swordle/fail.js'

directives.registerComponent('success', Success)
directives.registerComponent('fail', Fail)
directives.registerComponent('swordle', Swordle)
directives.load(document.body)
