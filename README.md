# git2pdf
A powerful CLI tool for generating PDF documents from GitHub repositories
with enhanced functionality.

## Overview
git2pdf is a versatile command-line tool designed to transform GitHub
repositories into well-formatted, visually engaging PDF files. This tool
automates the process of cloning repositories and parsing code files, serving
various use cases including:
- Code reviews and documentation
- Offline reference materials
- Teaching materials
- Technical documentation
- Code archiving
- Integration with AI systems

## Installation and Usage
git2pdf can be installed using NPM:
```shell
npm install -g git2pdf
```

Or used directly with NPX:
```shell
npx git2pdf
```

### Usage
```shell
git2pdf [repository] [options]
```

#### Options
- `-l, --local`: Use a local repository
- `-o, --output <file>`: Output file name (default: output.pdf)
- `-d, --dir <directory>`: Output directory for individual PDFs (default: ./output)
- `-f, --file <path>`: Specific file or directory path within the repository to process
- `--line-numbers`: Add line numbers to code in PDF
- `--highlighting`: Add syntax highlighting in PDF
- `--page-numbers`: Add page numbers to PDF
- `--remove-comments`: Remove comments from code
- `--remove-empty`: Remove empty lines
- `--split`: Generate one PDF per file
- `--keep-repo`: Keep cloned repository after processing
- `-h, --help`: Display help information
- `-V, --version`: Display version number

### Examples
Generate a PDF from a GitHub repository:
```shell
git2pdf https://github.com/user/repo
```

Generate a PDF with line numbers and syntax highlighting:
```shell
git2pdf https://github.com/user/repo --line-numbers --highlighting
```

Use a local repository:
```shell
git2pdf -l ./my-local-repo --output my-docs.pdf
```

Create separate PDFs for each file:
```shell
git2pdf https://github.com/user/repo --split --dir ./output
```

Process only a specific file or directory:
```shell
git2pdf https://github.com/user/repo --file src/components
```

## Configuration
git2pdf automatically ignores certain file types and directories (e.g.,
`.png`, `.git`).

To customize the files and directories to ignore, you can add a
`git2pdf.ignore` file to the root of your repository:
```json
{
"ignoredFiles": ["tsconfig.json", "dist", "node_modules"],
"ignoredExtensions": [".raw"]
}
```

## Requirements
- Node.js >= 18.0.0
- Git (for non-local repositories)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

This project is a fork of the original [repo2pdf](https://github.com/
BankkRoll/repo2pdf) by BankkRoll, with enhanced CLI functionality and
improvements.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.