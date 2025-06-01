import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const root = process.cwd();
const versionFile = path.join(root, 'version.txt');
const pkgPath = path.join(root, 'package.json');

// 1. Прочитать версию и тег из version.txt
const [versionRaw, tagRaw] = fs
  .readFileSync(versionFile, 'utf8')
  .trim()
  .split('\n');
const version = versionRaw.trim();
const tag = tagRaw.trim();

// 2. Обновить package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// 3. Перегенерировать lock-файл (если pnpm)
execSync('pnpm install --lockfile-only', { stdio: 'inherit' });

// 4. Добавить, закоммитить, создать тег
execSync(`git config user.name "github-actions[bot]"`);
execSync(
  `git config user.email "github-actions[bot]@users.noreply.github.com"`
);

execSync('git add package.json pnpm-lock.yaml version.txt', {
  stdio: 'inherit',
});
execSync(`git commit -m "release: ${version}" || echo "No changes to commit"`, {
  stdio: 'inherit',
});

execSync(`git tag -f v${version}`, { stdio: 'inherit' });
execSync(`git push origin main --follow-tags`, { stdio: 'inherit' });

// 5. Публикация в NPM
execSync(`pnpm publish --no-git-checks --tag ${tag}`, {
  stdio: 'inherit',
});

if (tag === 'latest') {
  execSync(
    `gh release create v${version} --title "v${version}" --notes "Release ${version}"`,
    {
      stdio: 'inherit',
    }
  );
}
