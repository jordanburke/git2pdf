import fs from "fs"
import { resolve } from "path"

import { createCliParser } from "./cliParser"
import type { Arguments } from "./types"

export function normalizeLocalPath(path: string): string {
  return resolve(process.cwd(), path)
}

export function validateLocalPath(path: string): boolean {
  try {
    const normalizedPath = normalizeLocalPath(path)
    return fs.existsSync(normalizedPath)
  } catch (error) {
    return false
  }
}
