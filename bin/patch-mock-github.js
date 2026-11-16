const fs = require('node:fs');
const path = require('node:path');

const ORIGINAL = '__importDefault(require("simple-git"))';
const PATCHED = '{ default: require("simple-git").simpleGit }';

const repositoryDir = path.dirname(
  require.resolve('@kie/mock-github/build/src/github/repository/repository-mocker.js')
);
const files = [
  path.join(repositoryDir, 'repository-mocker.js'),
  path.join(repositoryDir, 'state', 'repository-state.js'),
];

files.forEach((file) => {
  const source = fs.readFileSync(file, 'utf8');

  if (source.includes(PATCHED)) return;

  if (!source.includes(ORIGINAL)) {
    throw new Error(
      `Cannot patch ${file}: expected "${ORIGINAL}". @kie/mock-github changed; update bin/patch-mock-github.js.`
    );
  }

  fs.writeFileSync(file, source.split(ORIGINAL).join(PATCHED));
});
