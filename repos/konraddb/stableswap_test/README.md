# Stable Swap Demo App

This app is a clone of the hadoken stable swap app that has been ported to Axon for learning and experimentation.

## Requirements

- Deployed stable swap contracts
- Updated Subgraphs.
- Updated configs.

## Running the application locally

- Ask a team mate for the `.npmrc`.
- `cp .env.example .env`
- Set the config to axon. i.e. `CONFIG=axon`.
- Install the dependencies `yarn`.
- Run in dev mode `yarn dev`.

## Running the mock API

- Run `yarn json-server --watch src/libs/mock-data/lock.json`

### Run Docker for mocks locally

```
docker build . -t front-mocks && docker run -p 80:80 front-mocks
```

Then you should be able to visit http://0.0.0.0/chains etc.