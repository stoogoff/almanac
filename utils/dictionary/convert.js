const text = await Deno.readTextFile('words.txt')
const sixLetterWords = text
	.split('\n')
	.map(w => w.trim().toLowerCase())
	.filter(w => w.length === 6 && /^[a-z]+$/.test(w))

// Then either use directly, or write out as a JS file:
await Deno.writeTextFile(
	'six-letter-words.js',
	`export const words = ${JSON.stringify(sixLetterWords)}\n`
)
