import { configQuestions } from "./configHandler"
import { main } from "./clone"
import { normalizeLocalPath } from "./pathUtils"
import { parseCliArgs } from "./cliParser"

async function start(): Promise<void> {
  try {
    const args = parseCliArgs(process.argv)

    // Handle non-interactive CLI mode
    if (args && (args.nonInteractive || process.argv.includes("--non-interactive"))) {
      const repoPath = args.localRepo ? normalizeLocalPath(args.localRepoPath || ".") : args.repoUrl
      if (!repoPath) {
        throw new Error("Repository path is required")
      }
      await main(
        repoPath,
        args.localRepo,
        args.features.lineNumbers,
        args.features.highlighting,
        args.features.pageNumbers,
        args.features.removeComments,
        args.features.removeEmptyLines,
        args.features.onePdfPerFile,
        args.outputFileName,
        args.outputFolderName,
        args.keepRepo,
        false, // useSpinner in non-interactive mode
        args.filePath,
        true, // nonInteractive
      )
      return
    }

    // Handle interactive CLI mode
    else if (args) {
      const repoPath = args.localRepo ? normalizeLocalPath(args.localRepoPath || ".") : args.repoUrl
      if (!repoPath) {
        throw new Error("Repository path is required")
      }
      await main(
        repoPath,
        args.localRepo,
        args.features.lineNumbers,
        args.features.highlighting,
        args.features.pageNumbers,
        args.features.removeComments,
        args.features.removeEmptyLines,
        args.features.onePdfPerFile,
        args.outputFileName,
        args.outputFolderName,
        args.keepRepo,
        true, // useSpinner in interactive mode
        args.filePath,
        false, // nonInteractive
      )
      process.exit(0)
    }

    // Handle wizard mode
    else {
      const chalk = (await import("chalk")).default
      const inquirer = (await import("inquirer")).default
      await configQuestions(main, chalk, inquirer)
      process.exit(0)
    }
  } catch (error) {
    console.error("An error occurred:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Start the application and handle any uncaught errors
start().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
