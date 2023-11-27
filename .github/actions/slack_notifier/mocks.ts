/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const SLACK_NOTIFIER_RUN_MOCK_STEPS = [
  { name: 'send_workflow_result_to_slack' },
];
