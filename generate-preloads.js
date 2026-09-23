import { relative, fromFileUrl } from '@std/path'

const entry = Deno.args[0]

if(!entry) {
	console.error('Usage: deno run --allow-read --allow-run generate-preloads.js <entry>')
	Deno.exit(1)
}

const jsFiles = new Set()

function walk(modules, level = 0) {
	for(const mod of modules) {
		const specifier = mod.code?.specifier ?? mod.specifier

		if(specifier.startsWith('file://') || specifier.startsWith('https://')) {
			jsFiles.add(specifier)
		}

		if(mod.dependencies) {
			walk(mod.dependencies, level + 1)
		}
	}
}

const htmlDir = new URL('./src/', `file://${Deno.cwd()}/`)

const cmd = new Deno.Command('deno', {
	args: ['info', '--json', '--import-map=deno.json', '--allow-import', entry]
})
const { stdout } = await cmd.output()
const info = JSON.parse(new TextDecoder().decode(stdout))

walk(info.modules)

for(const mod of Array.from(jsFiles).sort()) {
	let href

	if(mod.startsWith('file://')) {
		const abs = fromFileUrl(mod)
		const htmlAbs = fromFileUrl(htmlDir.href)

		href = './' + relative(htmlAbs, abs)
	}
	else {
		href = mod
	}

	console.log(`<link rel="modulepreload" href="${href}" />`)
}
