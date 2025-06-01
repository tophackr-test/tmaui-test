// scripts/changelog.ts
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import packageJson from '../package.json';

const changelogFile = path.resolve(process.cwd(), 'CHANGELOG.md');

// Получаем последнюю версию из git tag
const latestTag = execSync('git describe --tags --abbrev=0').toString().trim();

const newTag = packageJson.version;

// Формируем список коммитов с Conventional Commit
const commits = execSync(`git log ${latestTag}..HEAD --pretty=format:"%s"`)
  .toString()
  .split('\n')
  .filter(Boolean);

const sections = {
  Features: [],
  Fixes: [],
  Chores: [],
  Others: [],
};

for (const commit of commits) {
  if (commit.startsWith('feat:')) {
    sections.Features.push(commit.replace(/^feat:\s*/, ''));
  } else if (commit.startsWith('fix:')) {
    sections.Fixes.push(commit.replace(/^fix:\s*/, ''));
  } else if (commit.startsWith('chore:')) {
    sections.Chores.push(commit.replace(/^chore:\s*/, ''));
  } else {
    sections.Others.push(commit);
  }
}

// Форматируем changelog
const today = new Date().toISOString().split('T')[0];
let newLog = `\n\n## ${newTag} (${today})\n`;

for (const [title, items] of Object.entries(sections)) {
  if (items.length === 0) continue;
  newLog += `\n### ${title}\n`;
  for (const item of items) {
    newLog += `- ${item}\n`;
  }
}

// Вставляем в CHANGELOG.md
if (!fs.existsSync(changelogFile)) {
  fs.writeFileSync(changelogFile, '# Changelog\n');
}
const old = fs.readFileSync(changelogFile, 'utf8');
fs.writeFileSync(changelogFile, old + newLog);

console.log('📝 changelog updated');
