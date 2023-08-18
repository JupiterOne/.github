## Publish Integration Image to Docker Hub and GHCR

[This workflow](https://github.com/JupiterOne/.github/blob/main/.github/workflows/publish_docker_ghcr.yaml)
builds and publishes your project to both Docker and GHCR. It is recommended
that you only run this workflows on commits to your main branch, and on pushed
tags following semver syntax. It does not need to run on PRs.

### Inputs

This action accepts the following inputs:

| Name                | Type    | Description                                                                                                                                                                                                                                                                                                                              |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runs-on`           | String  | What Github runner should be used (defaults to ubuntu-latest)                                                                                                                                                                                                                                                                            |
| `package-name`      | String  | Name of package to publish to Docker Hub                                                                                                                                                                                                                                                                                                 |
| `push-to-registry`  | Boolean | Determines if the built image should be pushed to the registry (will only push on a merge by default). Be sure this is a statement that evaluates to a boolean, as there are some [known issues](https://medium.com/@sohail.ra5/github-actions-passing-boolean-input-variables-to-reusable-workflow-call-42d39bf7342e) surrounding this. |
| `docker-context`    | String  | The path to your Dockerfile for building your image. (defaults to `.`)                                                                                                                                                                                                                                                                   |
| `build-platforms`   | String  | A comma separated list of platforms to build for (defaults to `linux/amd64,linux/arm64`)                                                                                                                                                                                                                                                 |
| `publish-to-docker` | Boolean | Should the image be published to DockerHub (defaults to `true`)                                                                                                                                                                                                                                                                          |
| `publish-to-ghcr`   | Boolean | Should the image be published to GHCR (defaults to `true`)                                                                                                                                                                                                                                                                               |

### Secrets

These secrets are required to push to different image repositories. It is highly
recommended to use `secrets: inherit` instead of supplying them directly.

> **Note** Due to a limitation with how secrets are input, you must provide all
> four secrets even if you do not want to publish to both DockerHub and GHCR.
> You can use blank variables for these secrets if needed.

| Name              | Description                               |
| ----------------- | ----------------------------------------- |
| `DOCKER_USERNAME` | The username used to publish to DockerHub |
| `DOCKER_PASSWORD` | The password used to publish to DockerHub |
| `GHCR_USERNAME`   | The username used to publish to GHCR      |
| `GHCR_PASSWORD`   | The password used to publish to GHCR      |

### Example Usage

using defaults

```yaml
publish-image:
  if: ${{github.event_name != 'pull_request'}}
  uses: jupiterone/.github/.github/workflows/publish_docker_ghcr.yaml@v1.0.1
  with:
    package-name: 'jupiterone/error-reporting-service'
  secrets: inherit
```

overriding defaults

```yaml
publish-image:
  if: ${{github.event_name != 'pull_request'}}
  uses: jupiterone/.github/.github/workflows/publish_docker_ghcr.yaml@v1.0.1
  with:
    runs_on: 'my-special-runner'
    package-name: 'jupiterone/error-reporting-service'
    push-to-registry: ${{github.event_name == 'merge'}}
    build-platforms: 'linux/amd64'
    docker-context: 'docker/'
  secrets:
    DOCKER_USERNAME: ${{ secrets.DOCKERHUB_USERNAME }}
    DOCKER_PASSWORD: ${{ secrets.DOCKERHUB_TOKEN }}
    GHCR_USERNAME: ${{ secrets.GHCR_USERNAME }}
    GHCR_PASSWORD: ${{ secrets.GHCR_PASSWORD }}
```
