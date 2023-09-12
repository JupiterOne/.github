# Micro Repo - Version Non NPM

This [composite action](./action.yml) is responsible for versioning non-npm
packages. This action will create a new commit with the updated version and push
it back to the main branch. It will also create a new tag, release, and update
the changelog.

Monorepos are not supported and NPM packages should use Auto Shipit instead.

## Inputs

This action takes the following inputs:

| Name           | Type   | Default | Required | Description                       |
| -------------- | ------ | ------- | -------- | --------------------------------- |
| `github-token` | String |         | True     | Used to push commits back to main |

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  # Checkout not required
  - name: validate
    uses: ./.github/actions/microrepo/version-non-npm
```
