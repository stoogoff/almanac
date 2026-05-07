
import { notNull } from 'q/utils/assert.js'
import { local } from 'q/utils/storage.js'
import { STORAGE_KEY } from 'mambo/types.js'

export const hasPlayedToday = () => {
	if(!local.has(STORAGE_KEY)) {
		return false
	}

	const stats = local.get(STORAGE_KEY)
	const [now, ] = new Date().toISOString().split('T')
	const today = stats.find(row => row.date === now)

	return notNull(today)
}

export const save = time => {
	if(!local.has(STORAGE_KEY)) {	
		local.set(STORAGE_KEY, [])
	}

	const current = local.get(STORAGE_KEY)
	const [now, ] = new Date().toISOString().split('T')
	const today = current.find(row => row.date === now)

	// there's an existing time for today so return it
	if(notNull(today)) {
		return today.time
	}

	current.push({ date: now, time })

	local.set(STORAGE_KEY, current)

	return time
}