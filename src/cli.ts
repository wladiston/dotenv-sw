#!/usr/bin/env node

import {cac} from 'cac'
import {config} from '.'
import execa from 'execa'

const cli = cac()

/**
 * `dotenv` command
 */
export type DotEnvOptions = {
  '--': string[]
  cwd?: string
  silent?: boolean
}

cli
  .command('', 'Load environment variables from .env files.')
  .option('--cwd', 'The current working directory in which to search.')
  .option('--silent', 'Hide all console output')
  .action(async (options: DotEnvOptions) => {
    const args = options['--']
    if (args.length === 0) {
      return console.log('no command specified for dotenv')
    }
    const command = args.shift()!

    config(options)
    execa(command, args, {
      stdout: 'inherit',
    })
  })

// Listen to unknown commands
cli.on('command:*', () => {
  console.error('Invalid command: %s', cli.args.join(' '))
  process.exit(1)
})

// Display help message when `-h` or `--help` appears
cli.help()
cli.parse()
