## Publish Integration Image to Docker Hub

[This workflow](https://github.com/JupiterOne/.github/blob/main/.github/workflows/publish_integration_docker_image.yaml)
builds and publishes graph integration project to Docker Hub. It is recommended
that you only run this workflows on commits to your main branch, and on pushed
tags following semver syntax. It need not run on PRs.

### Inputs

This action accept the following inputs:

| Name               | Type    | Description                                                                                                                                                                                                                                                                                                                              |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runs-on`          | String  | What Github runner should be used (defaults to ubuntu-latest)                                                                                                                                                                                                                                                                            |
| `package-name`     | String  | Name of package to publish to Docker Hub                                                                                                                                                                                                                                                                                                 |
| `push-to-registry` | Boolean | Determines if the built image should be pushed to the registry (will only push on a merge by default). Be sure this is a statement that evaluates to a boolean, as there are some [known issues](https://medium.com/@sohail.ra5/github-actions-passing-boolean-input-variables-to-reusable-workflow-call-42d39bf7342e) surrounding this. |

### Secrets

We HIGHLY recommend that these values are derived using your repos' action
secrets

| Name           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `runs-on`      | What Github runner should be used (defaults to ubuntu-latest) |
| `package-name` | Name of package to publish to Docker Hub                      |

### Example Usage

using defaults

```yaml
publish-image:
  if: ${{github.event_name != 'pull_request'}}
  uses: jupiterone/.github/.github/workflows/publish_integration_docker_image.yaml@v1.0.0
  with:
    package-name: 'jupiterone/graph-kubernetes'
  secrets:
    DOCKER_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }}
    DOCKER_PASSWORD: ${{ secrets.DOCKERHUB_TOKEN }}
```

overriding defaults

```yaml
publish-image:
  if: ${{github.event_name != 'pull_request'}}
  uses: jupiterone/.github/.github/workflows/publish_integration_docker_image.yaml@v1.0.0
  with:
    runs_on: 'my-special-runner'
    package-name: 'jupiterone/graph-kubernetes'
    push-to-registry: ${{github.event_name == 'merge'}}
  secrets:
    DOCKER_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }}
    DOCKER_PASSWORD: ${{ secrets.DOCKERHUB_TOKEN }}
```
