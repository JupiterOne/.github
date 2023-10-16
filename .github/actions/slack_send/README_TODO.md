# Code QL

This [composite action](./action.yml) is responsible for running CodeQL on the repository.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `language`                  | String  |                              | True      | Specify the language you wish to target. CodeQL supports [ cpp, csharp, go, java, javascript, python, ruby ]
                                                                           
## Outputs

No outputs provided.                                              

## Example Usage

```yaml
steps:
  - name: code_ql
    uses: jupiterone/.github/.github/actions/code_ql@main
    with:
      language: 'javascript'
```

