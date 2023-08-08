# .github

## Workflows

The following workflows are for the entire JupiterOne organization, intending to consolidate t `JupiterOne Organization-Wide GitHub`

### Frontend Workflows
- [frontend_runtime_application_pr](.github/workflows/docs/frontend/frontend_runtime_application_pr.md)
- [frontend_runtime_e2e_trigger_response](.github/workflows/docs/frontend/frontend_runtime_e2e_trigger_response.md)

### Backend Workflows
- [publish_docker_ghcr](.github/workflows/docs/backend/publish_docker_ghcr.md)
- [publish_integration_docker_image](.github/workflows/docs/backend/publish_integration_docker_image.md)

## Composite Actions

The workflows above take advantage of the composite actions listed below, leveraging composition to execute those jobs that pertain to the workflow. The actions below enable us to consolidate repeatable jobs into a single location. This makes our workflows DRY, easier to reason about and more stable.

### Frontend Workflows

- [setup_env](.github/actions/frontend/setup_env/README.md)
- [chromatic](.github/actions/frontend/runtime/chromatic/README.md)
- [e2e_prepare](.github/actions/frontend/runtime/e2e_prepare/README.md)
- [e2e_run](.github/actions/frontend/runtime/e2e_run/README.md)
- [e2e_status](.github/actions/frontend/runtime/e2e_status/README.md)
- [e2e_trigger_remote_tests](.github/actions/frontend/runtime/e2e_trigger_remote_tests/README.md)
- [magic_url](.github/actions/frontend/runtime/magic_url/README.md)
- [migration_number](.github/actions/frontend/runtime/migration_number/README.md)
- [validate](.github/actions/frontend/runtime/validate/README.md)

## Local Testing

We are using [act-js](https://github.com/kiegroup/act-js) and [mock-github](https://www.npmjs.com/package/@kie/mock-github#mockgithub) to test our workflows and composite actions. These tests are intended to simplify development, speed up the feedback loop, and bring more stability to our flows and actions. To run the tests, please execute the following command:

```
npm test
```