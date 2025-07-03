export enum Registry {
    AddressProvider = "AddressProvider",
    Registry = "Registry",
    PoolInfo = "PoolInfo",
    Swaps = "Swaps",
    Factory = "Factory",
    UserBalances = "UserBalances",
}

export type RegistryDeploymentData = {
    [key in Registry]: string
}
