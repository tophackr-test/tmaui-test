import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const version = execSync('git rev-list --count HEAD').toString().trim();
const branch = process.env.GITHUB_REF_NAME || 'canary';

if (branch === 'main') {
  // обычный bump
  const newVersion = execSync('npm version patch --no-git-tag-version')
    .toString()
    .trim();
  console.log(`New version: ${newVersion}`);
} else {
  pkg.version = `${pkg.version}-canary.${version}`;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`Canary version: ${pkg.version}`);
}
