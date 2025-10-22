// src/tests/universalExcludes.test.ts
import { describe, expect, it } from "vitest"

import { universalExcludedExtensions, universalExcludedNames } from "../universalExcludes"

describe("universalExcludes", () => {
  describe("universalExcludedNames", () => {
    it("should include common configuration and metadata files", () => {
      const expectedExcludes = [
        ".gitignore",
        ".gitmodules",
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        ".git",
        "repo2pdf.ignore",
        "node_modules",
      ]

      expectedExcludes.forEach((name) => {
        expect(universalExcludedNames).toContain(name)
      })
    })

    it("should include common IDE folders", () => {
      const ideExcludes = [".vscode", ".idea", ".vs"]

      ideExcludes.forEach((name) => {
        expect(universalExcludedNames).toContain(name)
      })
    })
  })

  describe("universalExcludedExtensions", () => {
    it("should exclude common image formats", () => {
      const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".bmp", ".webp", ".ico"]

      imageExtensions.forEach((ext) => {
        expect(universalExcludedExtensions).toContain(ext)
      })
    })

    it("should exclude common media formats", () => {
      const mediaExtensions = [".mp4", ".mp3", ".mov", ".avi", ".wmv"]

      mediaExtensions.forEach((ext) => {
        expect(universalExcludedExtensions).toContain(ext)
      })
    })

    it("should exclude PDF files", () => {
      expect(universalExcludedExtensions).toContain(".pdf")
    })
  })
})
