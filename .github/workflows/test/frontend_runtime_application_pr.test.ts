import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'frontend_runtime_application_pr';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test.skip('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const migrationNumber = '2';

  const results = await runWorkflow({
    act,
    repoName,
    config: {
      mockSteps: {
        migration_number: [
          { name: 'migration_number', mockWith: `echo "migration=${migrationNumber}" >> $GITHUB_OUTPUT` },
        ],
        validate: [
          { name: 'validate', mockWith: 'echo validate' },
        ],
        chromatic_deployment: [
          { name: 'chromatic_deployment', mockWith: 'echo chromatic_deployment' },
        ],
        magic_url: [
          { name: 'magic_url', mockWith: 'echo magic_url' },
        ],
        e2e_prepare: [
          { name: 'e2e_prepare', mockWith: 'echo e2e_prepare' },
        ],
        e2e_run: [
          { name: 'e2e_run', mockWith: 'echo e2e_run' },
        ],
        e2e_status: [
          { name: 'e2e_status', mockWith: 'echo e2e_status' },
        ],
      },
    }
  });

  expect(results.length).toBe(15);

  // Confirm magic_url gets the migration_number
  const result_magic_url_calculated_props = getTestResult({ results, name: 'magic_url_calculated_props' });
  expect(result_magic_url_calculated_props.output).toEqual(`migration=${migrationNumber}`);
});

test.skip('e2e tests turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const migrationNumber = '2';
  const artemisAccountName = 'accountNameTest';

  act.setInput('use_e2e', 'true');

  const results = await runWorkflow({
    act,
    repoName,
    config: {
      mockSteps: {
        migration_number: [
          { name: 'migration_number', mockWith: `echo "migration=${migrationNumber}" >> $GITHUB_OUTPUT` },
        ],
        validate: [
          { name: 'validate', mockWith: 'echo validate' },
        ],
        chromatic_deployment: [
          { name: 'chromatic_deployment', mockWith: 'echo chromatic_deployment' },
        ],
        magic_url: [
          { name: 'magic_url', mockWith: 'echo magic_url' },
        ],
        e2e_prepare: [
          { name: 'e2e_prepare', mockWith: `echo "artemis_account_name=${artemisAccountName}">> $GITHUB_OUTPUT` },
        ],
        e2e_run: [
          { name: 'e2e_run', mockWith: 'echo e2e_run' },
        ],
        e2e_status: [
          { name: 'e2e_status', mockWith: 'echo e2e_status' },
        ],
      },
    }
  });

  // Confirm e2e_prepare gets the migration_number
  const result_e2e_prepare_calculated_props = getTestResult({ results, name: 'e2e_prepare_calculated_props' });
  expect(result_e2e_prepare_calculated_props.output).toEqual(`migration=${migrationNumber}`);

  // Confirm e2e_run gets the migration_number and artemis_info
  const results_e2e_run_calculated_props = getTestResult({ results, name: 'e2e_run_calculated_props' });
  expect(results_e2e_run_calculated_props.output).toContain(`migration=${migrationNumber}`);
  expect(results_e2e_run_calculated_props.output).toContain(`artemis_account_name=${artemisAccountName}`);
});


test('chromatic turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const migrationNumber = '2';
  const artemisAccountName = 'accountNameTest';

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({
    act,
    repoName,
    config: {
      mockSteps: {
        migration_number: [
          { name: 'migration_number', mockWith: `echo "migration=${migrationNumber}" >> $GITHUB_OUTPUT` },
        ],
        validate: [
          { name: 'validate', mockWith: 'echo validate' },
        ],
        chromatic_deployment: [
          { name: 'chromatic_deployment', mockWith: 'echo chromatic_deployment' },
        ],
        magic_url: [
          { name: 'magic_url', mockWith: 'echo magic_url' },
        ],
        e2e_prepare: [
          { name: 'e2e_prepare', mockWith: `echo "artemis_account_name=${artemisAccountName}">> $GITHUB_OUTPUT` },
        ],
        e2e_run: [
          { name: 'e2e_run', mockWith: 'echo e2e_run' },
        ],
        e2e_status: [
          { name: 'e2e_status', mockWith: 'echo e2e_status' },
        ],
      },
    }
  });

  // The chromatic_deployment job should get run
  const result = getTestResult({ results, name: 'chromatic_deployment' });
  expect(result).not.toBeUndefined();
});
