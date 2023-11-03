import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';
import { PR_COMMENT_MOCK_STEPS } from '../mocks';

const repoName = 'pr_comment';

let mockGithub: MockGithub;

afterEach(async () => {
  await mockGithub.teardown();
});

test('default flow assuming a new comment has been added', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({
    directory: __dirname,
    repoName,
    actionTriggeringComposite: 'action_test_default.yml'
  }));

  await mockGithub.setup();

  // This is a different comment than the one in the action_test_default.yml
  const comment = "This is a test comment";

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
    mockSteps: [
      ...PR_COMMENT_MOCK_STEPS,
      { name: 'find_comment', mockWith: `echo "comment-body=${comment}" >> "$GITHUB_OUTPUT"` },
    ]
  });

  const result = getTestResult({
    results,
    name: 'add_pr_comment_once'
  });

  expect(result).toBeDefined();
});

test('attempting to add the same comment twice when run_once is true', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({
    directory: __dirname,
    repoName,
    actionTriggeringComposite: 'action_test_default.yml'
  }));

  await mockGithub.setup();

  // This is the same comment left in the action_test_default.yml
  const comment = "hello world";

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
    mockSteps: [
      ...PR_COMMENT_MOCK_STEPS,
      { name: 'find_comment', mockWith: `echo "comment-body=${comment}" >> "$GITHUB_OUTPUT"` },
    ]
  });

  const result = getTestResult({
    results,
    name: 'add_pr_comment_once'
  });

  expect(result).not.toBeDefined();
});

test('a comment is left even when there is a duplicate when run_once is false', async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({
    directory: __dirname,
    repoName,
    actionTriggeringComposite: 'action_test_always.yml'
  }));

  await mockGithub.setup();

  // This is the same comment left in the action_test_default.yml
  const comment = "hello world";

  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
    mockSteps: [
      ...PR_COMMENT_MOCK_STEPS,
      { name: 'find_comment', mockWith: `echo "comment-body=${comment}" >> "$GITHUB_OUTPUT"` },
    ]
  });

  const result = getTestResult({
    results,
    name: 'add_pr_comment_always'
  });

  expect(result).toBeDefined();
});
