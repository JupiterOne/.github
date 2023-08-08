import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'e2e_status';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('output of test_passed is true when cypress_run is successful', async () => {
  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName });

  const result = getTestResult({ results, name: 'pass_with_failures' });

  // The pass_with_failures step should get hit if e2e_pass_on_error is true
  expect(result).not.toBeUndefined();
});
