// File: src/cliParser.ts
import { Command } from "commander"
import fs from "fs"
import path from "path"
import type { Arguments } from "./types"

export function createCliParser(): Command {
  const program = new Command()
  // Read version from package.json
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"))

  program
    .name("git2pdf")
    .description("Convert GitHub repositories to PDF with syntax highlighting")
    .version(packageJson.version)
    .argument("[repository]", "GitHub repository URL or local path")
    .option("-l, --local", "Use a local repository")
    .option("-o, --output <file>", "Output file name", "output.pdf")
    .option("-d, --dir <directory>", "Output directory for individual PDFs", "./output")
    .option("--line-numbers", "Add line numbers")
    .option("--highlighting", "Add syntax highlighting")
    .option("--page-numbers", "Add page numbers")
    .option("--remove-comments", "Remove comments from code")
    .option("--remove-empty", "Remove empty lines")
    .option("--split", "Generate one PDF per file")
    .option("--keep-repo", "Keep cloned repository after processing")
    .option("-f, --file <path>", "Specific file or directory path within the repository to process")
    .addHelpText(
      "after",
      `
Examples:
# Process remote repository
$ git2pdf https://github.com/user/repo --line-numbers --highlighting

# Process local repository
$ git2pdf -l ./my-local-repo --output my-docs.pdf

# Generate separate PDFs for each file
$ git2pdf https://github.com/user/repo --split --dir ./output

# Process only a specific file or directory within a repository
$ git2pdf https://github.com/user/repo --file src/components
`,
    )

  return program
}

export function parseCliArgs(argv: string[]): Arguments | null {
  const program = createCliParser()
  program.parse(argv)

  const options = program.opts()
  const repoPath = program.args[0]

  // If no repository path provided and not using local mode, return null to trigger wizard
  if (!repoPath && !options.local) {
    return null
  }

  // Validate inputs
  if (options.local && !fs.existsSync(repoPath)) {
    console.error("Error: Local repository path does not exist")
    process.exit(1)
  }

  if (!options.local && repoPath) {
    const githubUrlPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/
    if (!githubUrlPattern.test(repoPath)) {
      console.error("Error: Invalid GitHub repository URL")
      process.exit(1)
    }
  }

  if (options.split && !options.dir) {
    console.error("Error: --dir is required when using --split")
    process.exit(1)
  }

  const params = {
    localRepo: options.local || false,
    localRepoPath: options.local ? repoPath : undefined,
    repoUrl: !options.local ? repoPath : undefined,
    features: {
      lineNumbers: options.lineNumbers || false,
      highlighting: options.highlighting || false,
      pageNumbers: options.pageNumbers || false,
      removeComments: options.removeComments || false,
      removeEmptyLines: options.removeEmpty || false,
      onePdfPerFile: options.split || false,
    },
    outputFileName: options.output,
    outputFolderName: options.dir,
    keepRepo: options.keepRepo || false,
    filePath: options.file, // Add the new parameter
  }

  console.info("Running with:", params)
  return params
}
