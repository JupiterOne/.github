import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import {
  getTestResult,
  getTestResults,
  setInputs,
  setSecrets,
} from 'tests/utils/helpers';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

const repoName = 'frontend_runtime_utility_manual_e2e_trigger';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(
    getWorkflowConfig({
      repoName,
      additionalFiles: [
        {
          src: resolve(
            cwd(),
            '.github',
            'actions',
            'frontend',
            'runtime',
            'e2e_prepare',
            'test',
            'artemis-run.json'
          ),
          dest: 'artemis-run.json',
        },
      ],
    })
  );

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('validate inputs and secrets', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const mockInputs = {
    e2e_pass_on_error: true,
    repos_to_test: '[{"repo":{"name":"web-home", "spec":"test/spec" }}]',
  };

  setInputs({ act, mockInputs });

  setSecrets({ act, mockSecrets: ['E2E_AUTO'] });

  const results = await runWorkflow({ act, repoName, mockGithub });

  // e2e_run
  const e2e_trigger_remote_tests_inputs = getTestResult({
    results,
    name: 'e2e_trigger_remote_tests_inputs',
  });

  expect(e2e_trigger_remote_tests_inputs.output).toContain(
    `e2e_pass_on_error=${mockInputs.e2e_pass_on_error}`
  );
  expect(e2e_trigger_remote_tests_inputs.output).toContain(`e2e_auto=***`);
  expect(e2e_trigger_remote_tests_inputs.output).toContain(
    JSON.parse(mockInputs.repos_to_test)[0].repo.name
  );
  expect(e2e_trigger_remote_tests_inputs.output).toContain(
    JSON.parse(mockInputs.repos_to_test)[0].repo.spec
  );
});

test.skip('flow with e2e_pass_on_error set to true to make tests non blocking', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('e2e_pass_on_error', 'true');

  const results = await runWorkflow({
    act,
    repoName,
    mockGithub,
    mockSteps: {
      e2e_pending_status: [{ name: 'e2e_pending_status', mockWith: 'echo ""' }],
      migration_number: [{ name: 'migration_number', mockWith: 'echo ""' }],
      magic_url: [{ name: 'magic_url', mockWith: 'echo ""' }],
      e2e_prepare: [{ name: 'e2e_prepare', mockWith: 'echo ""' }],
      // Purposefully fail to test e2e_pass_on_error
      e2e_trigger_remote_tests: [
        { name: 'e2e_prepare', mockWith: 'echo "exit 1"' },
      ],
    },
  });

  const jobs_found = getTestResults({
    results,
    names: [
      'e2e_pending_status',
      'migration_number',
      'magic_url',
      'e2e_trigger_remote_tests',
      'e2e_status',
    ],
  });

  expect(jobs_found.length).toEqual(5);
});
