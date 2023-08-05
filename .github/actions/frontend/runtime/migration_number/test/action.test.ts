import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';

const repoName = 'migration_number';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('migration number from package.json is returned', async () => {
  const result = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName });

  expect(result).toMatchObject([
    { name: 'Main get_migration_number', status: 0, output: '' },
    { name: 'Main print_migration_number', status: 0, output: 'migration_number 1' },
  ]);
});