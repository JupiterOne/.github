import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getWorkflowConfig, runWorkflow } from 'tests/utils/setup';
import { getTestResult, getTestResults, setSecrets } from 'tests/utils/helpers';
import { CHROMATIC_MOCK_STEPS } from '~/actions/frontend/chromatic/mocks';
import { NPM_PUBLISH_MOCK_STEPS } from '~/actions/frontend/npm/publish/mocks';
import { CORTEX_MOCK_STEPS } from '~/actions/frontend/cortex/mocks';

let mockGithub: MockGithub;

const repoName = 'frontend_npm_release';

// Mock the steps/composite steps that will break tests
const mockSteps = {
  validate: [
    { name: 'setup_env', mockWith: `echo ''` },
    { name: 'validate', mockWith: `echo ''` },
    { name: 'build', mockWith: `echo ''` }
  ],
  chromatic_publish: [
    { name: 'setup_env', mockWith: `echo ''` },
    { 
      name: 'chromatic_publish',
      mockCompositeSteps: CHROMATIC_MOCK_STEPS
    }
  ],
  publish: [
    { name: 'setup_env', mockWith: `echo ''` },
    { name: 'build', mockWith: `echo ''` },
    {
      name: 'publish',
      mockCompositeSteps: NPM_PUBLISH_MOCK_STEPS
    }
  ],
  cortex: [
    { name: 'setup_env', mockWith: `echo ''` },
    {
      name: 'cortex',
      mockCompositeSteps: CORTEX_MOCK_STEPS
    },
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
    'CHROMATIC_PROJECT_TOKEN',
    'AUTO_GITHUB_PAT_TOKEN',
    'CORTEX_API_KEY'
  ];

  setSecrets({ act, mockSecrets });

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub, mockSteps });

  // chromatic_upload
  const chromatic_inputs = getTestResult({ results, name: 'chromatic_inputs' });
  
  expect(chromatic_inputs.output).toContain(`chromatic_project_token=***`);

  // npm_publish
  const npm_publish_inputs = getTestResult({ results, name: 'npm_publish_inputs' });
  
  expect(npm_publish_inputs.output).toContain(`auto_token=***`);

  // cortex
  const cortex_inputs = getTestResult({ results, name: 'cortex_inputs' });

  expect(cortex_inputs.output).toContain(`cortex_api_key=***`);
});

test('default flow', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  const results = await runWorkflow({ act, repoName, mockGithub, mockSteps });

  const jobs_found = getTestResults({ results, names: [
    'validate',
    'publish',
    'cortex'
  ] });

  expect(jobs_found.length).toEqual(3);
});

test('when use_chromatic is true', async () => {
  const act = new Act(mockGithub.repo.getPath(repoName));

  act.setInput('use_chromatic', 'true');

  const results = await runWorkflow({ act, repoName, mockGithub, mockSteps });

  const jobs_found = getTestResults({ results, names: [
    'validate',
    'chromatic_publish',
    'publish',
    'cortex'
  ] });

  expect(jobs_found.length).toEqual(4);
});
