# Frontend Runtime - Magic Url

This [composite action](./action.yml) is responsible for deploying the built artifacts to the appropriate S3 bucket, and then showing a `magic url link` in the PR as a status update.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `migration_number`          | String  |                              | True      | The migration number defined in the root package.json      
| `magic_url_route`           | String  | '/'                          | False     | The relative route the magic url should go to
| `github_token`              | String  |                              | True      | Github access token                                               

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: magic_url
    uses: ./.github/actions/frontend/runtime/magic_url
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
      migration_number: ${{ needs.migration_number.outputs.migration }}
      magic_url_route: ${{ inputs.magic_url_route }}
```
