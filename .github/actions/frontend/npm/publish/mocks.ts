/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const NPM_PUBLISH_MOCK_STEPS = [
  { name: 'add_auto_to_globals' },
  { name: 'deploy_to_npm' },
];
