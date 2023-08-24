/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const E2E_PREPARE_MOCK_STEPS = [
  { name: 'configure_aws_credentials' },
  { name: 'update_artemis_config' },
  { name: 'launch_artemis' },
];
