# Frontend Runtime - E2E Pending Status

This [composite action](./action.yml) is responsible for reporting that the E2E tests have begun and are pending via a status check in the PR, providing a quick feedback loop for developers.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `github_token`              | String  |                              | True      | Github access token

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: e2e_status
    uses: jupiterone/.github/.github/actions/frontend/runtime/e2e_status
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
```
