import { MockGithub } from '@kie/mock-github';
import { Act } from '@kie/act-js';
import { getCompositeActionConfig, runCompositeAction } from 'tests/utils/setup';
import { getTestResult } from 'tests/utils/helpers';

const mockServer = require('mockttp').getLocal();

async function mockAwsSts() {
  await mockServer.start(8000);
  await mockServer.forAnyRequest().thenReply(200, 'Hello World!');
}

mockAwsSts();

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
    target: 'http://localhost:8000',
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {});

proxy.listen(8080);


const repoName = 'promote_docker_image';

let mockGithub: MockGithub;

beforeEach(async () => {
  mockGithub = new MockGithub(getCompositeActionConfig({ directory: __dirname, repoName }));

  await mockGithub.setup();
});

afterEach(async () => {
  await mockGithub.teardown();
});

// mockAWS.mock('STS', '*', (params, callback) => {
//   console.log('getCallerIdenity called with', params);
//   callback(null, 'success');
// });

test('The correct source account credentials are configured', async () => {
  const results = await runCompositeAction({
    act: new Act(mockGithub.repo.getPath(repoName)),
    repoName,
    originDirectory: __dirname
  });

  const result = getTestResult({
    results,
    name: 'configurate_source_account_aws_credentials'
  });

  console.log(result);
  expect(result).toBeDefined();
});
