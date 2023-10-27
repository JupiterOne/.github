import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setInputs, setSecrets } from 'tests/utils/helpers';
import mockPackageJson from 'tests/package.json';

const repoName = 'frontend_runtime_utility_pr';

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

  const mockInputs = {
    use_chromatic: true
  };

  setInputs({ act, mockInputs });
  
  setSecrets({ act, mockSecrets: [
    'CHROMATIC_PROJECT_TOKEN'
  ]});

  const results = await runWorkflow({ act, repoName, mockGithub });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });
  
  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);

  // magic_url
  const magic_url_inputs = getTestResult({ results, name: 'magic_url_inputs' });

  expect(magic_url_inputs.output).toContain(`migration=${mockPackageJson.config.migration}`);

  // code_ql
  const code_ql_inputs = getTestResult({ results, name: 'code_ql_inputs' });
  
  expect(code_ql_inputs.output).toContain(`language=javascript`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));
  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'code_ql',
    'magic_url'
  ] });

  expect(jobs_found.length).toEqual(4);
});

test('when use_validate is false', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_validate', 'false');

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: [
    'validate'
  ] });

  expect(jobs_found.length).toEqual(0);
});

test('when use_chromatic is true', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: [
    'chromatic_upload'
  ] });

  expect(jobs_found.length).toEqual(1);
});
