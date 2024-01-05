/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const PR_COMMENT_MOCK_STEPS = [
  { name: 'find_comment' },
  { name: 'add_pr_comment_once' },
  { name: 'add_pr_comment_always' },
];
