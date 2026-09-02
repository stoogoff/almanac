
import { directives } from 'q/reactive/directives.js'
import { runMigrations } from 'migrations/index.js'
import Menu from 'menu/component.js'
import Rules from 'menu/rules.js'

runMigrations()

directives.registerComponent('menu', Menu)
directives.registerComponent('rules', Rules)
directives.load(document.body)
