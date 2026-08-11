
import { getLogger, setLogger, ConsoleLogger, LOG_LEVEL_ERROR } from 'q/utils/logger.js'

const LOG_KEY = 'knack'

setLogger(LOG_KEY, ConsoleLogger, LOG_LEVEL_ERROR)

export const logger = () => getLogger(LOG_KEY)
