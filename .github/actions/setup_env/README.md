# Setup Environment

This [composite action](./action.yml) is responsible for setting up node and installing production dependencies. 

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `use_dev`                   | Boolean | False                        | False     | If true, will install dev dependencies.                                     

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: setup_env
    uses: jupiterone/.github/.github/actions/frontend/setup_env
```
