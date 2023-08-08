# Frontend Runtime - Setup Environment

This [composite action](./action.yml) is responsible for checking out the repo, setting up node, and installing production dependencies. 

## Inputs

No inputs necessary.                                                       

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: setup_env
    uses: ./.github/actions/frontend/setup_env
```
