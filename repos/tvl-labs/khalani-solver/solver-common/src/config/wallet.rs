use async_trait::async_trait;
use ethers::prelude::Signer;
use ethers::signers::{AwsSigner, AwsSignerError, LocalWallet, WalletError};
use ethers::types::transaction::{eip2718::TypedTransaction, eip712::Eip712};
use ethers::types::{Address, Signature};

#[derive(Debug, thiserror::Error)]
pub enum WalletSignerError {
    #[error(transparent)]
    Local(#[from] WalletError),
    #[error(transparent)]
    Aws(#[from] AwsSignerError),
}

#[derive(Debug, Clone)]
pub enum WalletSigner {
    Local(LocalWallet),
    Aws(AwsSigner),
}

impl From<LocalWallet> for WalletSigner {
    fn from(wallet: LocalWallet) -> Self {
        Self::Local(wallet)
    }
}

impl From<AwsSigner> for WalletSigner {
    fn from(wallet: AwsSigner) -> Self {
        Self::Aws(wallet)
    }
}

macro_rules! delegate {
    ($s:ident, $inner:ident => $e:expr) => {
        match $s {
            Self::Local($inner) => $e,
            Self::Aws($inner) => $e,
        }
    };
}

#[async_trait]
impl Signer for WalletSigner {
    type Error = WalletSignerError;

    async fn sign_message<S: Send + Sync + AsRef<[u8]>>(
        &self,
        message: S,
    ) -> Result<Signature, Self::Error> {
        delegate!(self, inner => inner.sign_message(message).await.map_err(Into::into))
    }

    async fn sign_transaction(&self, message: &TypedTransaction) -> Result<Signature, Self::Error> {
        delegate!(self, inner => inner.sign_transaction(message).await.map_err(Into::into))
    }

    async fn sign_typed_data<T: Eip712 + Send + Sync>(
        &self,
        payload: &T,
    ) -> Result<Signature, Self::Error> {
        delegate!(self, inner => inner.sign_typed_data(payload).await.map_err(Into::into))
    }

    fn address(&self) -> Address {
        delegate!(self, inner => inner.address())
    }

    fn chain_id(&self) -> u64 {
        delegate!(self, inner => inner.chain_id())
    }

    fn with_chain_id<T: Into<u64>>(self, chain_id: T) -> Self {
        match self {
            Self::Local(inner) => Self::Local(inner.with_chain_id(chain_id)),
            Self::Aws(inner) => Self::Aws(inner.with_chain_id(chain_id)),
        }
    }
}

#[async_trait]
impl Signer for &WalletSigner {
    type Error = WalletSignerError;

    async fn sign_message<S: Send + Sync + AsRef<[u8]>>(
        &self,
        message: S,
    ) -> Result<Signature, Self::Error> {
        (*self).sign_message(message).await
    }

    async fn sign_transaction(&self, message: &TypedTransaction) -> Result<Signature, Self::Error> {
        (*self).sign_transaction(message).await
    }

    async fn sign_typed_data<T: Eip712 + Send + Sync>(
        &self,
        payload: &T,
    ) -> Result<Signature, Self::Error> {
        (*self).sign_typed_data(payload).await
    }

    fn address(&self) -> Address {
        (*self).address()
    }

    fn chain_id(&self) -> u64 {
        (*self).chain_id()
    }

    fn with_chain_id<T: Into<u64>>(self, chain_id: T) -> Self {
        let _ = chain_id;
        self
    }
}
