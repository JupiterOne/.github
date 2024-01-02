# Default workflow for a provision only repo when a PR is merged to main triggering the release flow

This is the [default workflow](../../provision_only_release.yml) that is run when a `PR is merge` for an `provision only` repo. This workflow will create a new commit with the updated version and push it back to the main branch. It will also create a new tag, release, and update the changelog.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                                                            |
| --------------------------- | ------- | ---------------------------- | --------- | -------------------------------------------------------------------------------------- |
| `fallback_runner`            | String  | False                        | False      | If true will leverage ubuntu-latest, otherwise will fall back to the J1 in-house runner
                                                                           
## Secrets

This action takes the following secrets:

| Name                        | Required  | Description                               |
| --------------------------- | --------- | ----------------------------------------- |
| `NPM_TOKEN`                 | True      | A J1 npm.com Publish token
| `AUTO_GITHUB_PAT_TOKEN`     | True      | This is a GitHuh PAT that let's auto write back to main after npm versioning

## Example Usage

### Default Flow

#### Usage

```yaml
jobs:
  release:
    uses: jupiterone/.github/.github/workflows/provision_only_release.yml@v#
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
      AUTO_GITHUB_PAT_TOKEN: ${{ secrets.AUTO_GITHUB_PAT_TOKEN }}
```

#### Diagram

```mermaid
graph LR;
    A[start flow];
    B[validate];
    D[version_artifact];

    A --> B;
    B --> D;
```

