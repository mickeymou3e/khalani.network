# Arcadia Monorepo

# Medusa

# Developer Environment

# Contracts

## Permissions systems


Roles:
- Admin
- Contracts Manager
- Intent Updater
- Intent Publisher
- MToken Minter
- Mtoken Remote Withdrawer
- Public


### Protected functions by contract

**MTokenRegistry**:
- `createMToken`: Contracts Manager
- `pauseMToken`: Contracts Manager
- `unpauseMToken`: Contracts Manager
- `destroyMToken`: Contracts Manager

**Intent Book**:
- `setReceiptManager`: Contracts Manager
- `setTokenManager`: Contracts Manager
- `setMinimumFillPercentage`: Contracts Manager
- `setMaxLockDuration`: Contracts Manager
- `publishIntent`: Intent Publisher
- `lockIntentForAuthor`: Intent Updater
- `solve`: Intent Updater


**MTokenManager**:
- `setIntentBook`: Contracts Manager
- `setReceiptsManager`: Contracts Manager
- `setWithdrawalHandler`: Admin (the reason it is Admin instead of contracts manager is because the withdrawal handler must also be granted MToken Remote Withdrawer role, and roles can only be granted by the Admin)
- `setTokenRegistry`: Contracts Manager
- `withdrawMToken`: MToken Remote Withdrawer
- `withdrawIntentBalance`: MToken Remote Withdrawer


