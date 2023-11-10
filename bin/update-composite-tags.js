const { readdir, readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { cwd } = require('node:process');

const pathToWorkflows = path.resolve(cwd(), '.github/workflows');

const TAG_VERSION = process.argv.slice(2)[0];

const updateFlow = async (fileName) => {
  const pathToPrFlow = `${pathToWorkflows}/${fileName}`;
  const workflow = await readFile(pathToPrFlow, 'utf8');
  const tagVersion = TAG_VERSION.replace('v', '');
  const newWorkflow = workflow.replace(/(jupiterone\/.github\/.github\/actions.*@).*/g, `$1v${tagVersion}`);

  await writeFile(pathToPrFlow, newWorkflow);
};

const update = async () => {
  const files = await readdir(pathToWorkflows);
  const filteredFiles = files.filter(file => file.includes('.yaml') || file.includes('.yml'));
  
  for await (const file of filteredFiles) {
    await updateFlow(file);
  }
}

(async () => {
  if (!TAG_VERSION) {
    console.log('Tag version required.');

    return;
  }

  await update();
})();