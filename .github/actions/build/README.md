# Frontend Runtime - Build

This [composite action](./action.yml) is responsible for running the `build`
command in repos.

## Inputs

No inputs.

## Outputs

No outputs.

## Example Usage

```yaml
steps:
  - uses: actions/checkout@v3
  - name: build
    uses: jupiterone/.github/.github/actions/build
```
