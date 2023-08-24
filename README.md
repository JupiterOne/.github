# .github

## Workflows

The following workflows are for the entire JupiterOne organization.

### Frontend Workflows

#### Runtime

- [frontend_runtime_application_pr](.github/workflows/docs/frontend/frontend_runtime_application_pr.md)
- [frontend_runtime_utility_pr](.github/workflows/docs/frontend/frontend_runtime_utility_pr.md)
- [frontend_runtime_e2e_trigger_response](.github/workflows/docs/frontend/frontend_runtime_e2e_trigger_response.md)
- [frontend_runtime_deploy](.github/workflows/docs/frontend/frontend_runtime_deploy.md)

#### NPM Packages

- [frontend_npm_pr](.github/workflows/docs/frontend/frontend_npm_pr.md)
- [frontend_npm_release](.github/workflows/docs/frontend/frontend_npm_release.md)

### Backend Workflows
- [publish_docker_ghcr](.github/workflows/docs/backend/publish_docker_ghcr.md)
- [publish_integration_docker_image](.github/workflows/docs/backend/publish_integration_docker_image.md)

## Composite Actions

The workflows above take advantage of the composite actions listed below, leveraging composition to execute those jobs that pertain to the workflow. The actions below enable us to consolidate repeatable jobs into a single location. This makes our workflows DRY, easier to reason about and more stable.

### Frontend

#### Common

- [setup_env](.github/actions/frontend/setup_env/README.md)
- [chromatic](.github/actions/frontend/chromatic/README.md)

#### Runtime

- [e2e_prepare](.github/actions/frontend/runtime/e2e_prepare/README.md)
- [e2e_run](.github/actions/frontend/runtime/e2e_run/README.md)
- [e2e_status](.github/actions/frontend/runtime/e2e_status/README.md)
- [e2e_trigger_remote_tests](.github/actions/frontend/runtime/e2e_trigger_remote_tests/README.md)
- [magic_url](.github/actions/frontend/runtime/magic_url/README.md)
- [migration_number](.github/actions/frontend/runtime/migration_number/README.md)
- [validate](.github/actions/frontend/runtime/validate/README.md)

#### NPM Packages
- [validate](.github/actions/frontend/npm/validate/README.md)
- [release](.github/actions/frontend/npm/release/README.md)

### 

When using composite actions, you will need to perform the following checkouts:

```
# Checks out the global repository where the composite actions live (jupiterone/.github),
# without this, the composite action will not be found as each job is run in virtual container:
- uses: actions/checkout@v3
  if: ${{ inputs.use_global_actions }}
  with:
    repository: jupiterone/.github
    sparse-checkout: .github/actions

# Checks out the repository where the workflow is being run
- uses: actions/checkout@v3

# You can now use the composite action
- name: some_composite_action
  uses: ./.github/actions/some_composite_action
```

## Local Testing

We are using [act-js](https://github.com/kiegroup/act-js) and [mock-github](https://www.npmjs.com/package/@kie/mock-github#mockgithub) to test our workflows and composite actions. These tests are intended to simplify development, speed up the feedback loop, and bring more stability to our flows and actions. To run the tests, please execute the following command:

```
npm test
```

### Enable Logging

The following produces a log file called [name].log in the `repo` directory.

```
ACT_LOG=true npm test
```

### Strategy

#### Skipping Steps

Many of our steps cannot and should not be run during testing (installing npm packages, running cypress, etc.) and would break if we were to run them locally. To address this issue, you can define a `mocks.ts` file in your composite actions. This file should define the list of steps in your action that `should be skipped` during testing:

```
// .github/actions/frontend/chromatic/mocks.ts
export const CHROMATIC_MOCK_STEPS = [
  { name: 'chromatic_upload' },
  { name: 'chromatic_publish' },
];
```

When necessary you can also pass in `mockSteps` via the `runWorkflow` or `runCompositeAction` commands.

**Mock composite action via runCompositeAction**

```
const results = await runCompositeAction({ act, repoName, mockGithub, mockSteps: {
  { name: 'chromatic_upload' },
  { name: 'chromatic_publish' },
}});
```

**Mock entire composite action via runWorkflow**

```
const results = await runWorkflow({ act, repoName, mockGithub, mockSteps: {
  chromatic_upload_job: [
    {
      // Mocks the entire composite action
      name: 'chromatic_upload',
      mockWith: `echo "hello world"`,
    }
  ],
}});
```

**Mock individual steps of composite action via runWorkflow**

```
const results = await runWorkflow({ act, repoName, mockGithub, mockSteps: {
  chromatic_upload_job: [
    {
      // Mocking the individual steps in a composite action
      name: 'chromatic_upload',
      mockCompositeSteps:  [
        { name: 'chromatic_upload' },
        { name: 'chromatic_publish' },
      ]
    }
  ],
}});
```

### Mapping Workflow Inputs To Composite Actions

As workflows grow over time, they may end up with a considerable number of inputs. We want to make sure those inputs get mapped to the correct composite actions. This is accomplished using the following approach.

If a composite action leverages inputs, you will see one its first steps has a name of `[name]_inputs` ([example](.github/actions/frontend/runtime/e2e_prepare/action.yml#L25)). This step is responsible for logging out the various inputs that are being passed to the action.

Then in our tests we are able to target these inputs and verify that the appropriate inputs are being mapped to the correct composite actions.

```
const test_inputs = getTestResult({ results, name: 'test_inputs' });

expect(test_inputs.output).toContain(`example_input=hello world`);
```

#### Composite Actions

When it comes to testing a composite action, you will notice the action has a test directory containing at least two files:
- `test/action_test.yml` - A composite action can not be triggered by itself like a workflow. This is a workflow file that utilizes the composition action ([example](.github/actions/frontend/runtime/e2e_prepare/test/action_test.yml)).
- `test/action.test.ts` - This is the test itself that calls `action_test.yml`.

Note: You must ensure that `name` of the job and the `path` within in the `action_test.yml` match the `repoName` defined in the `action.test.ts`, otherwise the test will fail.

Note: All booleans in a composite action must leverage fromJSON to ensure the value are treated as booleans and not strings. See issue here: https://github.com/actions/runner/issues/1483
