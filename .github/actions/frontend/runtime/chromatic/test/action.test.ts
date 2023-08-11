import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'chromatic';

let mockGithub: MockGithub;

afterEach(async () => {
  await mockGithub.teardown();
});

test('chromatic_upload called if publish_chromatic is false', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName, actionTriggeringComposite: 'action_test_upload.yml' }));
  
  await mockGithub.setup();

  mockCompositeStep({
    originDirectory: __dirname,
    repoPath: mockGithub.repo.getPath(repoName),
    mockSteps: [
      { name: 'setup_env' },
      { name: 'chromatic_upload' },
      { name: 'chromatic_publish' },
    ]
  });

  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName, mockSteps: false });

  const result = getTestResult({ results, name: 'chromatic_upload' });

  expect(result).not.toBeUndefined();
});

test('chromatic_publish called if publish_chromatic is true', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName, actionTriggeringComposite: 'action_test_publish.yml' }));
  
  await mockGithub.setup();

  mockCompositeStep({
    originDirectory: __dirname,
    repoPath: mockGithub.repo.getPath(repoName),
    mockSteps: [
      { name: 'setup_env' },
      { name: 'chromatic_upload' },
      { name: 'chromatic_publish' },
    ]
  });

  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('publish_chromatic', 'true');

  const results = await runCompositeAction({ act, repoName, mockSteps: false });

  const result = getTestResult({ results, name: 'chromatic_publish' });

  expect(result).not.toBeUndefined();
});