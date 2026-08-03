// filter-six-letter.js
const [inputPath, outputPath] = Deno.args

if (!inputPath || !outputPath) {
	console.error('Usage: deno run --allow-read --allow-write filter-six-letter.js <input> <output>')
	Deno.exit(1)
}

const text = await Deno.readTextFile(inputPath)
const lines = text.split('\n')

const words = []

for (const line of lines) {
	if (line.startsWith('#')) continue
	if (line.trim() === '') continue
	
	const parts = line.trim().split(/\s+/)
	const word = parts[1]?.toLowerCase()
	
	if (!word) continue
	if (word.length !== 6) continue
	if (word.endsWith('s') && !word.endsWith('ss')) continue
	
	words.push(word)
}

await Deno.writeTextFile(outputPath, JSON.stringify(words.slice(0, 4000)))

console.log(`Kept ${words.length} words`)
