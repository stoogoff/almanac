
import { local } from 'q/utils/storage.js'
import { convertTime } from './01-convert-time-to-score.js'

const MIGRATION_KEY = 'migrations'

export const runMigrations = () => {
	if(!local.has(MIGRATION_KEY)) {
		local.set(MIGRATION_KEY, [])
	}

	const previouslyRun = local.get(MIGRATION_KEY)

	// in the future all of the migrations will need to go into
	// an array and looped over rather than repeating this block
	if(!previouslyRun.includes(convertTime.key)) {
		convertTime.run()

		previouslyRun.push(convertTime.key)
	}

	local.set(MIGRATION_KEY, previouslyRun)
}
