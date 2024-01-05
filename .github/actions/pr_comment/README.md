# PR Comment

This [composite action](./action.yml) is responsible for leaving a comment on a
PR. By default it will only leave a comment once of the same message (i.e. no
duplicates), however this can be overridden.

## Inputs

This action takes the following inputs:

| Name       | Type    | Default | Required | Description                                                     |
| ---------- | ------- | ------- | -------- | --------------------------------------------------------------- |
| `message`  | String  |         | True     | The message to leave in the PR comment                          |
| `run_once` | Boolean | True    | False    | Determines whether to leave one comment or add one on each call |

## Outputs

No outputs provided.

## Example Usage

```yaml
- name: pr_comment
  uses: jupiterone/.github/.github/actions/pr_comment
  with:
    message: Custom message goes here
```
