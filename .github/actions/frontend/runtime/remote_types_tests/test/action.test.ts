import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'validate';

let mockGithub: MockGithub;

afterEach(async () => {
  await mockGithub.teardown();
});

test('remote types test is called', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({
    directory: __dirname,
    repoName,
    actionTriggeringComposite: 'action_test_default.yml'
  }));
  
  await mockGithub.setup();

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname
  });

  const result = getTestResult({ results, name: 'remote_type_test' });

  expect(result).toBeDefined();
});

test('remote types test is skipped if HAS_SKIP is present', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({
    directory: __dirname,
    repoName,
    actionTriggeringComposite: 'action_test_skip.yml'
  }));
  
  await mockGithub.setup();
 
  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname
  });

  const result = getTestResult({ results, name: 'remote_type_test' });

  expect(result).toBeUndefined();
});