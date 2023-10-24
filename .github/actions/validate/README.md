# Frontend Runtime - Validate

This [composite action](./action.yml) is responsible for running the `validation` command in a frontend repo. Additionally it is responsible for running the `remote-types test` command if applicable to determine if any breaking changes were made.

## Inputs

No inputs necessary.                                                       

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  # Fetch depth 2 required
  - uses: actions/checkout@v3
    with:
      fetch-depth: 2
  - name: validate
    uses: jupiterone/.github/.github/actions/frontend/runtime/validate
```
