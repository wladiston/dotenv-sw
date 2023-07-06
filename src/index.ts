import fs from 'node:fs'
import path from 'node:path'
import {parse} from 'dotenv'
import {expand} from 'dotenv-expand'

export interface ConfigOptions {
  silent?: boolean
  cwd?: string
}

/**
 * Load environment variables from .env files.
 *
 * @param {ConfigOptions} options
 */
export function config({silent, cwd = process.cwd()}: ConfigOptions = {}) {
  const envDir = path.resolve(cwd)

  const environment = process.env.NODE_ENV || 'development'
  const envFiles = [
    /** default file */ `.env`,
    /** local file */ `.env.local`,
    /** environment file */ `.env.${environment}`,
    /** environment local file */ `.env.${environment}.local`,
  ]

  const parsed = Object.fromEntries(
    envFiles.flatMap(file => {
      const filePath = path.join(envDir, file)
      if (!tryStatSync(filePath)?.isFile()) return []
      if (!silent) console.log('📄 loading env file:', filePath)
      return Object.entries(parse(fs.readFileSync(filePath)))
    }),
  )

  if (!Object.keys(parsed).length) console.log('📄 .env files not found')

  // let environment variables use each other
  // `expand` patched in patches/dotenv-expand@9.0.0.patch
  expand({parsed})

  // set environment variables
  for (const [key, value] of Object.entries(parsed)) {
    // only set if not already set
    if (!process.env[key]) {
      process.env[key] = value
    }
  }

  // set NODE_ENV to 'development' if not set
  process.env.NODE_ENV = environment
}

function tryStatSync(file: string): fs.Stats | undefined {
  try {
    return fs.statSync(file, {throwIfNoEntry: false})
  } catch {
    // Ignore errors
  }
}
