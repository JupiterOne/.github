import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';
import { E2E_RUN_MOCK_STEPS } from './mocks';

const repoName = 'e2e_run';

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
    mockSteps: [ ...E2E_RUN_MOCK_STEPS ]
  });

  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName });

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
      ...E2E_RUN_MOCK_STEPS,
      { name: 'cypress_run', mockWith: 'exit 1' },
    ]
  });

  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName });

  const result = getTestResult({
    results,
    name: 'test_results'
  });

  // The test_results step is never hit
  expect(result).toBeUndefined();
});

// TODO: Test scenario where if e2e_pass_on_error is true, test_results are still reported
