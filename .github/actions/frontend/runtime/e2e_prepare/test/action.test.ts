import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import {
  getCompositeActionConfig,
  runCompositeAction,
} from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';
import { join } from 'node:path';
import artemisRun from './artemis-run.json';

const repoName = 'e2e_prepare';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(
    getCompositeActionConfig({
      directory: __dirname,
      repoName,
      additionalFiles: [
        {
          src: join(__dirname, 'artemis-run.json'),
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

test('output of artemis_info returns correct results based off artemis-run.json', async () => {
  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname,
  });

  const results_artemis_account_name = getTestResult({
    results,
    name: 'results_artemis_account_name',
  });
  const results_artemis_account_subdomain = getTestResult({
    results,
    name: 'results_artemis_account_subdomain',
  });
  const results_artemis_account_id = getTestResult({
    results,
    name: 'results_artemis_account_id',
  });
  const results_artemis_users = getTestResult({
    results,
    name: 'results_artemis_users',
  });
  const results_artemis_full_output = getTestResult({
    results,
    name: 'results_artemis_full_output',
  });

  expect(results_artemis_account_name.output).toEqual(
    artemisRun[0].metadata.accountName
  );
  expect(results_artemis_account_subdomain.output).toEqual(
    artemisRun[0].metadata.accountSubdomain
  );
  expect(results_artemis_account_id.output).toEqual(artemisRun[0].id);
  expect(results_artemis_users.output).toContain(
    artemisRun[1].metadata.token.tokenSecret
  );
  expect(results_artemis_users.output).toContain(
    artemisRun[1].metadata.token.tokenCsrf
  );
  expect(results_artemis_users.output).toContain(
    artemisRun[1].metadata.groupName
  );
  expect(results_artemis_full_output.output).toEqual(
    JSON.stringify(artemisRun)
  );
});
