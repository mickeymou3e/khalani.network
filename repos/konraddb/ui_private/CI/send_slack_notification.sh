DEPLOYMENT_URL="https://github.com/neutral-protocol/deployments/blob/master/prodn/rfq-ui/values.yaml"

# Set the image tag (you can replace this with the actual GitHub Actions variable)
IMAGE_TAG="$1"
APP_NAME="$2"
SLACK_WEBHOOK_URL="$3"
SLACK_NOTIFICATION_CHANNEL="$4"
TRIGGERED_BY="$GITHUB_ACTOR"

# Fetch Slack webhook URL from GitHub secret


# Slack notification payload
payload='{
  "channel":"'"$SLACK_NOTIFICATION_CHANNEL"'",
  "text": "'"$APP_NAME"' production release triggered by *'"$TRIGGERED_BY"'*",
  "attachments": [
    {
      "text": "the '"$APP_NAME"' docker image for production release has been tagged with the following tag: *'"$IMAGE_TAG"'*\nPlease prepare a PR here: ('$DEPLOYMENT_URL') to update the image tag for '"$APP_NAME"'",
      "color": "good"
    }
  ]
}'

# Send notification to Slack
curl -X POST -H 'Content-type: application/json' --data "$payload" "$SLACK_WEBHOOK_URL"
