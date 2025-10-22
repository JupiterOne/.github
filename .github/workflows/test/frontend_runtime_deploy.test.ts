import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setSecrets } from 'tests/utils/helpers';

const repoName = 'frontend_runtime_deploy';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName }));

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('validate inputs and secrets', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  setSecrets({
    act,
    mockSecrets: ['CORTEX_API_KEY', 'CHROMATIC_PROJECT_TOKEN'],
  });
  act.setInput('publish_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });

  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: ['validate'] });

  expect(jobs_found.length).toEqual(1);
});

test('flow with chromatic turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('publish_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({
    results,
    names: ['validate', 'chromatic_publish'],
  });

  expect(jobs_found.length).toEqual(2);
});
