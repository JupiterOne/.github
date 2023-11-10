/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const VERSION_ARTIFACT_MOCK_STEPS = [
  { name: 'checkout_with_automation_pat' },
  { name: 'run_auto_versioning_and_release' },
];
