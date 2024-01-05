import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setSecrets } from 'tests/utils/helpers';

let mockGithub: MockGithub;

const repoName = 'provision_only_release';

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName }));

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('validate inputs and secrets', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));
  const mockSecrets = ['AUTO_GITHUB_PAT_TOKEN'];

  setSecrets({ act, mockSecrets });

  const results = await runWorkflow({ act, repoName, mockGithub });

  // version_artifact
  const version_artifact_inputs = getTestResult({
    results,
    name: 'version_artifact_inputs',
  });

  expect(version_artifact_inputs.output).toContain(`github_token=***`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({
    results,
    names: ['validate', 'version_artifact'],
  });

  expect(jobs_found.length).toEqual(2);
});
