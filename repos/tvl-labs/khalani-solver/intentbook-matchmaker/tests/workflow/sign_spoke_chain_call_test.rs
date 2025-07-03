use std::sync::Arc;

use anyhow::Result;
use bindings_khalani::spoke_chain_call_intent_book::SpokeChainCallIntentBook;
use ethers::signers::Signer;
use ethers::types::transaction::eip712::Eip712;
use ethers::types::{Address, Bytes, U256};
use ethers::utils::hex::encode;
use ethers::utils::keccak256;
use intentbook_matchmaker::types::spoke_chain_call::eip712::SpokeChainCall;
use solver_common::config::chain::ChainId;
use solver_common::tests::connector::create_connector;

#[tokio::test]
async fn test_sign_spoke_chain_call() -> Result<()> {
    let connector = create_connector().await?;
    let connector = Arc::new(connector);
    let chain_id = ChainId::Khalani;
    let rpc_client = connector.get_rpc_client(chain_id).unwrap();

    let call_data_hex = "0x4952c8ca000000000000000000000000000000000000000000000000000000000000002000000000000000000000000018f814fa6cb21cc51ae0c5594418766f17dfb6a90000000000000000000000000000000000000000000000000000000000aa36a7000000000000000000000000000000000000000000000000000000000000a86900000000000000000000000024bcc5d1f6538f4a84cd9009ebd4fa614904fa59000000000000000000000000df830a3f120515bd99fe6bc8513537713e204bc5000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000065aa5a540000000000000000000000000000000000000000000000000000000065aa68640000000000000000000000000000000000000000000000000000000000000041a1cf88847f6415d7d654a22ecb1edf33acbb8f5c92f3432374ba449bbdae1e4f2867c45e56caf0bf9eecb4a8bc38f2be980fb680e6a07d0fd5b7c95cb43b704f1c";

    let spoke_chain_call = SpokeChainCall {
        author: "0x18F814fA6CB21cC51ae0C5594418766F17DFb6A9"
            .parse()
            .unwrap(),
        chain_id: 11155111,
        call_data: call_data_hex.parse().unwrap(),
        contract_to_call: "0x2b3DD016af5C31D5bb8F3998dAD29d9F93bDe89A"
            .parse()
            .unwrap(),
        token: Address::default(),
        amount: U256::zero(),
    };

    println!("Payload: {:?}", spoke_chain_call);

    let domain_hash = encode(spoke_chain_call.domain_separator().unwrap());
    let expected_domain_hash = "b8d273d05d2f0bd71b5e026c6dda61c9356e8476038b47566de2afbd4eea0f3a";
    println!("Domain Hash: {:?}", domain_hash);
    assert_eq!(
        domain_hash, expected_domain_hash,
        "The domain hash does not match the expected value."
    );

    let type_hash = SpokeChainCall::type_hash().unwrap();
    println!("Type Hash: {:?}", encode(type_hash));
    let expected_type_hash = keccak256(
        "SpokeChainCall(address author,uint32 chainId,bytes callData,address contractToCall,address token,uint256 amount)"
    );
    assert_eq!(
        type_hash, expected_type_hash,
        "The type hash does not match the expected value."
    );

    let struct_hash: String = encode(spoke_chain_call.struct_hash().unwrap());
    println!("Struct hash: {:?}", struct_hash);
    let expected_struct_hash = "6cd2ba2d8753f7d86189f1d58fe73ed71cb54e00aafe113c03dc58b9c9c884a0";
    assert_eq!(
        struct_hash, expected_struct_hash,
        "The type hash does not match the expected value."
    );

    let eip_712_hash: String = encode(spoke_chain_call.encode_eip712().unwrap());
    println!("EIP 712 hash: {:?}", eip_712_hash);

    let signature = rpc_client
        .signer()
        .sign_typed_data(&spoke_chain_call)
        .await?;
    let expected_signature: Bytes = "0xe2b6c2fa05ec4e18f5a8b89d4c557f4973e1fc594c3117d7e5a4577b5a02b176593180e34f5b1627d9a1d6a9e53d792ba8f3ea0703f44ae3e1c08c5d5e95f7ae1c".parse().unwrap();
    assert_eq!(
        Bytes::from(signature.to_vec()),
        expected_signature,
        "The signature does not match the expected value."
    );

    let spoke_chain_call_intent_book_address: Address =
        "0x14a18c09cC898F4824c1B25A5C9E2e9A66948e39"
            .parse()
            .unwrap();
    let spoke_chain_call_intent_book =
        SpokeChainCallIntentBook::new(spoke_chain_call_intent_book_address, rpc_client);

    let call = bindings_khalani::spoke_chain_call_intent_book::SpokeChainCall {
        amount: spoke_chain_call.amount,
        call_data: spoke_chain_call.call_data,
        author: spoke_chain_call.author,
        contract_to_call: spoke_chain_call.contract_to_call,
        chain_id: spoke_chain_call.chain_id,
        token: spoke_chain_call.token,
        reward_amount: Default::default(),
        reward_token: Default::default(),
    };
    spoke_chain_call_intent_book
        .verify_signature(signature.to_vec().into(), call)
        .call()
        .await
        .map_err(|e| {
            if let Some(r) = e.decode_revert::<String>() {
                anyhow::anyhow!("Reverted: {r}")
            } else {
                anyhow::anyhow!(e)
            }
        })
        .unwrap();

    Ok(())
}
