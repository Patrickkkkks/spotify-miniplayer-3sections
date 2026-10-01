#!/usr/bin/env node
/*
 * Build dist/pip-3-sections.js from src/runtime.js + src/pip-3-sections.css.
 * 用法 / usage:  node build.js
 */

const fs = require('fs');
const path = require('path');

const root = __dirname;
const runtimePath = path.join(root, 'src', 'runtime.js');
const cssPath = path.join(root, 'src', 'pip-3-sections.css');
const outPath = path.join(root, 'dist', 'pip-3-sections.js');

const runtime = fs.readFileSync(runtimePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

if (!runtime.includes('/*__PIP_CSS__*/')) {
  console.error('runtime.js 缺少 /*__PIP_CSS__*/ 占位符');
  process.exit(1);
}

const escaped = css
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const out = runtime.replace('/*__PIP_CSS__*/', escaped);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, 'utf8');
console.log('built dist/pip-3-sections.js (' + out.length + ' chars)');
