import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';
import { SLACK_NOTIFIER_RUN_MOCK_STEPS } from '../mocks';

const repoName = 'slack_notifier';

let mockGithub: MockGithub;

afterEach(async () => {
  await mockGithub.teardown();
});

const token = "mytoken";

test('Inputs are set correctly', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({
    directory: __dirname,
    repoName,
  }));

  await mockGithub.setup();

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
  });

  const result = getTestResult({
    results,
    name: 'prepare_inputs'
  });

  expect(result).toBeDefined();
});
