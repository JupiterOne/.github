import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'e2e_trigger_remote_tests';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('output of test_passed is true when cypress_run is successful', async () => {
  mockCompositeStep({
    originDirectory: __dirname,
    repoPath: mockGithub.repo.getPath(repoName),
    mockSteps: [
      { name: 'setup_env' },
      { name: 'cypress_run', mockWith: 'exit 0' },
    ]
  });

  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName, mockSteps: false });

  const result = getTestResult({
    results,
    name: 'e2e_run_status'
  });

  expect(result.output).toEqual('e2e_run status is true');
});

test('stops at cypress_run step if tests fail', async () => {
  mockCompositeStep({
    originDirectory: __dirname,
    repoPath: mockGithub.repo.getPath(repoName),
    mockSteps: [
      { name: 'setup_env' },
      { name: 'cypress_run', mockWith: 'exit 1' },
    ]
  });

  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName, mockSteps: false });

  const result = getTestResult({
    results,
    name: 'test_results'
  });

  // The test_results step is never hit
  expect(result).toBeUndefined();
});

// TODO: Test scenario where if e2e_pass_on_error is true, test_results are still reported