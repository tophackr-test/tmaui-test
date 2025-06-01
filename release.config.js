module.exports = {
  branches: [
    'main',
    { name: 'main', channel: 'latest' },
    { name: '/^.*$/', prerelease: 'canary' },
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
