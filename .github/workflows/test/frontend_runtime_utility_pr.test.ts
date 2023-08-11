import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setInputs, setSecrets } from 'tests/utils/helpers';
import mockPackageJson from 'tests/package.json';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

const repoName = 'frontend_runtime_utility_pr';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName, additionalFiles: [
    {
      src: resolve(cwd(), '.github', 'actions', 'frontend', 'runtime', 'e2e_prepare', 'test', 'artemis-run.json'),
      dest: 'artemis-run.json',
    }
  ] }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('validate inputs and secrets', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const mockInputs = {
    use_chromatic: true,
    use_e2e_trigger: true,
    e2e_pass_on_error: true,
    repos_to_test: '[{"repo":{"name":"web-home", "spec":"test/spec" }}]'
  };

  setInputs({ act, mockInputs });
  
  setSecrets({ act, mockSecrets: [
    'CHROMATIC_PROJECT_TOKEN',
    'E2E_AUTO'
  ]});

  const results = await runWorkflow({ act, repoName });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });
  
  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);

  // magic_url
  const magic_url_inputs = getTestResult({ results, name: 'magic_url_inputs' });

  expect(magic_url_inputs.output).toContain(`migration=${mockPackageJson.config.migration}`);;

  // e2e_run
  const e2e_trigger_remote_tests_inputs = getTestResult({ results, name: 'e2e_trigger_remote_tests_inputs' });

  expect(e2e_trigger_remote_tests_inputs.output).toContain(`e2e_pass_on_error=${mockInputs.e2e_pass_on_error}`);
  expect(e2e_trigger_remote_tests_inputs.output).toContain(`e2e_auto=***`);
  expect(e2e_trigger_remote_tests_inputs.output).toContain(JSON.parse(mockInputs.repos_to_test)[0].repo.name);
  expect(e2e_trigger_remote_tests_inputs.output).toContain(JSON.parse(mockInputs.repos_to_test)[0].repo.spec);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));
  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url'
  ] });

  expect(jobs_found.length).toEqual(3);
});

test('flow with chromatic turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url',
    'chromatic_upload'
  ] });

  expect(jobs_found.length).toEqual(4);
});

test('flow with e2e trigger turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  setInputs({ act, mockInputs: {
    use_e2e_trigger: true,
    repos_to_test: '[{"repo":{"name":"web-home", "spec":"test/spec" }}]'
  }});

  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url',
    'e2e_trigger_remote_tests',
    'e2e_status'
  ] });

  expect(jobs_found.length).toEqual(5);
});

test('flow with e2e_pass_on_error set to true to make tests non blocking', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  setInputs({ act, mockInputs: {
    use_e2e_trigger: true,
    e2e_pass_on_error: true,
    repos_to_test: '[{"repo":{"name":"web-home", "spec":"test/spec" }}]'
  }});

  const results = await runWorkflow({ act, repoName, mockSteps: false, config: {
    mockSteps: {
      migration_number: [ { name: 'migration_number', mockWith: 'echo ""' } ],
      validate: [ { name: 'validate', mockWith: 'echo ""' } ],
      magic_url: [ { name: 'magic_url', mockWith: 'echo ""' } ],
      
      // Purposefully fail trigger to test e2e_pass_on_error
      e2e_trigger_remote_tests: [{
        name: 'e2e_trigger_remote_tests',
        mockWith: 'exit 1',
      }],
    }
  }});

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url',
    'e2e_trigger_remote_tests',
    'e2e_status'
  ] });

  expect(jobs_found.length).toEqual(5);
});
