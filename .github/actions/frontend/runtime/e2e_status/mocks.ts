/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const E2E_STATUS_MOCK_STEPS = [
  { name: 'add_result_as_pr_comment' },
  { name: 'get_branch_of_pr' },
  { name: 'set_commit_status' },
  { name: 'force_status_as_success' },
];
