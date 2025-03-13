// File: src/types.ts
export interface Features {
  lineNumbers: boolean
  highlighting: boolean
  pageNumbers: boolean
  removeComments: boolean
  removeEmptyLines: boolean
  onePdfPerFile: boolean
}

export interface Arguments {
  localRepo: boolean
  localRepoPath?: string
  repoUrl?: string
  features: Features
  outputFileName: string
  outputFolderName: string
  keepRepo: boolean
  filePath?: string // Optional parameter for specific file path
  nonInteractive: boolean // New property for non-interactive mode
}
