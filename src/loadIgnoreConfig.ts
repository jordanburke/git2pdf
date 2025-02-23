import * as fs from "fs"
import * as path from "path"

export interface IgnoreConfig {
  ignoredFiles: string[]
  ignoredExtensions: string[]
}

export default async function loadIgnoreConfig(rootDir: string): Promise<IgnoreConfig | null> {
  const ignoreConfigPath = path.join(rootDir, "repo2pdf.ignore")

  try {
    const data = await fs.promises.readFile(ignoreConfigPath, "utf8")
    return JSON.parse(data) as IgnoreConfig
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null
    }
    throw err
  }
}
