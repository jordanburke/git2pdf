#!/usr/bin/env node
import { parseCliArgs } from "./cliParser"
import { configQuestions } from "./configHandler"
import { main } from "./clone"

async function start() {
  try {
    const args = parseCliArgs(process.argv)

    if (args) {
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
