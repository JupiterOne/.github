# Unique ID

This [composite action](./action.yml) is responsible for generating a unique ID using a timestamp and the current commit SHA.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `sha`                       | String  |                              | True      | The github.sha which is the SHA for a temporary commit created for validating the pull request
                                                                           
## Outputs

This action returns the following outputs:

| Name                        | Type    | Description                                               |
| --------------------------- | ------- | --------------------------------------------------------- |
| `unique_id`                 | String  | An ID that is unique to both the repo and commit                                          

## Example Usage

```yaml
steps:
  - name: unique_id
    uses: jupiterone/.github/.github/actions/unique_id
    with:
      sha: ${{ github.sha }}
  - name: echo_unique_id
    run: |
      echo ${{ steps.unique_id.outputs.unique_id }}
```
