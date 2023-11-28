import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const repoName = 'slack_notifier';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

const slackBotToken = "mytoken";
const slackChannelId = "mychannelid";

test('Inputs are set correctly', async () => {
  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname
  });

  const result = getTestResult({
    results,
    name: 'prepare_inputs'
  });

  const expectedOutput = `slack_bot_token=${slackBotToken}\nslack_channel_id=${slackChannelId}`;
  expect(result.output).toEqual(expectedOutput)
});
