#!/usr/bin/env node
// File: src/index.ts
import { parseCliArgs } from "./cliParser"
import { configQuestions } from "./configHandler"
import { main } from "./clone"

async function start() {
  try {
    const args = parseCliArgs(process.argv)

    // Force non-interactive mode if certain parameters are specified
    const forceNonInteractive =
      process.argv.includes("--non-interactive") ||
      ((process.argv.includes("-l") || process.argv.includes("--local")) && process.argv.includes("--output"))

    if (args && (args.nonInteractive || forceNonInteractive)) {
      // Always run in non-interactive mode if requested
      await main(
        (args.localRepo ? args.localRepoPath : args.repoUrl) as string,
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
        false, // useSpinner
        args.filePath, // Pass the file path parameter
      )
      process.exit(0)
    } else if (args) {
      await main(
        (args.localRepo ? args.localRepoPath : args.repoUrl) as string,
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
        false,
        args.filePath, // Pass the file path parameter
      )
      process.exit(0)
    } else {
      const chalk = (await import("chalk")).default
      const inquirer = (await import("inquirer")).default
      await configQuestions(main, chalk, inquirer)
    }
  } catch (error) {
    console.error("An error occurred:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

start().then()
