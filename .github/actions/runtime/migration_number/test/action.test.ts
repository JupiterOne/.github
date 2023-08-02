import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import path from 'path';

let mockGithub: MockGithub;
beforeEach(async () => {
  mockGithub = new MockGithub({
    repo: {
      testAction: {
        files: [
          {
            src: path.join(__dirname, 'action-test.yml'),
            dest: '.github/workflows/test.yml',
          },
          {
            src: path.resolve(__dirname, '..', 'action.yml'),
            dest: '/action.yml',
          },
          {
            src: path.resolve(__dirname, '..', '..', '..', '..', '..', 'package.json'),
            dest: 'package.json',
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
  const act = new Act(mockGithub.repo.getPath('testAction'));
  const result = await act.runEvent('push');

  expect(result.length).toBe(5);
  expect(result).toMatchObject([
    { name: 'Main actions/checkout@v3', status: 0, output: '' },
    { name: 'Main ./testAction', status: 0, output: '' },
    {
      name: 'Main Get Package Migration Number',
      status: 0,
      output: '',
    },
    {
      name: 'Main print migration_number',
      status: 0,
      output: expect.stringMatching(/migration_number \d*/),
    },
    {
      name: 'Post ./testAction',
      status: 0,
      output: '',
    },
  ]);
});