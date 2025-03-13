// src/tests/cliParser.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createCliParser, parseCliArgs } from "../cliParser"
import fs from "fs"
import path from "path"

// Mock fs and path modules
vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
    createWriteStream: vi.fn(),
    rmSync: vi.fn(),
  },
}))

vi.mock("path", () => ({
  default: {
    join: vi.fn(),
    basename: vi.fn(),
    extname: vi.fn(),
    relative: vi.fn(),
    dirname: vi.fn(),
  },
}))

// Mock console methods
const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {})
const consoleInfoMock = vi.spyOn(console, "info").mockImplementation(() => {})
const processExitMock = vi.spyOn(process, "exit").mockImplementation((code) => {
  return code as never
})

describe("CLI Parser", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("createCliParser", () => {
    it("should create a program with the correct name and description", () => {
      // Mock the fs.readFileSync to return a mock package.json
      fs.readFileSync = vi.fn().mockReturnValue(
        JSON.stringify({
          version: "2.3.1",
        }),
      )

      // Mock path.join to return a predictable path
      path.join = vi.fn().mockReturnValue("path/to/package.json")

      const program = createCliParser()
      expect(program.name()).toBe("git2pdf")
      expect(program.description()).toContain("Convert GitHub repositories to PDF")
    })
  })

  describe("parseCliArgs", () => {
    beforeEach(() => {
      // Set up common mocks for all tests
      fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify({ version: "2.3.1" }))
      path.join = vi.fn().mockReturnValue("path/to/package.json")
    })

    it("should return null when no repository is provided and not in local mode", () => {
      const args = parseCliArgs(["node", "git2pdf"])
      expect(args).toBeNull()
    })

    it("should validate local repository path exists", () => {
      fs.existsSync = vi.fn().mockReturnValue(false)

      parseCliArgs(["node", "git2pdf", "/fake/path", "--local"])

      expect(consoleErrorMock).toHaveBeenCalledWith("Error: Local repository path does not exist")
      expect(processExitMock).toHaveBeenCalledWith(1)
    })

    it("should validate GitHub URLs", () => {
      parseCliArgs(["node", "git2pdf", "invalid-url"])

      expect(consoleErrorMock).toHaveBeenCalledWith("Error: Invalid GitHub repository URL")
      expect(processExitMock).toHaveBeenCalledWith(1)
    })

    it("should require dir when using split", () => {
      parseCliArgs(["node", "git2pdf", "https://github.com/user/repo", "--split", "--dir", ""])

      expect(consoleErrorMock).toHaveBeenCalledWith("Error: --dir is required when using --split")
      expect(processExitMock).toHaveBeenCalledWith(1)
    })

    it("should return correct params for a remote repository", () => {
      const repoUrl = "https://github.com/user/repo"
      fs.existsSync = vi.fn().mockReturnValue(true)

      const result = parseCliArgs(["node", "git2pdf", repoUrl, "--highlighting", "--output", "test.pdf"])

      expect(result).toEqual({
        localRepo: false,
        localRepoPath: undefined,
        repoUrl,
        features: {
          lineNumbers: false,
          highlighting: true,
          pageNumbers: false,
          removeComments: false,
          removeEmptyLines: false,
          onePdfPerFile: false,
        },
        outputFileName: "test.pdf",
        outputFolderName: "./output",
        keepRepo: false,
        filePath: undefined,
        nonInteractive: false,
      })
      expect(consoleInfoMock).toHaveBeenCalled()
    })

    it("should return correct params for a local repository", () => {
      const localPath = "./local-repo"
      fs.existsSync = vi.fn().mockReturnValue(true)

      const result = parseCliArgs([
        "node",
        "git2pdf",
        localPath,
        "--local",
        "--line-numbers",
        "--page-numbers",
        "--file",
        "src/components",
      ])

      expect(result).toEqual({
        localRepo: true,
        localRepoPath: localPath,
        repoUrl: undefined,
        features: {
          lineNumbers: true,
          highlighting: false,
          pageNumbers: true,
          removeComments: false,
          removeEmptyLines: false,
          onePdfPerFile: false,
        },
        outputFileName: "output.pdf",
        outputFolderName: "./output",
        keepRepo: false,
        filePath: "src/components",
        nonInteractive: false,
      })
    })
  })
})
