const fs = require('fs');
const path = require('node:path');
const { cwd } = require('node:process');

const src = path.resolve(cwd(), '.github');
const dest = path.resolve(cwd(), 'temp');
const filesToUpdate = [];

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest);
} else {
  fs.rmSync(dest, { recursive: true, force: true });
}

fs.cpSync(src, dest, {
  recursive: true,
  filter: (name) => {
    const include = 
      !name.includes('/test') && 
      !name.includes('.md') &&
      !name.includes('.DS_Store') &&
      !name.includes('mocks.ts');

    if (include && name.includes('.yml')) {
      filesToUpdate.push(`temp/${name.split('.github/.github/')[1]}`);
    }

    return include;
  }
});

filesToUpdate.forEach((file) => {
  const data = fs.readFileSync(file, 'utf-8');

  const result = data
    .replace(/uses: jupiterone\/.github\//g, 'uses: ./')
    .replace(/(uses: .\/.github\/actions.*)(@.*)/g, `$1 `);

  fs.writeFileSync(file, result, 'utf-8');
});