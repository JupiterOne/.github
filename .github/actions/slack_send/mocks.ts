/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const SLACK_SEND_MOCK_STEPS = [
  { name: 'notify_slack' },
];
