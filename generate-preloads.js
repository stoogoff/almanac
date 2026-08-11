// generate-preloads.js
import { relative, fromFileUrl } from '@std/path'

const entry = Deno.args[0]

if (!entry) {
	console.error('Usage: deno run --allow-read --allow-run generate-preloads.js <entry>')
	Deno.exit(1)
}

// Directory the HTML lives in — file paths will be made relative to this.
// Adjust if your HTML isn't in src/
const htmlDir = new URL('./src/', `file://${Deno.cwd()}/`)

const cmd = new Deno.Command('deno', {
	args: ['info', '--json', entry]
})
const { stdout } = await cmd.output()
const info = JSON.parse(new TextDecoder().decode(stdout))

const modules = info.modules
	.map(m => m.specifier)
	.filter(s => s.startsWith('file://') || s.startsWith('http'))

for (const specifier of modules) {
	let href
	if (specifier.startsWith('file://')) {
		const abs = fromFileUrl(specifier)
		const htmlAbs = fromFileUrl(htmlDir.href)
		href = './' + relative(htmlAbs, abs)
	} else {
		href = specifier
	}
	console.log(`<link rel="modulepreload" href="${href}" />`)
}
