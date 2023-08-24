import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setInputs, setSecrets } from 'tests/utils/helpers';
import mockPackageJson from 'tests/package.json';
import mockArtemisRun from '~/actions/frontend/runtime/e2e_prepare/test/artemis-run.json';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

let mockGithub: MockGithub;

const repoName = 'frontend_runtime_application_pr';

const mockArtemisData = {
  id: mockArtemisRun[0].id,
  accountName: mockArtemisRun[0].metadata.accountName,
  accountSubdomain: mockArtemisRun[0].metadata.accountSubdomain,
  users: {
    tokenSecret: mockArtemisRun[1].metadata.token.tokenSecret,
    tokenCsrf: mockArtemisRun[1].metadata.token.tokenCsrf,
    groupName: mockArtemisRun[1].metadata.groupName
  }
};

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
  const mockSecrets = [
    'CHROMATIC_PROJECT_TOKEN',
    'CYPRESS_MAILINATOR_API_KEY',
    'CYPRESS_RECORD_KEY',
    'CYPRESS_PROJECT_ID',
    'CYPRESS_PASSWORD'
  ];
  const mockInputs = {
    magic_url_route: 'magic_url_route_test',
    e2e_artemis_config_path: 'e2e_artemis_config_path_test',
    e2e_containers: '["1", "2"]',
    e2e_filter_tags: 'e2e_filter_tags_test',
    e2e_pass_on_error: true,
    spec_to_run: 'spec_to_run_test'
  };

  setSecrets({ act, mockSecrets });
  setInputs({ act, mockInputs });

  act.setInput('use_chromatic', 'true');
  act.setInput('use_e2e', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });
  
  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);

  // magic_url
  const magic_url_inputs = getTestResult({ results, name: 'magic_url_inputs' });

  expect(magic_url_inputs.output).toContain(`migration=${mockPackageJson.config.migration}`);
  expect(magic_url_inputs.output).toContain(`magic_url_route=${mockInputs.magic_url_route}`);

  // e2e_prepare
  const e2e_prepare_inputs = getTestResult({ results, name: 'e2e_prepare_inputs' });

  expect(e2e_prepare_inputs.output).toContain(`e2e_artemis_config_path=${mockInputs.e2e_artemis_config_path}`);
  expect(e2e_prepare_inputs.output).toContain(`user_count=${JSON.parse(mockInputs.e2e_containers).length}`);

  // e2e_run
  const e2e_run_inputs = getTestResult({ results, name: 'e2e_run_inputs' });

  expect(e2e_run_inputs.output).toContain(`artemis_account_name=${mockArtemisData.accountName}`);
  expect(e2e_run_inputs.output).toContain(`artemis_account_subdomain=${mockArtemisData.accountSubdomain}`);
  expect(e2e_run_inputs.output).toContain(`artemis_account_id=${mockArtemisData.id}`);
  expect(e2e_run_inputs.output).toContain(`artemis_users=[${JSON.stringify(mockArtemisData.users).replace(/"([^"]+)"/g, '$1')}]`);
  expect(e2e_run_inputs.output).toContain(`cypress_mailinator_api_key=***`);
  expect(e2e_run_inputs.output).toContain(`cypress_record_key=***`);
  expect(e2e_run_inputs.output).toContain(`cypress_project_id=***`);
  expect(e2e_run_inputs.output).toContain(`cypress_password=***`);
  expect(e2e_run_inputs.output).toContain(`e2e_filter_tags=${mockInputs.e2e_filter_tags}`);
  expect(e2e_run_inputs.output).toContain(`e2e_pass_on_error=${mockInputs.e2e_pass_on_error}`);
  expect(e2e_run_inputs.output).toContain(`migration_number=${mockPackageJson.config.migration}`);
  expect(e2e_run_inputs.output).toContain(`spec_to_run=${mockInputs.spec_to_run}`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub });

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

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url',
    'chromatic_upload'
  ] });

  expect(jobs_found.length).toEqual(4);
});

test('flow with e2e_pass_on_error set to true to make tests non blocking', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_e2e', 'true');
  act.setInput('e2e_pass_on_error', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub, mockSteps: {
    migration_number: [ { name: 'migration_number', mockWith: 'echo ""' } ],
    validate: [ { name: 'validate', mockWith: 'echo ""' } ],
    magic_url: [ { name: 'magic_url', mockWith: 'echo ""' } ],
    e2e_prepare: [ { name: 'e2e_prepare', mockWith: 'echo ""' } ],
    
    // Purposefully fail to test e2e_pass_on_error
    e2e_run: [{
      name: 'e2e_run',
      mockWith: 'exit 1',
    }],
  }});

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url',
    'e2e_prepare',
    'e2e_run',
    'e2e_status'
  ] });

  expect(jobs_found.length).toEqual(6);
});
