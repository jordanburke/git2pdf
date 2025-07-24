import { Command } from "commander"
import fs from "fs"
import path from "path"
import type { Arguments } from "./types"

// For testing purposes
const isTest = process.env.NODE_ENV === "test"

export function createCliParser(): Command {
  const program = new Command()
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"))

  program
    .name("git2pdf")
    .description("Convert GitHub repositories to PDF with syntax highlighting")
    .version(packageJson.version)
    .argument("[repository]", "GitHub repository URL or local path")
    .option("-l, --local", "Use a local repository")
    .option("-o, --output <file>", "Output file name", "output.pdf")
    .option("-d, --dir <directory>", "Output directory for individual PDFs", "./output")
    .option("-f, --file <path>", "Specific file or directory path within the repository to process")
    .option("--line-numbers", "Add line numbers")
    .option("--highlighting", "Add syntax highlighting")
    .option("--page-numbers", "Add page numbers")
    .option("--remove-comments", "Remove comments from code")
    .option("--remove-empty", "Remove empty lines")
    .option("--split", "Generate one PDF per file")
    .option("--keep-repo", "Keep cloned repository after processing")
    .option("--non-interactive", "Run in non-interactive mode", false)
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
$ git2pdf https://github.com/user/repo -f src/components
# Run in non-interactive mode
$ git2pdf -l . --non-interactive
`,
    )
  return program
}

function resolvePath(p: string): string {
  if (isTest) {
    return p
  }
  return path.resolve(process.cwd(), p)
}

export function parseCliArgs(argv: string[]): Arguments | null {
  const program = createCliParser()
  program.parse(argv)
  const options = program.opts()
  const repoPath = program.args[0]
  const nonInteractive = options.nonInteractive || false

  if (!repoPath && !options.local && !nonInteractive) {
    return null
  }

  let finalRepoPath = repoPath
  if (options.local && !repoPath) {
    finalRepoPath = "."
  }

  if (options.local) {
    finalRepoPath = resolvePath(finalRepoPath)
    if (!fs.existsSync(finalRepoPath)) {
      console.error("Error: Local repository path does not exist")
      if (isTest) {
        throw new Error("Local repository path does not exist")
      }
      process.exit(1)
    }
  } else if (finalRepoPath) {
    const githubUrlPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/
    if (!githubUrlPattern.test(finalRepoPath)) {
      console.error("Error: Invalid GitHub repository URL")
      if (isTest) {
        throw new Error("Invalid GitHub repository URL")
      }
      process.exit(1)
    }
  }

  if (options.split && !options.dir) {
    console.error("Error: --dir is required when using --split")
    if (isTest) {
      throw new Error("--dir is required when using --split")
    }
    process.exit(1)
  }

  const outputFileName = options.output ? resolvePath(options.output) : resolvePath("output.pdf")
  const outputFolderName = options.dir ? resolvePath(options.dir) : resolvePath("./output")

  const params: Arguments = {
    localRepo: options.local || false,
    localRepoPath: options.local ? finalRepoPath : undefined,
    repoUrl: !options.local ? finalRepoPath : undefined,
    features: {
      lineNumbers: options.lineNumbers || false,
      highlighting: options.highlighting || false,
      pageNumbers: options.pageNumbers || false,
      removeComments: options.removeComments || false,
      removeEmptyLines: options.removeEmpty || false,
      onePdfPerFile: options.split || false,
    },
    outputFileName: isTest ? options.output || "output.pdf" : outputFileName,
    outputFolderName: isTest ? options.dir || "./output" : outputFolderName,
    keepRepo: options.keepRepo || false,
    filePath: options.file,
    nonInteractive,
  }

  console.info("Running with:", params)
  return params
}
