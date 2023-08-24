import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'validate';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('remote types test is called', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));
  
  const results = await runCompositeAction({ act, repoName });

  const result = getTestResult({ results, name: 'remote_type_test' });

  expect(result).toBeDefined();
});

test('remote types test is skipped if HAS_SKIP is present', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));
  
  act.setEnv('HAS_SKIP', 'true');
  
  const results = await runCompositeAction({ act, repoName });

  const result = getTestResult({ results, name: 'remote_type_test' });

  expect(result).toBeUndefined();
});