
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export const mulberry32 = seed =>
	() => {
		let t = seed += 0x6D2B79F5
		t = Math.imul(t ^ t >>> 15, t | 1)
		t ^= t + Math.imul(t ^ t >>> 7, t | 61)
		return ((t ^ t >>> 14) >>> 0) / 4294967296
	}

export const seed = () => {
	const now = new Date()
	
	return now.getFullYear() + (now.getMonth() * 100) + now.getDate()
}

export const rand = mulberry32(seed())
