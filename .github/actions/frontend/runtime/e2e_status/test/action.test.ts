import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import {
  getCompositeActionConfig,
  runCompositeAction,
} from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'e2e_status';

let mockGithub: MockGithub;

afterEach(async () => {
  await mockGithub.teardown();
});

test('force_status_as_success is not called when e2e_passed is false', async () => {
  mockGithub = new MockGithub(
    getCompositeActionConfig({
      directory: __dirname,
      repoName,
      actionTriggeringComposite: 'action_test_fail.yml',
    })
  );

  await mockGithub.setup();

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
  });

  const result = getTestResult({ results, name: 'force_status_as_success' });

  expect(result).toBeUndefined();
});

test('e2e_pass_on_error allows force_status_as_success to be called when e2e_passed is false', async () => {
  mockGithub = new MockGithub(
    getCompositeActionConfig({
      directory: __dirname,
      repoName,
      actionTriggeringComposite: 'action_test_pass.yml',
    })
  );

  await mockGithub.setup();

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
  });

  const result = getTestResult({ results, name: 'force_status_as_success' });

  expect(result).not.toBeUndefined();
});
