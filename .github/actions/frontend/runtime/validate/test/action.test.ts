import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';

const repoName = 'validate';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('remote types test is skipped if HAS_SKIP is present', async () => {
  mockCompositeStep({
    originDirectory: __dirname,
    repoPath: mockGithub.repo.getPath(repoName),
    mockSteps: [
      { name: 'setup_env' },
      { name: 'validate' },
      { name: 'remote_type_check_skip' },
      { name: 'remote_type_test' },
    ]
  });

  const act = new Act(mockGithub.repo.getPath(repoName));
  
  act.setEnv('HAS_SKIP', 'true');
  
  const results = await runCompositeAction({ act, repoName, mockSteps: false });

  // The remote_type_test step is never hit
  expect(results.length).toEqual(4);
});