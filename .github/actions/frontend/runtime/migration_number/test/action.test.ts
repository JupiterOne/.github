import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import mockPackageJson from 'tests/package.json';
import { getTestResult } from 'tests/utils/helpers';

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
  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname
  });

  const result = getTestResult({ results, name: 'print_migration_number' });

  expect(result.output).toEqual(`migration_number ${mockPackageJson.config.migration}`);
});