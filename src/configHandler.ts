// File: src/configHandler.ts
//@ts-expect-error - Chalk is a dynamic ESM import
import type chalkType from "chalk"
import fs from "fs"
//@ts-expect-error - Inquirer is a dynamic ESM import
import type inquirerType from "inquirer"

type QuestionType = {
  type?: string
  name: string
  message: string
  validate?: (value: string) => boolean | string
  filter?: (value: string) => boolean | string | string[]
  choices?: string[]
  default?: string | string[]
  when?: (answers: Record<string, unknown>) => boolean
}

export async function configQuestions(
  main: (
    repoPath: string,
    useLocalRepo: boolean,
    addLineNumbers: boolean,
    addHighlighting: boolean,
    addPageNumbers: boolean,
    removeComments: boolean,
    removeEmptyLines: boolean,
    onePdfPerFile: boolean,
    outputFileName: string,
    outputFolderName: string,
    keepRepo: boolean,
    tabWidth?: number,
    lineSpacing?: number,
    codeFont?: string,
    useSpinner?: boolean,
    specificFilePath?: string,
    nonInteractive?: boolean,
  ) => Promise<void>,
  chalk: typeof chalkType,
  inquirer: typeof inquirerType,
) {
  const questions: QuestionType[] = [
    {
      type: "list",
      name: "localRepo",
      message: "Do you want to use a local repository?",
      choices: ["No", "Yes"],
      filter: function (val: string) {
        return val.toLowerCase() === "yes"
      },
    },
    {
      name: "localRepoPath",
      message: "Please provide the full path to the local repository:",
      when(answers: { localRepo: boolean }) {
        return answers.localRepo
      },
      validate: function (value: string) {
        if (fs.existsSync(value)) {
          return true
        } else {
          return "Please enter a valid directory path."
        }
      },
    },
    {
      name: "repoUrl",
      message: "Please provide a GitHub repository URL:",
      when(answers: { localRepo: boolean }) {
        return !answers.localRepo
      },
      validate: function (value: string) {
        const pass = value.match(/^https:\/\/github.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/)
        if (pass) {
          return true
        }
        return "Please enter a valid GitHub repository URL."
      },
    },
    {
      type: "list",
      name: "useSpecificPath",
      message: "Process the entire repository or a specific file/directory?",
      choices: ["Entire repository", "Specific path"],
      filter: function (val: string) {
        return val === "Specific path"
      },
    },
    {
      name: "filePath",
      message: "Enter the specific file or directory path within the repository:",
      when(answers: { useSpecificPath: boolean }) {
        return answers.useSpecificPath
      },
    },
    {
      type: "checkbox",
      name: "features",
      message: "Select the features you want to include:",
      choices: [
        "Add line numbers",
        "Add highlighting",
        "Add page numbers",
        "Remove comments",
        "Remove empty lines",
        "One PDF per file",
      ],
    },
    {
      name: "outputFileName",
      message: "Please provide an output file name:",
      default: "output.pdf",
      when(answers: { features: string[] }) {
        return !answers.features.includes("One PDF per file")
      },
    },
    {
      name: "outputFolderName",
      message: "Please provide an output folder name:",
      default: "./output",
      when(answers: { features: string[] }) {
        return answers.features.includes("One PDF per file")
      },
    },
    {
      type: "list",
      name: "keepRepo",
      message: "Do you want to keep the cloned repository?",
      choices: ["No", "Yes"],
      when(answers: { localRepo: boolean }) {
        return !answers.localRepo
      },
      filter: function (val: string) {
        return val.toLowerCase() === "yes"
      },
    },
  ]

  console.log(
    chalk.cyanBright(`
 ██████╗ ██╗████████╗    ██████╗     ██████╗ ██████╗ ███████╗
██╔════╝ ██║╚══██╔══╝    ╚════██╗    ██╔══██╗██╔══██╗██╔════╝
██║  ███╗██║   ██║        █████╔╝    ██████╔╝██║  ██║█████╗  
██║   ██║██║   ██║       ██╔═══╝     ██╔═══╝ ██║  ██║██╔══╝  
╚██████╔╝██║   ██║       ███████╗    ██║     ██████╔╝██║     
 ╚═════╝ ╚═╝   ╚═╝       ╚══════╝    ╚═╝     ╚═════╝ ╚═╝
 
  Welcome to git2pdf!...
  `),
  )

  const answers = await inquirer.prompt(questions)
  console.log(chalk.cyanBright("\nProcessing your request...\n"))

  const { localRepo, localRepoPath, repoUrl, features, outputFileName, outputFolderName, keepRepo, filePath } = answers

  main(
    localRepo ? localRepoPath : repoUrl,
    localRepo,
    features.includes("Add line numbers"),
    features.includes("Add highlighting"),
    features.includes("Add page numbers"),
    features.includes("Remove comments"),
    features.includes("Remove empty lines"),
    features.includes("One PDF per file"),
    outputFileName,
    outputFolderName,
    keepRepo,
    2, // tabWidth - default
    4, // lineSpacing - default
    "Courier", // codeFont - default
    true, // useSpinner
    filePath, // Pass the specific file path
  )
}
