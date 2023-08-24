export const SETUP_ENV_MOCK_STEPS = [
  { name: 'check_for_auth_token' },
  { name: 'setup_node' },
  { name: 'npm_install_prod_deps' },
  { name: 'npm_install_prod_and_dev_deps' },
  { name: 'npm_rebuild' },
];
