import { join } from '@std/path'

export const listFiles = async (source) => {
  // recurse target and get all file paths
  // once everything else has been copied
  const allFiles = []

  const recurse = async (root) => {
    for await (const file of Deno.readDir(root)) {
      if(file.isFile) {
        allFiles.push(join(root, file.name).replace(source, ''))
      }
      else if(file.isDirectory) {
        await recurse(join(root, file.name))
      }
    }
  }

  await recurse(source)

  return allFiles
}

// remove directory and swallow errors
export const clean = async dir => {
  try {
    await Deno.remove(dir, { recursive: true })
  }
  catch(error) {
    console.error(error)
  }
}

export const isDir = path => {
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
export const create = async dir => await Deno.mkdir(dir, { recursive: true })
