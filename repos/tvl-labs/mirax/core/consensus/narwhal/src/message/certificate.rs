use std::sync::Arc;

use mirax_consensus_traits::{ConsensusCrypto, ConsensusValidatorManage};
use mirax_network::traits::{MessageHandler, MessageKind};
use mirax_types::{Certificate, MiraxResult};

use crate::{
    collections::NarwhalCollection, error::NarwhalError, message::CertificateMessage,
    state::ConsensusState, try_trait_err,
};

pub struct CertificateHandler<C: ConsensusCrypto, V> {
    crypto: Arc<C>,
    validator_manage: Arc<V>,
    state: ConsensusState,
    collection: Arc<NarwhalCollection<C::Sig>>,
}

impl<C, V> MessageHandler for CertificateHandler<C, V>
where
    C: ConsensusCrypto + Sync + Send + 'static,
    V: ConsensusValidatorManage + Sync + Send,
{
    type Message = CertificateMessage<C::Sig>;
    type Response = ();

    fn kind() -> MessageKind {
        MessageKind::OneWay
    }

    async fn handle(&self, msg: Self::Message) -> MiraxResult<Self::Response> {
        let block_number = msg.inner().number;
        if block_number <= self.state.latest_commit_number() {
            return Ok(());
        }

        let cert_hash = msg.0.calc_hash();
        if self.collection.used_contains(&block_number, &cert_hash) {
            return Ok(());
        }

        check_certificate(&self.crypto, &self.validator_manage, msg.inner()).await?;
        self.collection
            .insert_certificate(self.validator_manage.threshold(), msg.0)?;
        Ok(())
    }
}

impl<C: ConsensusCrypto, V> CertificateHandler<C, V> {
    pub fn new(
        crypto: Arc<C>,
        state: ConsensusState,
        validator_manage: Arc<V>,
        collection: Arc<NarwhalCollection<C::Sig>>,
    ) -> Self {
        Self {
            crypto,
            validator_manage,
            state,
            collection,
        }
    }
}

pub(crate) async fn check_certificate<
    C: ConsensusCrypto + Sync + Send + 'static,
    V: ConsensusValidatorManage + Sync + Send,
>(
    crypto: &Arc<C>,
    validator_manage: &Arc<V>,
    certificate: &Certificate<C::Sig>,
) -> MiraxResult<()> {
    certificate.check_signature_count()?;
    if !validator_manage.is_above_threshold(&certificate.signer_bitmap) {
        return Err(NarwhalError::CertificateBelowThreshold {
            expect: validator_manage.threshold(),
            actual: certificate.signatures.len(),
        }
        .into());
    }

    let public_keys = try_trait_err!(crypto.get_public_keys(&certificate.signer_bitmap));
    try_trait_err!(crypto.batch_verify(
        &certificate.previous_tx_batch_hash,
        &public_keys,
        &certificate.signatures,
    ));

    Ok(())
}
