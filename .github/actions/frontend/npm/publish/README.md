# Frontend NPM - Release

This [composite action](./action.yml) is responsible for deploying a frontend
npm package.

## Inputs

This action takes the following inputs:

| Name          | Type    | Default | Required | Description                                                 |
| ------------- | ------- | ------- | -------- | ----------------------------------------------------------- |
| `use_esbuild` | Boolean | False   | False    | If using esbuild, ensure its required build scripts are run |
| `auto_token`  | String  |         | True     | Used for publishing the GitHub release and creating labels  |

## Outputs

No outputs provided.

## Example Usage

### Default

```yaml
steps:
  - uses: jupiterone/.github/.github/actions/frontend/npm/release
    with:
      auto_token: ${{ secrets.AUTO_GITHUB_PAT_TOKEN }}
```

### Esbuild

```yaml
steps:
  - uses: jupiterone/.github/.github/actions/frontend/npm/release
    with:
      use_esbuild: ${{ inputs.use_esbuild }}
      auto_token: ${{ secrets.AUTO_GITHUB_PAT_TOKEN }}
```
