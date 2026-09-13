#!/usr/bin/env node

/**
 * Cache-Busting Utility for AI Hardware & Sizing Calculator
 * 
 * Automatically versions all CSS links, script entrypoints, and internal ES module imports
 * to prevent browser caching issues on Production (GitHub Pages) and local environments.
 * 
 * Usage:
 *   node scripts/cache-bust.js          # Updates all assets with new build version
 *   node scripts/cache-bust.js --clean  # Removes all ?v= query strings
 *   node scripts/cache-bust.js --version 1.4.0  # Uses explicit version
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const isClean = process.argv.includes('--clean');
const versionArgIndex = process.argv.indexOf('--version');
let customVersion = versionArgIndex !== -1 ? process.argv[versionArgIndex + 1] : null;

function getGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: ROOT_DIR, stdio: ['pipe', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function generateBuildId() {
  if (customVersion) return customVersion;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const commit = getGitCommit();
  return commit ? `v1.3.1-${commit}` : `v1.3.1-${dateStr}-${timeStr}`;
}

const buildId = isClean ? '' : generateBuildId();
const timestamp = new Date().toISOString();
const gitCommit = getGitCommit() || 'local';

console.log(`\n========================================`);
if (isClean) {
  console.log(`🧹 Running Cache-Buster: CLEAN MODE (Removing ?v=...)`);
} else {
  console.log(`🚀 Running Cache-Buster: BUILD VERSION [${buildId}]`);
}
console.log(`========================================\n`);

// 1. Process index.html
const indexPath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexHtml = fs.readFileSync(indexPath, 'utf-8');

  // A. Ensure Anti-Caching Meta Tags are present
  const metaHeaders = `  <!-- Anti-Caching & Cache-Control Headers -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">`;

  if (!indexHtml.includes('http-equiv="Cache-Control"')) {
    indexHtml = indexHtml.replace('  <!-- Google Fonts -->', `${metaHeaders}\n\n  <!-- Google Fonts -->`);
  }

  // B. Update CSS links
  const cssRegex = /(href=["']css\/[a-zA-Z0-9_-]+\.css)(?:\?v=[a-zA-Z0-9._-]+)?(["'])/g;
  indexHtml = indexHtml.replace(cssRegex, (match, prefix, quote) => {
    return isClean ? `${prefix}${quote}` : `${prefix}?v=${buildId}${quote}`;
  });

  // C. Update script tags
  const jsRegex = /(src=["']js\/[a-zA-Z0-9_-]+\.js)(?:\?v=[a-zA-Z0-9._-]+)?(["'])/g;
  indexHtml = indexHtml.replace(jsRegex, (match, prefix, quote) => {
    return isClean ? `${prefix}${quote}` : `${prefix}?v=${buildId}${quote}`;
  });

  fs.writeFileSync(indexPath, indexHtml, 'utf-8');
  console.log(`✅ Updated index.html (Meta tags, Stylesheets, Main entrypoint)`);
}

// 2. Recursively patch ES Module imports in js/
const jsDir = path.join(ROOT_DIR, 'js');

function getAllJsFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllJsFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const jsFiles = getAllJsFiles(jsDir);
let patchedImportsCount = 0;

// Regular expression for static imports / exports:
// matches: from './path.js' or from '../path.js' (with optional existing ?v=...)
const staticImportRegex = /(from\s+['"])(\.{1,2}\/[^'"]+?\.js)(?:\?v=[a-zA-Z0-9._-]+)?(['"])/g;

// Regular expression for dynamic imports:
// matches: import('./path.js') or import('../path.js')
const dynamicImportRegex = /(import\(\s*['"])(\.{1,2}\/[^'"]+?\.js)(?:\?v=[a-zA-Z0-9._-]+)?(['"]\s*\))/g;

jsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let modified = false;

  content = content.replace(staticImportRegex, (match, p1, p2, p3) => {
    patchedImportsCount++;
    modified = true;
    return isClean ? `${p1}${p2}${p3}` : `${p1}${p2}?v=${buildId}${p3}`;
  });

  content = content.replace(dynamicImportRegex, (match, p1, p2, p3) => {
    patchedImportsCount++;
    modified = true;
    return isClean ? `${p1}${p2}${p3}` : `${p1}${p2}?v=${buildId}${p3}`;
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf-8');
  }
});

console.log(`✅ Patched ${patchedImportsCount} ES module imports across ${jsFiles.length} files in js/`);

// 3. Generate version.json
const versionInfo = {
  version: '1.3.1',
  buildId: buildId || 'dev-clean',
  timestamp,
  gitCommit
};

const versionJsonPath = path.join(ROOT_DIR, 'version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2) + '\n', 'utf-8');
console.log(`✅ Generated version.json (${versionInfo.buildId})`);

console.log(`\n🎉 Cache-busting complete! All assets are versioned and ready for Production.\n`);
