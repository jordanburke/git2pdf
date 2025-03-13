// src/types/ci.ts

export interface CoverageMetrics {
  statements: number
  branches: number
  functions: number
  lines: number
}

export interface BundleMetrics {
  totalSize: number
  gzippedSize: number
  files: Array<{
    name: string
    size: number
    gzippedSize: number
  }>
}

export interface DependencyNode {
  id: string
  label: string
  type: "file" | "directory" | "external"
  dependencies: string[]
}

export interface CIArtifact {
  name: string
  path: string
  type: "documentation" | "coverage" | "dependency" | "bundle"
  format: "html" | "json" | "svg"
  metrics?: CoverageMetrics | BundleMetrics
}

export interface PRComment {
  id: string
  body: string
  artifacts: CIArtifact[]
  createdAt: string
  updatedAt: string
}

export interface CIWorkflowConfig {
  excludePaths: string[]
  coverageThresholds: CoverageMetrics
  bundleSizeThresholds: {
    maxTotalSize: number
    maxGzippedSize: number
    maxIndividualSize: number
  }
  dependencyRules: {
    bannedDependencies: string[]
    maxDepth: number
    allowCircular: boolean
  }
  artifacts: {
    retentionDays: number
    generatePRComment: boolean
    uploadToGitHub: boolean
  }
}
