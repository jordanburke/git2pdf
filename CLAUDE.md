# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**git2pdf** is a TypeScript CLI tool that converts GitHub repositories or local directories into formatted PDF documents. It's a fork of `repo2pdf` with enhanced functionality, supporting syntax highlighting, multiple output modes, and interactive configuration.

## Development Commands

### Build & Development
- **`pnpm run build`**: Compile TypeScript to `/dist/`
- **`pnpm run watch`**: Watch mode compilation for development
- **`pnpm run start`**: Run the compiled application
- **`pnpm run format`**: Format code with Prettier
- **`pnpm run format:check`**: Check formatting without making changes

### Testing
- **`pnpm run test`**: Run the full test suite with Vitest
- **`pnpm run test:watch`**: Run tests in watch mode during development
- **`pnpm run test:coverage`**: Generate coverage reports (text/JSON/HTML)

### Release Management
- **`pnpm run version`**: Update versions using changesets
- **`pnpm run release`**: Build and publish to NPM

## Code Architecture

### Core Processing Flow
1. **CLI Parsing** (`cliParser.ts`): Validates arguments and determines execution mode
2. **Configuration** (`configHandler.ts`): Interactive wizard mode for complex setups
3. **Repository Processing** (`clone.ts`): Main PDF generation logic with file processing
4. **Syntax Highlighting** (`syntax.ts`): Converts code to highlighted HTML then JSON
5. **PDF Generation**: Uses PDFKit to create formatted output documents

### Key Modules
- **`index.ts`**: Application entry point with startup logic
- **`clone.ts`**: Core PDF generation engine and file processing pipeline
- **`cliParser.ts`**: Command-line argument parsing with Commander.js
- **`configHandler.ts`**: Interactive configuration via Inquirer.js prompts
- **`loadIgnoreConfig.ts`**: Handles `repo2pdf.ignore` configuration files
- **`syntax.ts`**: Syntax highlighting pipeline using highlight.js
- **`universalExcludes.ts`**: Default exclusion patterns for common artifacts

### CLI Interaction Modes
1. **Non-interactive**: Direct command execution with all parameters provided
2. **Interactive**: Command with parameters but provides spinner feedback
3. **Wizard Mode**: Full interactive configuration using inquirer prompts

### Configuration System
- **Ignore Files**: `repo2pdf.ignore` (JSON format) for custom exclusions
- **Universal Exclusions**: Built-in patterns for node_modules, .git, binaries, etc.
- **Output Modes**: Single PDF or split mode (one PDF per file)

## Tech Stack Details

### Core Dependencies
- **CLI Framework**: Commander.js for argument parsing
- **PDF Generation**: PDFKit for document creation
- **Git Operations**: simple-git for repository cloning
- **Syntax Highlighting**: highlight.js (50+ languages)
- **Code Formatting**: Prettier with multiple language parsers
- **Interactive CLI**: Inquirer.js for wizard mode, Chalk for colors, Ora for spinners

### Testing Infrastructure
- **Framework**: Vitest with globals enabled
- **Coverage**: V8 provider with comprehensive reporting
- **Mocking Strategy**: Extensive mocking of fs, path, console, and process modules
- **Test Location**: `src/tests/` with `.test.ts` suffix

## Development Notes

### Build Configuration
- **Target**: ES2020 with CommonJS modules
- **Node Version**: >= 18.0.0 required
- **Package Manager**: PNPM (lockfile present)
- **Binary**: `dist/index.js` with `#!/usr/bin/env node` shebang

### Error Handling Patterns
- Comprehensive try-catch blocks throughout async operations
- Graceful fallbacks (e.g., plain text when Prettier formatting fails)
- Process exit codes for CLI error states
- Spinner state management for user feedback during long operations

### Code Quality Standards
- Strict TypeScript configuration enabled
- Prettier formatting with consistent style rules
- Comprehensive unit testing with mocking strategies
- Type definitions in dedicated `types.ts` module