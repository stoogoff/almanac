
import { Emitter } from 'q/utils/emitter.js'

const emitter = new Emitter()
const OPEN_RULES = 'open'

export const openRules = () => emitter.emit(OPEN_RULES)

export const onOpenRules = func => emitter.on(OPEN_RULES, func)
