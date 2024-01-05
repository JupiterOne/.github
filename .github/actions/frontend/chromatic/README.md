# Frontend Runtime - Chromatic

This [composite action](./action.yml) is responsible for building nad publishing
your Storybook to Chromatic and running visual regression tests.

## Inputs

This action takes the following inputs:

| Name                      | Type   | Default | Required | Description             |
| ------------------------- | ------ | ------- | -------- | ----------------------- |
| `github_token`            | String |         | True     | Github access token     |
| `chromatic_project_token` | String |         | True     | The Chromatic API token |
| `publish_chromatic`       | String |         | True     | The Chromatic API token |

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  # Fetch depth 0 required
  - uses: actions/checkout@v3
    with:
      fetch-depth: 0
  - name: validate
    uses: jupiterone/.github/.github/actions/frontend/runtime/chromatic
```
