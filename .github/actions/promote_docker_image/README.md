# Promote Docker Image

This [composite action](./action.yml) is responsible copying docker images from one ECR registry to another (typically from jupiterone-infra to the destination environment where the app is run).

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `project_name`               | String  |                              | True      | The project name
| `codeowner`                  | String  |                              | True      | The designated project codeowners (CODEOWNERS file)
| `image_name`                 | String  |                              | True      | The name of the image to copy
| `source_account_id`          | String  |                              | False     | The AWS account id of the source ECR registry
| `source_region`              | String  |                              | False     | The AWS region of the source ECR registry
| `target_account_id`          | String  |                              | True      | The AWS account id of the target ECR registry
| `target_region`              | String  |                              | True      | The AWS region of the target ECR registry
| `target_environment`         | String  |                              | True      | The target Jupiterone environment to deploy to

## Outputs

No outputs provided.

## Example Usage

```yaml
- name: promote_docker_image
  uses: jupiterone/.github/.github/actions/promote_docker_image@main
  if: always()
  with:
    image-name: builder-node18-test
    image-tags: 4-arm64, 4.7.1-arm64, 4.7-arm64
    destination-account-id: 564077667165
    destination-region: us-east-1
```
