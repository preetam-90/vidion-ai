#!/usr/bin/env node

// This script will check if the user is using pnpm and will exit with an error if not
const userAgent = process.env.npm_config_user_agent;

if (!userAgent || !userAgent.includes('pnpm')) {
  console.error('\x1b[31m%s\x1b[0m', '  ×   This project uses pnpm as its package manager.');
  console.error('\x1b[31m%s\x1b[0m', '  ×   Please use pnpm to run scripts and install dependencies.');
  console.error('\x1b[31m%s\x1b[0m', '  ×   Example: pnpm run dev, pnpm add package-name');
  console.error('\x1b[36m%s\x1b[0m', '  →   Run "source ~/.bashrc" to ensure pnpm is in your PATH');
  process.exit(1);
} 