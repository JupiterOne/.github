import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults } from 'tests/utils/helpers';
import mockPackageJson from 'tests/package.json';
import mockArtemisRun from '~/actions/frontend/runtime/e2e_prepare/test/artemis-run.json';

const repoName = 'frontend_runtime_application_pr';

let mockGithub: MockGithub;

const coreMockSteps = {
  validate: [
    { name: 'validate', mockWith: 'echo validate' },
  ],
  magic_url: [
    { name: 'magic_url', mockWith: 'echo magic_url' },
  ]
}

beforeEach(async () => {
  mockGithub = new MockGithub(getWorkflowConfig({ repoName }));
  
  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({
    act,
    repoName,
    config: {
      mockSteps: coreMockSteps
    }
  });

  // Confirm the appropriate jobs are run
  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url'
  ] });

  expect(jobs_found.length).toEqual(3);

  // Confirm derived props (obtained from another job) are successfully received
  const result_magic_url_calculated_props = getTestResult({ results, name: 'magic_url_derived_props' });
  expect(result_magic_url_calculated_props.output).toEqual(`migration=${mockPackageJson.config.migration}`);
});

test.skip('chromatic turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({
    act,
    repoName,
    config: {
      mockSteps: {
        ...coreMockSteps,
        chromatic_deployment: [
          { name: 'chromatic_deployment', mockWith: 'echo chromatic_deployment' },
        ],
      },
    }
  });

    // Confirm the appropriate jobs are run
    const jobs_found = getTestResults({ results, names: [
      'migration_number',
      'validate',
      'magic_url',
      'chromatic_deployment'
    ] });
  
    expect(jobs_found.length).toEqual(4);
  
    // Confirm derived props (obtained from another job) are successfully received
    const result_magic_url_calculated_props = getTestResult({ results, name: 'magic_url_derived_props' });
    expect(result_magic_url_calculated_props.output).toEqual(`migration=${mockPackageJson.config.migration}`);
});

test.skip('e2e tests turned on', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

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

  act.setInput('use_e2e', 'true');

  const results = await runWorkflow({
    act,
    repoName,
    config: {
      mockSteps: {
        ...coreMockSteps,
        e2e_prepare: [
          { name: 'e2e_prepare', mockWith: `
            echo "artemis_account_id=${mockArtemisData.id}" >> $GITHUB_OUTPUT
            echo "artemis_account_name=${mockArtemisData.accountName}" >> $GITHUB_OUTPUT
            echo "artemis_account_subdomain=${mockArtemisData.accountSubdomain}" >> $GITHUB_OUTPUT
            echo "artemis_users=${JSON.stringify(mockArtemisData.users)}" >> $GITHUB_OUTPUT
          `}
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

  // Confirm the appropriate jobs are run
  const jobs_found = getTestResults({ results, names: [
    'migration_number',
    'validate',
    'magic_url',
    'e2e_prepare',
    'e2e_run',
    'e2e_status'
  ] });

  expect(jobs_found.length).toEqual(6);

  // Confirm derived props (obtained from another job) are successfully received
  const result_e2e_prepare_derived_props = getTestResult({ results, name: 'e2e_prepare_derived_props' });
  expect(result_e2e_prepare_derived_props.output).toEqual(`migration=${mockPackageJson.config.migration}`);

  const results_e2e_run_derived_props = getTestResult({ results, name: 'e2e_run_derived_props' });
  expect(results_e2e_run_derived_props.output).toContain(`migration=${mockPackageJson.config.migration}`);
  expect(results_e2e_run_derived_props.output).toContain(`artemis_account_id=${mockArtemisData.id}`);
  expect(results_e2e_run_derived_props.output).toContain(`artemis_account_name=${mockArtemisData.accountName}`);
  expect(results_e2e_run_derived_props.output).toContain(`artemis_account_subdomain=${mockArtemisData.accountSubdomain}`);
  expect(results_e2e_run_derived_props.output).toContain(`artemis_users=${JSON.stringify(mockArtemisData.users).replace(/"([^"]+)"/g, '$1')}`);
});
