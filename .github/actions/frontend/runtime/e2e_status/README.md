# Frontend Runtime - E2E Status

This [composite action](./action.yml) is responsible for reporting the status of
the E2E run as both a comment on the PR as well as updating the status check.
Specifically it is configurable to allow a PR to still be merged even if the E2E
tests fail (if `e2e_pass_on_error: true`). By default this job is never reached
if E2E tests fail and `e2e_pass_on_error` is set to `false`.

## Inputs

This action takes the following inputs:

| Name                | Type    | Default | Required | Description                                                                                       |
| ------------------- | ------- | ------- | -------- | ------------------------------------------------------------------------------------------------- |
| `github_token`      | String  |         | True     | Github access token                                                                               |
| `e2e_pass_on_error` | Boolean | False   | False    | Pass the workflow even if the E2E test fail. Should be defined as an input at the workflow level. |

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: e2e_status
    uses: jupiterone/.github/.github/actions/frontend/runtime/e2e_status
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      e2e_pass_on_error: ${{ inputs.e2e_pass_on_error }}
```
