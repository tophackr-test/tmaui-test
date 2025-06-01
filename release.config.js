module.exports = {
  branches: [
    { name: 'main', channel: 'latest' },
    { name: 'test-2', prerelease: 'canary' },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};
