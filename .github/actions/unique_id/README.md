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
- name: pr_comment
  uses: jupiterone/.github/.github/actions/unique_id
  with:
    sha: Custom message goes here
```
