# Frontend Runtime - Test Remote Types

This [composite action](./action.yml) is responsible for testing the remote
types for a runtime and identifying breaking changes.

## Inputs

No inputs necessary.

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: remote_types_install
    uses: jupiterone/.github/.github/actions/frontend/runtime/remote_types_tests
```
