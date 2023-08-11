# Frontend Runtime - Extract Migration Number

This [composite action](./action.yml) is responsible for extracting the `migration` number from the root `package.json` file.

## Inputs

No inputs necessary.

## Outputs

This action requires uses the following inputs:

| Name                        | Type    | Description                                                   |
| --------------------------- | ------- | ------------------------------------------------------------- |
| `migration`                 | String  | Returns the migration number defined in the root package.json                                               

## Example Usage

```yaml
steps:
  # Call composite action
  - id: migration_number
    uses: ./.github/actions/frontend/runtime/migration_number
  # Print out returned migration number
  - name: print_migration_number
    run: echo migration_number ${{ steps.migration_number.outputs.migration }}
    shell: bash
```

#### Diagram

```mermaid
graph LR;
    A[npm_build];
    B[configure_aws_credentials];
    C[deploy_artifacts_to_s3];
    D[show_magic_url_in_pr];

    A --> B --> C --> D;
```
