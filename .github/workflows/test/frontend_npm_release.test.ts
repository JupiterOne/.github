import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setSecrets } from 'tests/utils/helpers';

let mockGithub: MockGithub;

const repoName = 'frontend_npm_release';

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName }));

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('validate inputs and secrets', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));
  const mockSecrets = [
    'CHROMATIC_PROJECT_TOKEN',
    'AUTO_GITHUB_PAT_TOKEN',
    'CORTEX_API_KEY',
  ];

  setSecrets({ act, mockSecrets });

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });

  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);

  // npm_publish
  const npm_publish_inputs = getTestResult({
    results,
    name: 'npm_publish_inputs',
  });

  expect(npm_publish_inputs.output).toContain(`auto_token=***`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({
    results,
    names: ['validate', 'publish', 'cortex'],
  });

  expect(jobs_found.length).toEqual(3);
});

test('when use_chromatic is true', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({
    results,
    names: ['validate', 'chromatic_publish', 'publish', 'cortex'],
  });

  expect(jobs_found.length).toEqual(4);
});
