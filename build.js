
import { join } from '@std/path'
import { load } from '@std/dotenv'

// remove directory and swallow errors
const clean = async dir => {
	try {
		await Deno.remove(dir, { recursive: true })
	}
	catch(error) {
		console.error(error)
	}
}

const isDir = path => {
	try {
		return Deno.statSync(path).isDirectory
	}
	catch(error) {
		if(error instanceof Deno.errors.NotFound) {
			return false
		}

		console.error(error)
	}
}

// recursively create directory structure
const create = async dir => await Deno.mkdir(dir, { recursive: true })

// recursively copy non-html files
const copy = async (source, target) => {
	if(!isDir(target)) {
		create(target)
	}

	for await (const file of Deno.readDir(source)) {
		if(file.isFile && !file.name.endsWith('.html')) {
			await Deno.copyFile(join(source, file.name), join(target, file.name))
		}
		else if(file.isDirectory) {
			await create(join(target, file.name))
			await copy(join(source, file.name), join(target, file.name))
		}
	}
}

// copy the HTML files and update links to media with the version
const versionHtml = async (source, target, version) => {
	for await (const file of Deno.readDir(source)) {
		if(file.isFile && file.name.endsWith('.html')) {
			const text = await Deno.readTextFile(join(source, file.name))
			const converted = text
				.replace(/href="css/g, `href="${version}/css`)
				.replace(/"\.\/js/g, `"./${version}/js`)
				.replace('$VERSION', version)

			await Deno.writeTextFile(join(target, file.name), converted)
		}
	}
}

const preparePwa = async (source, target, version) => {
	const MANIFEST = 'manifest.json'
	const SERVICE_WORKER = 'sw.js'

	// copy manifest
	await Deno.copyFile(join(source, MANIFEST), join(target, MANIFEST))

	// recurse target and get all file paths
	// once everything else has been copied
	const allFiles = []

	const recurse = async (root) => {
		for await (const file of Deno.readDir(root)) {
			if(file.isFile) {
				allFiles.push(join(root, file.name).replace(target, ''))
			}
			else if(file.isDirectory) {
				await recurse(join(root, file.name))
			}
		}
	}

	await recurse(target)

	// TODO this needs to load all 'q/*' files that the app uses

	const text = await Deno.readTextFile(join(source, SERVICE_WORKER))
	const converted = text
		// set version in the file
		.replace('$VERSION', version)
		// create array of all files
		.replace('$PATHS', JSON.stringify(allFiles))

	await Deno.writeTextFile(join(target, SERVICE_WORKER), converted)
}

// load env vars
const _env = await load({
	envPath: '.env',
	export: true,
})

const version = Deno.env.get('VERSION')

console.log(`Building version: ${version}`)

// directories we're working with
const source = join(Deno.cwd(), 'src')
const dist = join(Deno.cwd(), 'dist')
const distVersioned = join(dist, version)

// remove and recreate the dist directory
await clean(dist)
await create(distVersioned)

// copy versioned media files
await copy(join(source, 'js'), join(distVersioned, 'js'))
await copy(join(source, 'css'), join(distVersioned, 'css'))

// copy unversioned media files
await copy(join(source, 'media'), join(dist, 'media'))

// copy and update HTML
await versionHtml(source, dist, version)

// copy and update PWA related files
await preparePwa(source, dist, version)

console.log('Done')
