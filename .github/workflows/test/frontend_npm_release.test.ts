import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setSecrets } from 'tests/utils/helpers';

const repoName = 'frontend_npm_release';

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
  const mockSecrets = [
    'CHROMATIC_PROJECT_TOKEN',
    'AUTO_GITHUB_PAT_TOKEN',
    'CORTEX_API_KEY'
  ];

  setSecrets({ act, mockSecrets });

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });
  
  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);

  // npm_release
  const npm_release_inputs = getTestResult({ results, name: 'npm_release_inputs' });
  
  expect(npm_release_inputs.output).toContain(`auto_token=***`);

  // cortex
  const cortex_inputs = getTestResult({ results, name: 'cortex_inputs' });

  expect(cortex_inputs.output).toContain(`cortex_api_key=***`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'validate',
    'release',
    'cortex'
  ] });

  expect(jobs_found.length).toEqual(3);
});

test('when use_chromatic is true', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'validate',
    'chromatic_publish',
    'release',
    'cortex'
  ] });

  expect(jobs_found.length).toEqual(4);
});

test('when use_validate is false', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_validate', 'false');

  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'chromatic_publish',
    'release',
    'cortex'
  ] });

  expect(jobs_found.length).toEqual(2);
});
