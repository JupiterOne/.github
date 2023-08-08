# Frontend Runtime - E2E Prepare

This [composite action](./action.yml) is responsible for executing [Artemis](https://github.com/JupiterOne/artemis) and obtaining the necessary information needed for logging in via the account/user created.

## Inputs

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `e2e_artemis_config_path`   | String  | cypress/artemis-config.yaml  | False     | Used to determine the path to the artemis config file
| `userCount`                 | String  |                              | True      | The number of tests that you want Cypress to run in parallel (obtained via `$(echo '${{ inputs.e2e_containers }}' | jq '. | length')`)

## Outputs

This action requires uses the following outputs:

| Name                        | Type    | Description                                               |
| --------------------------- | ------- | --------------------------------------------------------- |
| `artemis_account_name`      | String  | The account name extracted from the artemis-run.json file
| `artemis_account_subdomain` | String  | The account subdomain extracted from the artemis-run.json file
| `artemis_account_id`        | String  | The id extracted from the artemis-run.json file
| `artemis_users`             | String  | The users extracted from the artemis-run.json file

## Example Usage

```yaml
steps:
  - name: e2e_prepare
    uses: ./.github/actions/frontend/runtime/e2e_prepare
  - name: e2e_prepare_results
    run: |
      echo ${{ steps.e2e_prepare.outputs.artemis_account_name }}
      echo ${{ steps.e2e_prepare.outputs.artemis_account_subdomain }}
      echo ${{ steps.e2e_prepare.outputs.artemis_account_id }}
      echo ${{ steps.e2e_prepare.outputs.artemis_users }}
    shell: bash
```
