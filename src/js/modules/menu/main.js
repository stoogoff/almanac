
import { directives } from 'q/reactive/directives.js'
import { runMigrations } from 'migrations/index.js'
import Menu from 'menu/component.js'

runMigrations()

directives.registerComponent('menu', Menu)
directives.load(document.body)
