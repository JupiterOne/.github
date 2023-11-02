# Get Branch

This [composite action](./action.yml) is responsible for returning the name of the pull request branch the comment belongs to.

This is useful for workflows that use pull request comments that are triggered using the `issue_comment` event. The issue_comment event runs on the default branch (usually main or master) of the repository, and **not on the branch of the pull request**. This means that if you are using the issue_comment event to trigger a workflow that performs actions on the branch of the pull request, you will need to take additional steps to reference the correct branch. This action lets you determine the branch associated with the PR, and then in the checkout action reference the appropriate branch (via `with: ref`).

## Inputs

No inputs necessary.

## Outputs

This action returns the following outputs:

| Name                        | Type    | Description                                                   |
| --------------------------- | ------- | ------------------------------------------------------------- |
| `name`                      | String  | The name of the pull request branch the comment belongs to.                                               

## Example Usage

```yaml
jobs:
  get_branch:
    runs-on: ${{ (inputs.fallback_runner && 'ubuntu-latest') || 'scaleset-jupiterone-infra-arm64' }}
    outputs:
      name: ${{ steps.get_branch.outputs.name }}
    steps:
      - id: get_branch
        name: get_branch
        uses: jupiterone/.github/.github/actions/get_branch@v3

  example_job:
    runs-on: ${{ (inputs.fallback_runner && 'ubuntu-latest') || 'scaleset-jupiterone-infra-arm64' }}
    needs: [get_branch]
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ needs.get_branch.outputs.name }}
      - name: other_steps
        # This step will now be run in the context of your branch
```
