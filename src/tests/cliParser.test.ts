import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createCliParser, parseCliArgs } from "../cliParser"
import fs from "fs"
import path from "path"

// Set test environment
process.env.NODE_ENV = "test"

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
    resolve: vi.fn(),
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
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("createCliParser", () => {
    it("should create a program with the correct name and description", () => {
      fs.readFileSync = vi.fn().mockReturnValue(
        JSON.stringify({
          version: "2.3.1",
        }),
      )
      path.join = vi.fn().mockReturnValue("path/to/package.json")

      const program = createCliParser()
      expect(program.name()).toBe("git2pdf")
      expect(program.description()).toContain("Convert GitHub repositories to PDF")
    })
  })

  describe("parseCliArgs", () => {
    beforeEach(() => {
      fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify({ version: "2.3.1" }))
      path.join = vi.fn().mockReturnValue("path/to/package.json")
    })

    it("should return null when no repository is provided and not in local mode", () => {
      const args = parseCliArgs(["node", "git2pdf"])
      expect(args).toBeNull()
    })

    it("should validate local repository path exists", () => {
      fs.existsSync = vi.fn().mockReturnValue(false)

      expect(() => {
        parseCliArgs(["node", "git2pdf", "/fake/path", "--local"])
      }).toThrow("Local repository path does not exist")

      expect(consoleErrorMock).toHaveBeenCalledWith("Error: Local repository path does not exist")
    })

    it("should validate GitHub URLs", () => {
      expect(() => {
        parseCliArgs(["node", "git2pdf", "invalid-url"])
      }).toThrow("Invalid GitHub repository URL")

      expect(consoleErrorMock).toHaveBeenCalledWith("Error: Invalid GitHub repository URL")
    })

    it("should require dir when using split", () => {
      expect(() => {
        parseCliArgs(["node", "git2pdf", "https://github.com/user/repo", "--split", "--dir", ""])
      }).toThrow("--dir is required when using --split")

      expect(consoleErrorMock).toHaveBeenCalledWith("Error: --dir is required when using --split")
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
        formatting: {
          tabWidth: 2,
          lineSpacing: 4,
          codeFont: "Courier",
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
        formatting: {
          tabWidth: 2,
          lineSpacing: 4,
          codeFont: "Courier",
        },
        outputFileName: "output.pdf",
        outputFolderName: "./output",
        keepRepo: false,
        filePath: "src/components",
        nonInteractive: false,
      })
    })

    it("should parse custom formatting options", () => {
      const repoUrl = "https://github.com/user/repo"
      fs.existsSync = vi.fn().mockReturnValue(true)

      const result = parseCliArgs([
        "node",
        "git2pdf",
        repoUrl,
        "--tab-width",
        "4",
        "--line-spacing",
        "6",
        "--code-font",
        "Courier-Bold",
      ])

      expect(result?.formatting).toEqual({
        tabWidth: 4,
        lineSpacing: 6,
        codeFont: "Courier-Bold",
      })
    })

    it("should validate tab-width is within range", () => {
      const repoUrl = "https://github.com/user/repo"
      fs.existsSync = vi.fn().mockReturnValue(true)

      expect(() => {
        parseCliArgs(["node", "git2pdf", repoUrl, "--tab-width", "0"])
      }).toThrow("--tab-width must be a number between 1 and 8")

      expect(() => {
        parseCliArgs(["node", "git2pdf", repoUrl, "--tab-width", "9"])
      }).toThrow("--tab-width must be a number between 1 and 8")
    })

    it("should validate line-spacing is within range", () => {
      const repoUrl = "https://github.com/user/repo"
      fs.existsSync = vi.fn().mockReturnValue(true)

      expect(() => {
        parseCliArgs(["node", "git2pdf", repoUrl, "--line-spacing", "1"])
      }).toThrow("--line-spacing must be a number between 2 and 10")

      expect(() => {
        parseCliArgs(["node", "git2pdf", repoUrl, "--line-spacing", "11"])
      }).toThrow("--line-spacing must be a number between 2 and 10")
    })
  })
})
