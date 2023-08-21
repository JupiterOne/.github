# Name


This [composite action](./action.yml) is responsible for...

## Inputs

This action requires uses the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `test`                      | String  | false                        | False     | ... 
                                                                           
## Outputs

This action requires uses the following outputs:

| Name                        | Type    | Description                                               |
| --------------------------- | ------- | --------------------------------------------------------- |
| `migration`                 | String  | ...                                               


## Example Usage

```yaml
steps:
  - name: validate
    uses: ./.github/actions/frontend/runtime/validate
```

