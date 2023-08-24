import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setSecrets } from 'tests/utils/helpers';
import { CHROMATIC_MOCK_STEPS } from '~/actions/frontend/chromatic/mocks';

let mockGithub: MockGithub;

const repoName = 'frontend_npm_pr';

// Mock the steps/composite steps that will break tests
const mockSteps = {
  validate: [
    { name: 'setup_env', mockWith: `echo ''` },
    { name: 'validate', mockWith: `echo ''` },
    { name: 'build', mockWith: `echo ''` }
  ],
  chromatic_upload: [
    { name: 'setup_env', mockWith: `echo ''` },
    { 
      name: 'chromatic_upload',
      mockWith: `echo ''`,
      mockCompositeSteps: CHROMATIC_MOCK_STEPS
    }
  ],
};

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
    'NPM_TOKEN',
    'CHROMATIC_PROJECT_TOKEN',
  ];

  setSecrets({ act, mockSecrets });

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });
  
  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: [
    'validate',
  ] });

  expect(jobs_found.length).toEqual(1);
});

test('when use_chromatic is true', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub });

  const jobs_found = getTestResults({ results, names: [
    'validate',
    'chromatic_upload'
  ] });

  expect(jobs_found.length).toEqual(2);
});

test('when use_validate is false', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_validate', 'false');

  const results = await runWorkflow({ act, repoName, mockGithub });

  expect(results.length).toEqual(0);
});
