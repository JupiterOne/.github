# Default workflow for a utility runtime when a PR is opened


This is the [default workflow](../../frontend_runtime_utility_pr.yml) that is run when a `PR is opened` for a `utility runtime`. It is meant to test the quality and safety of the code being committed.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                                                            |
| --------------------------- | ------- | ---------------------------- | --------- | -------------------------------------------------------------------------------------- |
| `fallback_runner`           | String  | False                        | False      | If true will leverage ubuntu-latest, otherwise will fall back to the J1 in-house runner
| `use_validate`              | Boolean | True                         | False      | Run validation, in most case we want this
| `use_chromatic`             | Boolean | false                        | False      | Run VRT Storybook tests with chromatic
                                                                           
## Secrets

This action takes the following secrets:

| Name                        | Required  | Description                               |
| --------------------------- | --------- | ----------------------------------------- |
| `NPM_TOKEN`                 | True      | A J1 npm.com Publish token
| `CHROMATIC_PROJECT_TOKEN`   | False     | The Chromatic API token

## Example Usage

### Default Flow

#### Usage

```yaml
jobs:
  pr:
    uses: jupiterone/.github/.github/workflows/frontend_runtime_utility_pr.yml@v#
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
```

#### Diagram

```mermaid
graph LR;
    A[start flow];
    B[migration_number];
    C[magic_url];
    D[validate];
    E[security];
    F[pr_comment];

    A --> B;
    A --> D;
    A --> E;
    B --> C;
    A --> F;
```

### With Chromatic

#### Usage

```yaml
jobs:
  pr:
    uses: jupiterone/.github/.github/workflows/frontend_runtime_utility_pr.yml@v#
    with:
      use_chromatic: true
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
      CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

#### Diagram

```mermaid
graph LR;
    A[start flow];
    B[migration_number];
    C[magic_url];
    D[validate];
    E[chromatic_upload];
    F[security];

    A --> B;
    A --> D;
    A --> E;
    A --> F;
    B --> C;
```

