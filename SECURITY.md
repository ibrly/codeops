# Security Policy

## Reporting a vulnerability

Please **don't open a public issue** for security problems.

Report them privately through GitHub instead: go to the repository's **Security** tab and choose **Report a vulnerability**. You should get a first response within 7 days.

## What counts

CodeOps is mostly Markdown, prompts, and small Node.js scripts, but these are still security issues:

- Prompts or commands that could make an AI assistant run destructive or unexpected commands on a learner's machine
- Anything that could leak a learner's local progress, notes, or code
- Scripts that execute untrusted input
- Committed secrets or credentials

## Supported versions

CodeOps hasn't had a release yet. Fixes go to the `main` branch.
