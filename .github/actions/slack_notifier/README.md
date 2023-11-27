# Code QL

This [composite action](./action.yml) is responsible for sending Github workflow build results to Slack to increase visibilty of build pipeline status.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `slack-bot-token`                  | String  |                              | True      | The Oauth token for the Github Slack Send Slack app.
| `slack-channel-id`                 | String  |                              | True      | The ID of the Slack channel to send notifications to.

## Outputs

No outputs provided.

## Example Usage

```yaml
steps:
  - name: slack_notifier
    uses: jupiterone/.github/.github/actions/slack_notifier
    # The below condition is required to ensure the action delivers notifications for failed builds (as well as successful ones).
    if: always()
    with:
      slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
      slack-channel-id: 'C05447SKNH3'
```
