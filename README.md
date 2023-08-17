# .github

## Workflows

The following workflows are for the entire JupiterOne organization.

### Frontend Workflows
- [frontend_runtime_application_pr](.github/workflows/docs/frontend/frontend_runtime_application_pr.md)
- [frontend_runtime_utility_pr](.github/workflows/docs/frontend/frontend_runtime_utility_pr.md)
- [frontend_runtime_e2e_trigger_response](.github/workflows/docs/frontend/frontend_runtime_e2e_trigger_response.md)
- [frontend_runtime_deploy](.github/workflows/docs/frontend/frontend_runtime_deploy.md)

### Backend Workflows
- [publish_docker_ghcr](.github/workflows/docs/backend/publish_docker_ghcr.md)
- [publish_integration_docker_image](.github/workflows/docs/backend/publish_integration_docker_image.md)

## Composite Actions

The workflows above take advantage of the composite actions listed below, leveraging composition to execute those jobs that pertain to the workflow. The actions below enable us to consolidate repeatable jobs into a single location. This makes our workflows DRY, easier to reason about and more stable.

### Frontend Composite Actions

- [setup_env](.github/actions/frontend/setup_env/README.md)
- [chromatic](.github/actions/frontend/runtime/chromatic/README.md)
- [e2e_prepare](.github/actions/frontend/runtime/e2e_prepare/README.md)
- [e2e_run](.github/actions/frontend/runtime/e2e_run/README.md)
- [e2e_status](.github/actions/frontend/runtime/e2e_status/README.md)
- [e2e_trigger_remote_tests](.github/actions/frontend/runtime/e2e_trigger_remote_tests/README.md)
- [magic_url](.github/actions/frontend/runtime/magic_url/README.md)
- [migration_number](.github/actions/frontend/runtime/migration_number/README.md)
- [validate](.github/actions/frontend/runtime/validate/README.md)

### 

When using composite actions, you will need to perform the following checkouts:

```
# Checks out the repository where the workflow is being run
- uses: actions/checkout@v3

# Checks out the global repository where the composite actions live (jupiterone/.github),
# without this, the composite action will not be found as each job is run in virtual container:
- uses: actions/checkout@v3
  if: ${{ inputs.use_global_actions }}
  with:
    repository: jupiterone/.github
    sparse-checkout: .github/actions

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

Many of our steps cannot and should not be run during testing (installing npm packages, running cypress, etc.) and would break if we were to run them locally. You can add the following conditional to a step that will enable you to skip it when tests are running.

```
if: ${{ !env.TEST }}
```

The `env.TEST` variable is set to true in the [setup.ts file](tests/utils/setup.ts).

#### Mock Individual Steps

By default steps containing the conditional `if: ${{ !env.TEST }}` will automatically get skipped. However there are times when you may wish to turn off this default functionality so you can mock an individual step. To accomplish this you will want to set the following in your `runWorkflow` command:
- `mockSteps: false` - Prevents `env.TEST` from being set, allowing those steps to run.
- `mockSteps: { ... }` - You will then want to mock out the various steps in question to mimic the flow you are hoping to test. Please see the [following documentation](https://github.com/kiegroup/act-js#mocking-steps) from `act-js` for a better understanding of how this works.

Here is an example where we wanted to mock the `e2e_run` step so we could call `exit 1` and simulate an actual failure in that step. For all the other steps you will notice we simply mock them with an empty echo, which allows these steps to run without failures.

```
const act = new Act(mockGithub.repo.getPath(repoName));

act.setInput('use_e2e', 'true');
act.setInput('e2e_pass_on_error', 'true');

const results = await runWorkflow({ act, repoName, mockSteps: false, config: {
  mockSteps: {
    migration_number: [ { name: 'migration_number', mockWith: 'echo ""' } ],
    validate: [ { name: 'validate', mockWith: 'echo ""' } ],
    magic_url: [ { name: 'magic_url', mockWith: 'echo ""' } ],
    e2e_prepare: [ { name: 'e2e_prepare', mockWith: 'echo ""' } ],
    
    // Purposefully fail to test e2e_pass_on_error
    e2e_run: [{
      name: 'e2e_run',
      mockWith: 'exit 1',
    }],
  }
}});

const jobs_found = getTestResults({ results, name: 'e2e_status' });

expect(jobs_found).not.toBeUndefined();
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

#### Additional Files

...
