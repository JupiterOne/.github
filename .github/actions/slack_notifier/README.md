# Code QL

This [composite action](./action.yml) is responsible for sending Github workflow build results to Slack to increase visibilty of build pipeline status.

## Inputs

This action takes the following inputs:

| Name                        | Type    | Default                      | Required  | Description                                               |
| --------------------------- | ------- | ---------------------------- | --------- | --------------------------------------------------------- |
| `slack_bot_token`                  | String  |                              | True      | The Oauth token for the Github Slack Send Slack app.
| `slack_channel_id`                 | String  |                              | True      | The ID of the Slack channel to send notifications to.

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
      slack_bot_token: ${{ secrets.SLACK_BOT_TOKEN }}
      slack_channel_id: 'C05447SKNH3'
```
