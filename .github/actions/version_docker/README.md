# Version Docker

This [composite action](./action.yml) is responsible for versioning docker, as
in non-npm, packages. This action will create a new commit with the updated
version and push it back to the main branch. It will also create a new tag,
release, and update the changelog.

**Note:** Monorepos are not supported and NPM packages should use Auto Shipit instead.

## Inputs

This action takes the following inputs:

| Name           | Type   | Default | Required | Description                       |
| -------------- | ------ | ------- | -------- | --------------------------------- |
| `github_-_token` | String |         | True     | Used to push commits back to main |

## Outputs

No outputs.

## Example Usage

```yaml
steps:
  # Checkout not required
  - name: version_and_release
    uses: jupiterone/.github/.github/actions/version_docker
    with:
      github_token: ${{ secrets.GITHUB_TOKEN }}
```
