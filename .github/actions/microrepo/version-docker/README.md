# Micro Repo - Version Docker

This [composite action](./action.yml) is responsible for versioning docker, as
in non-npm, packages. This action will create a new commit with the updated
version and push it back to the main branch. It will also create a new tag,
release, and update the changelog.

Monorepos are not supported and NPM packages should use Auto Shipit instead.

## Inputs

This action takes the following inputs:

| Name           | Type   | Default | Required | Description                       |
| -------------- | ------ | ------- | -------- | --------------------------------- |
| `github-token` | String |         | True     | Used to push commits back to main |

## Outputs

No outputs.

## Example Usage

```yaml
steps:
  # Checkout not required
  - name: Release
    uses: ./.github/actions/microrepo/version-docker
```
