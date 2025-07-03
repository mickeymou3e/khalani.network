#!/bin/sh

# Create a temporary copy of the environment variables
ORIGINAL_REST_URL=$(eval echo $REST_URL)
ORIGINAL_WS_URL=$(eval echo $WS_URL)
ORIGINAL_NEUTRAL_REST_URL=$(eval echo $NEUTRAL_REST_URL)
ORIGINAL_TENANT_ID=$(eval echo $TENANT_ID)
ORIGINAL_ROLE=$(eval echo $ROLE)
ORIGINAL_TENANT_PUBLIC_KEY=$(eval echo $TENANT_PUBLIC_KEY)
ORIGINAL_TENANT_PRIVATE_KEY=$(eval echo $TENANT_PRIVATE_KEY)


echo "System environment variables: $ORIGINAL_REST_URL, $ORIGINAL_WS_URL, $ECB_REST_URL"

# Load values from .env file
. /app/.env

# Store .env file values in ENV_DEFAULT_* variables
ENV_DEFAULT_REST_URL=$(eval echo $REST_URL)
ENV_DEFAULT_WS_URL=$(eval echo $WS_URL)
ENV_DEFAULT_NEUTRAL_REST_URL=$(eval echo $NEUTRAL_REST_URL)
ENV_DEFAULT_TENANT_ID=$(eval echo $TENANT_ID)
ENV_DEFAULT_ROLE=$(eval echo $ROLE)
ENV_DEFAULT_TENANT_PUBLIC_KEY=$(eval echo $TENANT_PUBLIC_KEY)
ENV_DEFAULT_TENANT_PRIVATE_KEY=$(eval echo $TENANT_PRIVATE_KEY)


echo ".env file environment variables: $ENV_DEFAULT_REST_URL, $ENV_DEFAULT_WS_URL, $ENV_DEFAULT_NEUTRAL_REST_URL"

# Restore original environment variables
REST_URL=$ORIGINAL_REST_URL
WS_URL=$ORIGINAL_WS_URL
NEUTRAL_REST_URL=$ORIGINAL_NEUTRAL_REST_URL
TENANT_ID=$ORIGINAL_TENANT_ID
ROLE=$ORIGINAL_ROLE
TENANT_PUBLIC_KEY=$ORIGINAL_TENANT_PUBLIC_KEY
TENANT_PRIVATE_KEY=$ORIGINAL_TENANT_PRIVATE_KEY

# Replace values in files with actual environment variables if these are defined
for file in $(find /app -type f | grep -v '/app/node_modules'); do
  echo "Processing $file"

  if [ -n "$REST_URL" ]; then
    echo "Replacing $ENV_DEFAULT_REST_URL value with $REST_URL"
    sed -i "s|$ENV_DEFAULT_REST_URL|$REST_URL|g" "$file"
  fi

  if [ -n "$WS_URL" ]; then
    echo "Replacing $ENV_DEFAULT_WS_URL value with $WS_URL"
    sed -i "s|$ENV_DEFAULT_WS_URL|$WS_URL|g" "$file"
  fi

    if [ -n "$NEUTRAL_REST_URL" ]; then
    echo "Replacing $ENV_DEFAULT_NEUTRAL_REST_URL value with $NEUTRAL_REST_URL"
    sed -i "s|$ENV_DEFAULT_NEUTRAL_REST_URL|$NEUTRAL_REST_URL|g" "$file"
  fi

    if [ -n "$TENANT_ID" ]; then
    echo "Replacing $ENV_DEFAULT_TENANT_ID value with $TENANT_ID"
    sed -i "s|$ENV_DEFAULT_TENANT_ID|$TENANT_ID|g" "$file"
  fi

    if [ -n "$ROLE" ]; then
    echo "Replacing $ENV_DEFAULT_ROLE value with $ROLE"
    sed -i "s|$ENV_DEFAULT_ROLE|$ROLE|g" "$file"
  fi

    if [ -n "$TENANT_PUBLIC_KEY" ]; then
    echo "Replacing $ENV_DEFAULT_TENANT_PUBLIC_KEY value with $TENANT_PUBLIC_KEY"
    sed -i "s|$ENV_DEFAULT_TENANT_PUBLIC_KEY|$TENANT_PUBLIC_KEY|g" "$file"
  fi

    if [ -n "$TENANT_PRIVATE_KEY" ]; then
    echo "Replacing $ENV_DEFAULT_TENANT_PRIVATE_KEY value with $TENANT_PRIVATE_KEY"
    sed -i "s|$ENV_DEFAULT_TENANT_PRIVATE_KEY|$TENANT_PRIVATE_KEY|g" "$file"
  fi  

done

# Load values from modified .env file
. /app/.env

exec "$@"
