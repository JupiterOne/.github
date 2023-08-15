import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setInputs, setSecrets } from 'tests/utils/helpers';
import mockPackageJson from 'tests/package.json';
import mockArtemisRun from '~/actions/frontend/runtime/e2e_prepare/test/artemis-run.json';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

const repoName = 'frontend_runtime_e2e_trigger_response';

let mockGithub: MockGithub;

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
    'CYPRESS_RECORD_KEY',
    'CYPRESS_PROJECT_ID',
    'CYPRESS_PASSWORD'
  ];
  const mockInputs = {
    spec_to_run: 'spec_to_run_test',
    external_pr_sha: 'external_pr_sha_test',
    external_pr_number: 'external_pr_number_test',
    external_pr_title: 'external_pr_title_test',
    external_pr_branch: 'external_pr_branch_test',
    external_pr_author: 'external_pr_author_test',
    external_pr_repo_name: 'external_pr_repo_name_test'
  };

  setSecrets({ act, mockSecrets });
  setInputs({ act, mockInputs });

  const results = await runWorkflow({ act, repoName });

  // e2e_run
  const e2e_run_inputs = getTestResult({ results, name: 'e2e_run_inputs' });

  expect(e2e_run_inputs.output).toContain(`artemis_account_name=${mockArtemisData.accountName}`);
  expect(e2e_run_inputs.output).toContain(`artemis_account_subdomain=${mockArtemisData.accountSubdomain}`);
  expect(e2e_run_inputs.output).toContain(`artemis_account_id=${mockArtemisData.id}`);
  expect(e2e_run_inputs.output).toContain(`artemis_users=[${JSON.stringify(mockArtemisData.users).replace(/"([^"]+)"/g, '$1')}]`);
  expect(e2e_run_inputs.output).toContain(`cypress_record_key=***`);
  expect(e2e_run_inputs.output).toContain(`cypress_project_id=***`);
  expect(e2e_run_inputs.output).toContain(`cypress_password=***`);
  expect(e2e_run_inputs.output).toContain(`migration_number=${mockPackageJson.config.migration}`);
  expect(e2e_run_inputs.output).toContain(`spec_to_run=${mockInputs.spec_to_run}`);
  expect(e2e_run_inputs.output).toContain(`commit_info_sha=${mockInputs.external_pr_sha}`);
  expect(e2e_run_inputs.output).toContain(`commit_info_pr_number=${mockInputs.external_pr_number}`);
  expect(e2e_run_inputs.output).toContain(`commit_info_pr_title=${mockInputs.external_pr_title}`);
  expect(e2e_run_inputs.output).toContain(`commit_info_branch=${mockInputs.external_pr_branch}`);
  expect(e2e_run_inputs.output).toContain(`commit_info_author=${mockInputs.external_pr_author}`);
  expect(e2e_run_inputs.output).toContain(`commit_info_repo_name=${mockInputs.external_pr_repo_name}`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName });

  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'e2e_prepare',
    'e2e_run'
  ] });

  expect(jobs_found.length).toEqual(3);
});
