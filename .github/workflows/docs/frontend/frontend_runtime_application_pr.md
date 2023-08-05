## PR flow for a standard J1 application


[This workflow](../../frontend_runtime_application_pr.yml) ...

### Inputs

This action requires uses the following inputs:

| Name                | Type    | Description                                                                                                                                                                                                                                                                                                                              |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runs-on`           | String  | What Github runner should be used (defaults to ubuntu-latest)                                                                                                                                                                                                                                                                            |
                                                                                                         |

### Secrets

These secrets are required to...

| Name              | Description                               |
| ----------------- | ----------------------------------------- |
| `DOCKER_USERNAME` | The username used to publish to DockerHub |

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
