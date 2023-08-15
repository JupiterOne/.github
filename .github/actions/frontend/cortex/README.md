# Frontend - Cortex

This [composite action](./action.yml) is responsible for running Cortex related jobs for Frontend Projects.

## Inputs

This action requires uses the following inputs:

| Name                        | Type    | Default                            | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------------- | --------- | --------------------------------------------------------- |
| `cortex_api_key`            | String  |                                    | True      | The key that allows us to push data to Cortex 

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: cortex
    uses: ./.github/actions/frontend/cortex
    with:
      cortex_api_key: ${{ secrets.CORTEX_API_KEY }}
```
