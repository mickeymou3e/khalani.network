## Hyperlane v3 Deployment 

- Install [Hyperlane CLI](https://www.npmjs.com/package/@hyperlane-xyz/cli)

```bash
npm install -g @hyperlane-xyz/cli
```

## Deployment

```shell
hyperlane deploy core --chains ./hyperlane/.config/chains.yaml --ism ./hyperlane/.config/ism.yaml 
```

## Sending a Test message

```
hyperlane send message --origin sepolia --destination khalanitestnet --chains ./hyperlane/.config/chains.yaml  --core ./hyperlane/artifacts/core-deployment-2024-01-26-11-47-58.json 
```
