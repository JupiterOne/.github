/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const SETUP_ENV_MOCK_STEPS = [
  { name: 'check_for_auth_token' },
  { name: 'setup_node' },
  { name: 'npm_install_prod_deps' },
  { name: 'npm_install_prod_and_dev_deps' },
  { name: 'npm_rebuild' },
];
