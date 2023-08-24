/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const E2E_RUN_MOCK_STEPS = [
  { name: 'get_author_name' },
  { name: 'cypress_run' },
];
