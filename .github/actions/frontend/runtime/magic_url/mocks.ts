/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const MAGIC_URL_MOCK_STEPS = [
  { name: 'npm_build' },
  { name: 'configure_aws_credentials' },
  { name: 'deploy_artifacts_to_s3' },
  { name: 'get_branch_of_pr' },
  { name: 'show_magic_url_in_pr' },
];
