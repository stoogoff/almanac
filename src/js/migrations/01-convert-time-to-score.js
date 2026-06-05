
import { local } from 'q/utils/storage.js'
import { STORAGE_KEY as MAMBO } from 'mambo/types.js'
import { STORAGE_KEY as QUEENS } from 'queens/types.js'

/*
OLD

[
	{"date":"2026-05-01","time":131},
	{"date":"2026-05-01","time":131},
	{"date":"2026-05-11","time":52},
	{"date":"2026-06-04","time":49}
]

NEW

[
	{"date":"2026-06-03","score":{"time":31}}
]
*/

export const convertTime = {
	key: 'convert-time',

	run() {
		const keys = [MAMBO, QUEENS]

		keys.forEach(key => {
			if(!local.has(key)) return

			const original = local.get(key)
			const updated = original.filter(row => 'time' in row).map(row => ({
				date: row.date,
				score: { time: row.time },
			}))

			if(updated.length > 0) {
				local.set(key, updated)
			}
		})
	}
}
