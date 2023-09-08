/*
This file is automatically leveraged when tests are run to determine which
steps should be skipped in the composite action. If these steps were not
mocked, they would break the test.
*/
export const CODE_QL_MOCK_STEPS = [
  { name: 'initialize_code_ql' },
  { name: 'auto_build' },
  { name: 'analyze' },
];
