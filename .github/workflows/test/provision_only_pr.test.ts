import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResults } from 'tests/utils/helpers';

let mockGithub: MockGithub;

const repoName = 'provision_only_pr';

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName }));

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: ['validate'] });

  expect(jobs_found.length).toEqual(1);
});
