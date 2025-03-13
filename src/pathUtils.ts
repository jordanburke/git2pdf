import { resolve } from "path"
import type { Arguments } from "./types"
import { createCliParser } from "./cliParser"
import fs from "fs"

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
