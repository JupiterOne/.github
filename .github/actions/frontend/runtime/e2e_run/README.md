# Frontend Runtime - E2E Run

This [composite action](./action.yml) is responsible for running the `E2E tests` defined in a repo.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                            | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------------- | --------- | --------------------------------------------------------- |
| `artemis_account_name`      | String  |                                    | True      | The account name extracted from the artemis-run.json file
| `artemis_account_subdomain` | String  |                                    | True      | The account subdomain extracted from the artemis-run.json file
| `artemis_account_id`        | String  |                                    | True      | The id extracted from the artemis-run.json file
| `artemis_users`             | String  |                                    | True      | The users extracted from the artemis-run.json file
| `commit_info_sha`           | String  | github.sha                         | True      | The sha associated with the PR that triggered the e2e_run
| `commit_info_pr_number`     | String  | github.event.pull_request.number   | True      | The PR number associated with the PR that triggered the e2e_run
| `commit_info_pr_title`      | String  | github.event.pull_request.title    | True      | The PR title associated with the PR that triggered the e2e_run
| `commit_info_branch`        | String  | github.event.pull_request.head.ref | True      | The branch name associated with the PR that triggered the e2e_run
| `commit_info_author`        | String  | $(git show -s --pretty=%an)        | False     | The author name associated with the PR that triggered the e2e_run
| `commit_info_repo_name`     | String  | github.event.repository.name       | True      | The repo name associated with the PR that triggered the e2e_run
| `cypress_container`         | String  |                                    | True      | The index of the Cypress container being used (see the [docs](https://github.com/cypress-io/github-action#parallel) on running tests in parallel)
| `cypress_mailinator_api_key`| String  |                                    | False     | The [mailinator api key](https://www.mailinator.com/api/) needed when going through the default login flow
| `cypress_record_key`        | String  |                                    | True      | The [record key](https://docs.cypress.io/guides/cloud/account-management/projects) associated with the project in Cypress
| `cypress_project_id`        | String  |                                    | True      | The [project ID](https://docs.cypress.io/guides/cloud/account-management/projects) associated with the project in Cypress
| `cypress_password`          | String  |                                    | False     | The password of the E2E username (if applicable)
| `e2e_filter_tags`           | String  |                                    | True      | Tests will be filtered based on the tags defined here (see the [docs](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/tags.md) on leveraging tags)
| `e2e_pass_on_error`         | String  |                                    | False     | Pass the workflow even if the E2E test fail
| `github_token`              | String  |                                    | True      | Github access token
| `migration_number`          | String  |                                    | True      | The migration number defined in the root package.json
| `spec_to_run`               | String  | cypress/e2e/**/*.feature           | False     | Used to determine which test to run
                                                                           
## Outputs

This action returns the following outputs:

| Name                        | Type    | Description                                               |
| --------------------------- | ------- | --------------------------------------------------------- |
| `test_passed`               | String  | The status of the e2e_run (true if passed, false if not)

## Example Usage

### Default

```yaml
steps:
  - name: validate
    uses: jupiterone/.github/.github/actions/frontend/runtime/e2e_run
    with:
      artemis_account_name: ${{ needs.e2e_prepare.outputs.artemis_account_name }}
      artemis_account_id: ${{ needs.e2e_prepare.outputs.artemis_account_id }}
      artemis_account_subdomain: ${{ needs.e2e_prepare.outputs.artemis_account_subdomain }}
      artemis_users: ${{ needs.e2e_prepare.outputs.artemis_users }}
      cypress_container: ${{ matrix.containers }}
      cypress_tag: ${{ github.event.repository.name }},${{ github.event_name }}
      cypress_mailinator_api_key: ${{ secrets.CYPRESS_MAILINATOR_API_KEY }}
      cypress_record_key: ${{ secrets.CYPRESS_RECORD_KEY }}
      cypress_project_id: ${{ secrets.CYPRESS_PROJECT_ID }}
      cypress_password: ${{ secrets.CYPRESS_PASSWORD }}
      e2e_filter_tags: ${{ inputs.e2e_filter_tags }}
      e2e_prepare_status: ${{ needs.e2e_prepare.result }}
      e2e_pass_on_error: ${{ inputs.e2e_pass_on_error }}
      github_token: ${{ secrets.GITHUB_TOKEN }}
      migration_number: ${{ needs.migration_number.outputs.migration }}
      spec_to_run: ${{ inputs.spec_to_run }}
```


### Triggered Externally

The e2e_run can be triggered by another repo (see `frontend_runtime_e2e_trigger_response.yml`). As such it's necessary to make the `commit_info_*` props configurable to ensure the run in Cypress reflects the appropriate details of the PR it's associated with.

```yaml
permissions:
  write-all
steps:
  - name: validate
    uses: jupiterone/.github/.github/actions/frontend/runtime/e2e_run
    with:
      # ...see-props-above
      commit_info_sha: ${{ inputs.external_pr_sha }}
      commit_info_pr_number: ${{ inputs.external_pr_number }}
      commit_info_pr_title: ${{ inputs.external_pr_title }}
      commit_info_branch: ${{ inputs.external_pr_branch }}
      commit_info_author: ${{ inputs.external_pr_author }}
      commit_info_repo_name: ${{ inputs.external_pr_repo_name }}
```
