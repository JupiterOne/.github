# Frontend NPM - Validate

This [composite action](./action.yml) is responsible for running validation on a frontend npm package.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `use_esbuild`               | Boolean | False                        | False     | If using esbuild, ensure its required build scripts are run                                                   

## Outputs

No outputs provided.

## Example Usage

### Default

```yaml
steps:
  - name: validate
    uses: ./.github/actions/frontend/npm/validate
```

### Esbuild

```yaml
steps:
  - name: validate
    uses: ./.github/actions/frontend/npm/validate
    with:
      use_esbuild: ${{ inputs.use_esbuild }}
```
