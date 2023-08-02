import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import path from 'path';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub({
    repo: {
      frontend_runtime_e2e_trigger_response: {
        files: [
          {
            src: path.resolve(__dirname, '..', 'frontend_runtime_e2e_trigger_response.yml'),
            dest: '.github/workflows/test.yml',
          },
        ],
      },
    },
  });

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

test('test workflow', async () => {
  const act = new Act(mockGithub.repo.getPath('frontend_runtime_e2e_trigger_response'));
  const result = await act.runEvent('workflow_call');

  // expect(result.length).toBe(2);
  expect(result).toStrictEqual([
    { name: 'Main actions/checkout@v2', status: 0, output: '' },
    { name: 'Main ./.github/actions/frontend/runtime/migration_number', status: 1, output: '' },
  ]);
});
