import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { mockCompositeStep } from 'tests/utils/mock_composite_step';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResults } from 'tests/utils/helpers';

const repoName = 'npm_release';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('esbuild steps are called if use_esbuild is true', async () => {
  mockCompositeStep({
    originDirectory: __dirname,
    repoPath: mockGithub.repo.getPath(repoName),
    mockSteps: [
      { name: 'setup_env' },
      { name: 'esbuild' },
      { name: 'build' },
      { name: 'add_auto_to_globals' },
      { name: 'deploy_to_npm' },
    ]
  });
  
  const results = await runCompositeAction({ act: new Act(mockGithub.repo.getPath(repoName)), repoName, mockSteps: false });

  const jobs_found = getTestResults({ results, names: [
    'esbuild',
  ] });

  expect(jobs_found.length).toEqual(1);
});
