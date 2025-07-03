pub use spoke_chain_call_intent_book::*;
/// This module was auto-generated with ethers-rs Abigen.
/// More information at: <https://github.com/gakonst/ethers-rs>
#[allow(
    clippy::enum_variant_names,
    clippy::too_many_arguments,
    clippy::upper_case_acronyms,
    clippy::type_complexity,
    dead_code,
    non_camel_case_types
)]
pub mod spoke_chain_call_intent_book {
    pub use super::super::shared_types::*;
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                    name: ::std::borrow::ToOwned::to_owned("_verifierRegistry"),
                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                    internal_type: ::core::option::Option::Some(::std::borrow::ToOwned::to_owned(
                        "contract VerifierRegistry"
                    ),),
                },],
            }),
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("cancelBatchIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("cancelBatchIntent"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentIds"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                ::std::boxed::Box::new(
                                    ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                ),
                            ),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32[]"),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("cancelIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("cancelIntent"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentId"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("intentBidData"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("intentBidData"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("intentId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("bid"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                        ],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("intentData"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("intentData"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("intent"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("signature"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                        ],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("intentStates"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("intentStates"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("status"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned(
                                        "enum BaseIntentBook.IntentStatus",
                                    ),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("intentBidId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                        ],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("matchAndSettle"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("matchAndSettle"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentBid"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                ::ethers::core::abi::ethabi::ParamType::Bytes,
                            ],),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("struct IntentBookLib.IntentBid",),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("matchIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("matchIntent"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentBid"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                ::ethers::core::abi::ethabi::ParamType::Bytes,
                            ],),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("struct IntentBookLib.IntentBid",),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("placeBatchIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("placeBatchIntent"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intents"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                ::std::boxed::Box::new(
                                    ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                        ::ethers::core::abi::ethabi::ParamType::Bytes,
                                        ::ethers::core::abi::ethabi::ParamType::Bytes,
                                    ],),
                                ),
                            ),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("struct IntentBookLib.Intent[]",),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentIds"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                ::std::boxed::Box::new(
                                    ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                ),
                            ),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32[]"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("placeIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("placeIntent"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intent"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                ::ethers::core::abi::ethabi::ParamType::Bytes,
                                ::ethers::core::abi::ethabi::ParamType::Bytes,
                            ],),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("struct IntentBookLib.Intent",),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentId"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("settleIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("settleIntent"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("intentId"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("verifierRegistry"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("verifierRegistry"),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("contract VerifierRegistry",),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("verifyBid"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("verifyBid"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("spokeChainCallBid"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                ::ethers::core::abi::ethabi::ParamType::Address
                            ],),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned(
                                    "struct SpokeChainCallIntentLib.SpokeChainCallBid",
                                ),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("verifySignature"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("verifySignature"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("signature"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("spokeChainCall"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Uint(32usize),
                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                ],),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned(
                                        "struct SpokeChainCallIntentLib.SpokeChainCall",
                                    ),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
            ]),
            events: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("IntentCancelled"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("IntentCancelled"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("intentId"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            indexed: true,
                        },],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentCreated"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("IntentCreated"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intent"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                ],),
                                indexed: false,
                            },
                        ],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentMatch"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("IntentMatch"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentBidId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentBid"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                    ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                ],),
                                indexed: false,
                            },
                        ],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentPartiallySettled"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("IntentPartiallySettled",),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentBidId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                        ],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentSettled"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("IntentSettled"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("intentBidId"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                        ],
                        anonymous: false,
                    },],
                ),
            ]),
            errors: ::std::collections::BTreeMap::new(),
            receive: false,
            fallback: false,
        }
    }
    ///The parsed JSON ABI of the contract.
    pub static SPOKECHAINCALLINTENTBOOK_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x80`@R4\x80\x15b\0\0\x11W`\0\x80\xFD[P`@Qb\0%M8\x03\x80b\0%M\x839\x81\x01`@\x81\x90Rb\0\x004\x91b\0\0ZV[`\x03\x80T`\x01`\x01`\xA0\x1B\x03\x19\x16`\x01`\x01`\xA0\x1B\x03\x92\x90\x92\x16\x91\x90\x91\x17\x90Ub\0\0\x8CV[`\0` \x82\x84\x03\x12\x15b\0\0mW`\0\x80\xFD[\x81Q`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14b\0\0\x85W`\0\x80\xFD[\x93\x92PPPV[a$\xB1\x80b\0\0\x9C`\09`\0\xF3\xFE`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\0\xCFW`\x005`\xE0\x1C\x80c\x86\xA2:k\x11a\0\x8CW\x80c\xD5_\x96\r\x11a\0fW\x80c\xD5_\x96\r\x14a\x01\xE0W\x80c\xE2V#\xE0\x14a\x01\xF3W\x80c\xFA\x81\x8B\x83\x14a\x02\x14W\x80c\xFE\x19\xC6\xAC\x14a\x024W`\0\x80\xFD[\x80c\x86\xA2:k\x14a\x01\x8FW\x80c\x87\xF6\x17\xB6\x14a\x01\xBAW\x80c\xC0e\x93\x05\x14a\x01\xCDW`\0\x80\xFD[\x80c\t\xC7\xB2\xF6\x14a\0\xD4W\x80cJ\xF26N\x14a\0\xE9W\x80cY\xA8D\xB4\x14a\x01\x0FW\x80c_\xF8\xA6k\x14a\x010W\x80c{\xF8\xBB\x88\x14a\x01kW\x80c\x83\xBDm\xD0\x14a\x01~W[`\0\x80\xFD[a\0\xE7a\0\xE26`\x04a\x18HV[a\x02GV[\0[a\0\xFCa\0\xF76`\x04a\x18HV[a\x04\x9AV[`@Q\x90\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\x01\"a\x01\x1D6`\x04a\x18|V[a\x05\xD4V[`@Qa\x01\x06\x92\x91\x90a\x18\xE5V[a\x01]a\x01>6`\x04a\x18|V[`\0` \x81\x90R\x90\x81R`@\x90 \x80T`\x01\x90\x91\x01T`\xFF\x90\x91\x16\x90\x82V[`@Qa\x01\x06\x92\x91\x90a\x19)V[a\0\xE7a\x01y6`\x04a\x18|V[a\x07\0V[a\0\xE7a\x01\x8C6`\x04a\x1A-V[PV[`\x03Ta\x01\xA2\x90`\x01`\x01`\xA0\x1B\x03\x16\x81V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01a\x01\x06V[a\0\xE7a\x01\xC86`\x04a\x18HV[a\x08\rV[a\0\xE7a\x01\xDB6`\x04a\x1A\xF5V[a\x08 V[a\0\xE7a\x01\xEE6`\x04a\x18|V[a\x08AV[a\x02\x06a\x02\x016`\x04a\x18|V[a\tOV[`@Qa\x01\x06\x92\x91\x90a\x1B\xF2V[a\x02'a\x02\"6`\x04a\x1CVV[a\tqV[`@Qa\x01\x06\x91\x90a\x1C\x97V[a\0\xE7a\x02B6`\x04a\x1CVV[a\n\x1FV[\x805`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x15a\x02\xAEW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FIntent already has a bid\0\0\0\0\0\0\0\0`D\x82\x01R`d\x01[`@Q\x80\x91\x03\x90\xFD[`\0\x81T`\xFF\x16`\x03\x81\x11\x15a\x02\xC6Wa\x02\xC6a\x19\x13V[\x03a\x03\x0BW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01Rt\x12[\x9D\x19[\x9D\x08\x19\x1B\xD9\\\xC8\x1B\x9B\xDD\x08\x19^\x1A\\\xDD`Z\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x03#Wa\x03#a\x19\x13V[\x03a\x03pW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[`\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x03\x88Wa\x03\x88a\x19\x13V[\x03a\x03\xD1W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\0a\x03\xE4a\x03\xDF\x85a\x1C\xDBV[a\n]V[`\0\x81\x81R`\x02` R`@\x90 T\x90\x91P\x15a\x048W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x12`$\x82\x01RqBid already exists`p\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\0\x81\x81R`\x02` R`@\x90 \x84\x90a\x04R\x82\x82a\x1E\xB9V[PP`\x01\x82\x01\x81\x90U\x80\x83\x7Fdi[\xEF\xF9W(\xF3\xEB5\xAC\xAF>E\x0B\xAD\xD7\xE5c\xA5\xCBXe^\x9D\xDA\xDD\xFAm\xECfI\x86`@Qa\x04\x8C\x91\x90a\x1F\xF7V[`@Q\x80\x91\x03\x90\xA3PPPPV[`\0a\x04\xADa\x04\xA8\x83a %V[a\n\x97V[\x90P`\0\x80\x82\x81R` \x81\x90R`@\x90 T`\xFF\x16`\x03\x81\x11\x15a\x04\xD3Wa\x04\xD3a\x19\x13V[\x14a\x05\x18W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01RtIntent already exists`X\x1B`D\x82\x01R`d\x01a\x02\xA5V[`@\x80Q\x80\x82\x01\x90\x91R\x80`\x01\x81R`\0` \x91\x82\x01\x81\x90R\x83\x81R\x90\x81\x90R`@\x90 \x81Q\x81T\x82\x90`\xFF\x19\x16`\x01\x83`\x03\x81\x11\x15a\x05ZWa\x05Za\x19\x13V[\x02\x17\x90UP` \x91\x82\x01Q`\x01\x91\x82\x01U`\0\x83\x81R\x91R`@\x90 \x82\x90a\x05\x82\x82\x82a \x85V[\x90PPa\x05\x8E\x81a\n\xB4V[a\x05\x97\x81a\x0C.V[\x80\x7F\\/\xF1\xA21\x9AN\xC07\x07\x9E\xD0\xFA\xCBgnj\xDE\x19\xE5\xAC\xCBR\x86F;\xF34J\xAB\xD0G\x83`@Qa\x05\xC7\x91\x90a!aV[`@Q\x80\x91\x03\x90\xA2\x91\x90PV[`\x01` R`\0\x90\x81R`@\x90 \x80T\x81\x90a\x05\xEF\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x06\x1B\x90a\x1DpV[\x80\x15a\x06hW\x80`\x1F\x10a\x06=Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06hV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x06KW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90\x80`\x01\x01\x80Ta\x06}\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x06\xA9\x90a\x1DpV[\x80\x15a\x06\xF6W\x80`\x1F\x10a\x06\xCBWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06\xF6V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x06\xD9W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90P\x82V[`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x80a\x07`W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1A`$\x82\x01R\x7FIntent does not have a bid\0\0\0\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[`\0a\x07l\x84\x83a\r\x94V[`\0`\x01\x80\x86\x01\x82\x90U\x84\x82R`\x02` R`@\x82 \x82\x81U\x92\x93Pa\x07\x94\x90\x83\x01\x82a\x17\xE2V[PP\x80\x15a\x07\xD9W\x82T`\xFF\x19\x16`\x02\x17\x83U`@Q\x82\x90\x85\x90\x7F\xBF\x89u\x13\x9A\xEE\x07\x94\xECPWC<4\xFB\x93\x9E\x0FeZ\x87\xB0Q\xE3*:\xAE$\xA6U/N\x90`\0\x90\xA3a\x08\x07V[`@Q\x82\x90\x85\x90\x7F\x84oK\x93k-|\xCF_\xCB\x9F1z\xB7\x91\xF5\xEC\xE5a\x11\x1E\x890n\x99}\x88\xBB\x84*<S\x90`\0\x90\xA3[PPPPV[a\x08\x16\x81a\x02GV[a\x01\x8C\x815a\x07\0V[`\0a\x08+\x82a\x11\xA9V[\x90Pa\x08<\x83\x83`\0\x01Q\x83a\x13/V[PPPV[`\0\x81\x81R` \x81\x90R`@\x90 `\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x08gWa\x08ga\x19\x13V[\x03a\x08\xB0W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x08\xC8Wa\x08\xC8a\x19\x13V[\x03a\t\x15W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[\x80T`\xFF\x19\x16`\x03\x17\x81U`@Q\x82\x90\x7F\xC0\x8E\xB6M\xB1j9\xD2\x84\x89`\xAF\x04\xE3\xF1o\xB4\x04\xD9\xD46\xA9\xF0\xE9\xD7\xD0\xD4\x85G\x15\xC9\xDC\x90`\0\x90\xA2PPV[`\x02` R`\0\x90\x81R`@\x90 \x80T`\x01\x82\x01\x80T\x91\x92\x91a\x06}\x90a\x1DpV[``\x81`\x01`\x01`@\x1B\x03\x81\x11\x15a\t\x8BWa\t\x8Ba\x19UV[`@Q\x90\x80\x82R\x80` \x02` \x01\x82\x01`@R\x80\x15a\t\xB4W\x81` \x01` \x82\x02\x806\x837\x01\x90P[P\x90P`\0[\x82\x81\x10\x15a\n\x18Wa\t\xE9\x84\x84\x83\x81\x81\x10a\t\xD7Wa\t\xD7a!\xB7V[\x90P` \x02\x81\x01\x90a\0\xF7\x91\x90a!\xCDV[\x82\x82\x81Q\x81\x10a\t\xFBWa\t\xFBa!\xB7V[` \x90\x81\x02\x91\x90\x91\x01\x01R\x80a\n\x10\x81a!\xEDV[\x91PPa\t\xBAV[P\x92\x91PPV[`\0[\x81\x81\x10\x15a\x08<Wa\nK\x83\x83\x83\x81\x81\x10a\n?Wa\n?a!\xB7V[\x90P` \x02\x015a\x08AV[\x80a\nU\x81a!\xEDV[\x91PPa\n\"V[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\nz\x92\x91\x90a\"\x14V[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\nz\x92\x91\x90a\":V[`\0\x81\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x82\x90\x82\x90a\n\xDA\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0B\x06\x90a\x1DpV[\x80\x15a\x0BSW\x80`\x1F\x10a\x0B(Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0BSV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0B6W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0Bl\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0B\x98\x90a\x1DpV[\x80\x15a\x0B\xE5W\x80`\x1F\x10a\x0B\xBAWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0B\xE5V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0B\xC8W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\x0C\n\x91\x90a\"\xC4V[`\xE0\x81\x01Q\x90\x91P\x15a\x08<Wa\x08<\x81`\xC0\x01Q\x82`\xE0\x01Q\x83`\0\x01Qa\x14\x19V[`\0\x81\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x82\x90\x82\x90a\x0CT\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0C\x80\x90a\x1DpV[\x80\x15a\x0C\xCDW\x80`\x1F\x10a\x0C\xA2Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0C\xCDV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0C\xB0W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0C\xE6\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\r\x12\x90a\x1DpV[\x80\x15a\r_W\x80`\x1F\x10a\r4Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\r_V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\rBW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\r\x84\x91\x90a\"\xC4V[\x90Pa\x08<\x82` \x01Q\x82a\x08 V[`\0\x82\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x83\x92\x91\x90\x82\x90\x82\x90a\r\xBE\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\r\xEA\x90a\x1DpV[\x80\x15a\x0E7W\x80`\x1F\x10a\x0E\x0CWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0E7V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0E\x1AW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0EP\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0E|\x90a\x1DpV[\x80\x15a\x0E\xC9W\x80`\x1F\x10a\x0E\x9EWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0E\xC9V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0E\xACW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\x0E\xEE\x91\x90a\"\xC4V[\x90P`\0`\x02`\0\x87\x81R` \x01\x90\x81R` \x01`\0 `@Q\x80`@\x01`@R\x90\x81`\0\x82\x01T\x81R` \x01`\x01\x82\x01\x80Ta\x0F*\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0FV\x90a\x1DpV[\x80\x15a\x0F\xA3W\x80`\x1F\x10a\x0FxWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0F\xA3V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0F\x86W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81` \x01Q\x80` \x01\x90Q\x81\x01\x90a\x0F\xC8\x91\x90a#\x9DV[\x90P`\0a\x100`@Q\x80`\xC0\x01`@R\x80\x84`\0\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x8A\x81R` \x01\x86``\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x86`@\x01Q\x81R` \x01\x86`\x80\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x86`\xA0\x01Q\x81RPa\x14%V[`\x03T` \x86\x01Q`@Qc\xB6n\x93_`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x91\x16`\x04\x82\x01R\x91\x92P`\0\x91`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x90c\xB6n\x93_\x90`$\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x10\x8AW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x10\xAE\x91\x90a#\xC2V[`@Qc:\xF1\xB3\x0B`\xE1\x1B\x81R`\x04\x81\x01\x84\x90R\x90\x91P`\x01`\x01`\xA0\x1B\x03\x82\x16\x90cu\xE3f\x16\x90`$\x01` `@Q\x80\x83\x03\x81`\0\x87Z\xF1\x15\x80\x15a\x10\xF8W=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x11\x1C\x91\x90a#\xE6V[a\x11yW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`(`$\x82\x01R\x7FSpokeChainCallIntentBook: Invali`D\x82\x01Rg\x19\x08\x1A[\x9D\x19[\x9D`\xC2\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[`\xE0\x85\x01Q\x15a\x11\x9AWa\x11\x9A\x85`\xC0\x01Q\x86`\xE0\x01Q\x85`\0\x01Qa\x14UV[P`\x01\x98\x97PPPPPPPPV[`@\x80Q\x7F\xC2\xF8xqv\xB8\xACk\xF7![J\xDC\xC1\xE0i\xBFJ\xB8-\x9A\xB1\xDF\x05\xA5z\x91\xD4%\x93[n` \x82\x01R\x7Fe\x8Cpc\x17\xDB\"\x0Fp_}\xFA%1\x18n&\x8C\xC9\xE9\x9D\\\xDE+T\xE7*\xD1\xB0\x9E57\x91\x81\x01\x91\x90\x91R\x7F\x06\xC0\x15\xBD\"\xB4\xC6\x96\x90\x93<\x10X\x87\x8E\xBD\xFE\xF3\x1F\x9A\xAA\xE4\x0B\xBE\x86\xD8\xA0\x9F\xE1\xB2\x97,``\x82\x01RF`\x80\x82\x01R`\0\x90\x81\x90`\xA0\x01`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 \x86Q\x87\x83\x01Q\x93\x88\x01Q\x80Q\x90\x84\x01 ``\x89\x01Q`\x80\x8A\x01Q`\xA0\x8B\x01Q\x94\x98P`\0\x97a\x12\xDC\x97\x7F\xE6:}q\x82\xD0\xFA\xE2\xB2\xE5\x17\xA7\x15]\xE1\xBD\xE7\x1DS\xE7\xD9:W\x0B\\.=\xCAZw:\xB5\x97\x95\x96\x90\x95\x90\x91\x01\x96\x87R`\x01`\x01`\xA0\x1B\x03\x95\x86\x16` \x88\x01Rc\xFF\xFF\xFF\xFF\x94\x90\x94\x16`@\x87\x01R``\x86\x01\x92\x90\x92R\x83\x16`\x80\x85\x01R\x90\x91\x16`\xA0\x83\x01R`\xC0\x82\x01R`\xE0\x01\x90V[`@\x80Q\x80\x83\x03`\x1F\x19\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 a\x19\x01`\xF0\x1B\x82\x85\x01R`\"\x84\x01\x95\x90\x95R`B\x80\x84\x01\x95\x90\x95R\x81Q\x80\x84\x03\x90\x95\x01\x85R`b\x90\x92\x01\x90R\x82Q\x92\x01\x91\x90\x91 \x93\x92PPPV[`\0\x80`\0a\x13=\x86a\x14`V[`@\x80Q`\0\x81R` \x81\x01\x80\x83R\x89\x90R`\xFF\x85\x16\x91\x81\x01\x91\x90\x91R``\x81\x01\x83\x90R`\x80\x81\x01\x82\x90R\x92\x95P\x90\x93P\x91P`\x01`\x01`\xA0\x1B\x03\x86\x16\x90`\x01\x90`\xA0\x01` `@Q` \x81\x03\x90\x80\x84\x03\x90\x85Z\xFA\x15\x80\x15a\x13\xA3W=`\0\x80>=`\0\xFD[PPP` `@Q\x03Q`\x01`\x01`\xA0\x1B\x03\x16\x14a\x14\x11W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`%`$\x82\x01R\x7FVerification error: Signer is in`D\x82\x01Rd\x1D\x98[\x1AY`\xDA\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[PPPPPPV[a\x08<\x83\x820\x85a\x14\xE2V[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q\x93Q`\0\x97a\nz\x97\x90\x96\x95\x91\x01a$\x08V[a\x08<\x83\x82\x84a\x15MV[`\0\x80`\0\x83Q`A\x14a\x14\xC6W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`'`$\x82\x01R\x7FThe signature length is not equa`D\x82\x01Rfl to 65`\xC8\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[PPP` \x81\x01Q`@\x82\x01Q``\x90\x92\x01Q`\0\x1A\x92\x90\x91\x90V[`@Q`\x01`\x01`\xA0\x1B\x03\x80\x85\x16`$\x83\x01R\x83\x16`D\x82\x01R`d\x81\x01\x82\x90Ra\x08\x07\x90\x85\x90c#\xB8r\xDD`\xE0\x1B\x90`\x84\x01[`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x91\x90R` \x81\x01\x80Q`\x01`\x01`\xE0\x1B\x03\x16`\x01`\x01`\xE0\x1B\x03\x19\x90\x93\x16\x92\x90\x92\x17\x90\x91Ra\x15}V[`@Q`\x01`\x01`\xA0\x1B\x03\x83\x16`$\x82\x01R`D\x81\x01\x82\x90Ra\x08<\x90\x84\x90c\xA9\x05\x9C\xBB`\xE0\x1B\x90`d\x01a\x15\x16V[`\0a\x15\xD2\x82`@Q\x80`@\x01`@R\x80` \x81R` \x01\x7FSafeERC20: low-level call failed\x81RP\x85`\x01`\x01`\xA0\x1B\x03\x16a\x16R\x90\x92\x91\x90c\xFF\xFF\xFF\xFF\x16V[\x90P\x80Q`\0\x14\x80a\x15\xF3WP\x80\x80` \x01\x90Q\x81\x01\x90a\x15\xF3\x91\x90a#\xE6V[a\x08<W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`*`$\x82\x01R\x7FSafeERC20: ERC20 operation did n`D\x82\x01Ri\x1B\xDD\x08\x1C\xDDX\xD8\xD9YY`\xB2\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[``a\x16a\x84\x84`\0\x85a\x16iV[\x94\x93PPPPV[``\x82G\x10\x15a\x16\xCAW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FAddress: insufficient balance fo`D\x82\x01Re\x1C\x88\x18\xD8[\x1B`\xD2\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[`\0\x80\x86`\x01`\x01`\xA0\x1B\x03\x16\x85\x87`@Qa\x16\xE6\x91\x90a$\x7FV[`\0`@Q\x80\x83\x03\x81\x85\x87Z\xF1\x92PPP=\x80`\0\x81\x14a\x17#W`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x17(V[``\x91P[P\x91P\x91Pa\x179\x87\x83\x83\x87a\x17DV[\x97\x96PPPPPPPV[``\x83\x15a\x17\xB3W\x82Q`\0\x03a\x17\xACW`\x01`\x01`\xA0\x1B\x03\x85\x16;a\x17\xACW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1D`$\x82\x01R\x7FAddress: call to non-contract\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[P\x81a\x16aV[a\x16a\x83\x83\x81Q\x15a\x17\xC8W\x81Q\x80\x83` \x01\xFD[\x80`@QbF\x1B\xCD`\xE5\x1B\x81R`\x04\x01a\x02\xA5\x91\x90a$\x91V[P\x80Ta\x17\xEE\x90a\x1DpV[`\0\x82U\x80`\x1F\x10a\x17\xFEWPPV[`\x1F\x01` \x90\x04\x90`\0R` `\0 \x90\x81\x01\x90a\x01\x8C\x91\x90[\x80\x82\x11\x15a\x18,W`\0\x81U`\x01\x01a\x18\x18V[P\x90V[`\0`@\x82\x84\x03\x12\x15a\x18BW`\0\x80\xFD[P\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x18ZW`\0\x80\xFD[\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x18pW`\0\x80\xFD[a\x16a\x84\x82\x85\x01a\x180V[`\0` \x82\x84\x03\x12\x15a\x18\x8EW`\0\x80\xFD[P5\x91\x90PV[`\0[\x83\x81\x10\x15a\x18\xB0W\x81\x81\x01Q\x83\x82\x01R` \x01a\x18\x98V[PP`\0\x91\x01RV[`\0\x81Q\x80\x84Ra\x18\xD1\x81` \x86\x01` \x86\x01a\x18\x95V[`\x1F\x01`\x1F\x19\x16\x92\x90\x92\x01` \x01\x92\x91PPV[`@\x81R`\0a\x18\xF8`@\x83\x01\x85a\x18\xB9V[\x82\x81\x03` \x84\x01Ra\x19\n\x81\x85a\x18\xB9V[\x95\x94PPPPPV[cNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[`@\x81\x01`\x04\x84\x10a\x19KWcNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[\x92\x81R` \x01R\x90V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@Q` \x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x19\x8DWa\x19\x8Da\x19UV[`@R\x90V[`@Qa\x01\0\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x19\x8DWa\x19\x8Da\x19UV[`@\x80Q\x90\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x19\x8DWa\x19\x8Da\x19UV[`@Q`\x1F\x82\x01`\x1F\x19\x16\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x1A\0Wa\x1A\0a\x19UV[`@R\x91\x90PV[`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x01\x8CW`\0\x80\xFD[\x805a\x1A(\x81a\x1A\x08V[\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x1A?W`\0\x80\xFD[a\x1AGa\x19kV[\x825a\x1AR\x81a\x1A\x08V[\x81R\x93\x92PPPV[`\0`\x01`\x01`@\x1B\x03\x82\x11\x15a\x1AtWa\x1Ata\x19UV[P`\x1F\x01`\x1F\x19\x16` \x01\x90V[`\0\x82`\x1F\x83\x01\x12a\x1A\x93W`\0\x80\xFD[\x815a\x1A\xA6a\x1A\xA1\x82a\x1A[V[a\x19\xD8V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a\x1A\xBBW`\0\x80\xFD[\x81` \x85\x01` \x83\x017`\0\x91\x81\x01` \x01\x91\x90\x91R\x93\x92PPPV[c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\x01\x8CW`\0\x80\xFD[\x805a\x1A(\x81a\x1A\xD8V[`\0\x80`@\x83\x85\x03\x12\x15a\x1B\x08W`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\x1B\x1FW`\0\x80\xFD[a\x1B+\x86\x83\x87\x01a\x1A\x82V[\x93P` \x85\x015\x91P\x80\x82\x11\x15a\x1BAW`\0\x80\xFD[\x90\x84\x01\x90a\x01\0\x82\x87\x03\x12\x15a\x1BVW`\0\x80\xFD[a\x1B^a\x19\x93V[a\x1Bg\x83a\x1A\x1DV[\x81Ra\x1Bu` \x84\x01a\x1A\xEAV[` \x82\x01R`@\x83\x015\x82\x81\x11\x15a\x1B\x8CW`\0\x80\xFD[a\x1B\x98\x88\x82\x86\x01a\x1A\x82V[`@\x83\x01RPa\x1B\xAA``\x84\x01a\x1A\x1DV[``\x82\x01Ra\x1B\xBB`\x80\x84\x01a\x1A\x1DV[`\x80\x82\x01R`\xA0\x83\x015`\xA0\x82\x01Ra\x1B\xD6`\xC0\x84\x01a\x1A\x1DV[`\xC0\x82\x01R`\xE0\x83\x015`\xE0\x82\x01R\x80\x93PPPP\x92P\x92\x90PV[\x82\x81R`@` \x82\x01R`\0a\x16a`@\x83\x01\x84a\x18\xB9V[`\0\x80\x83`\x1F\x84\x01\x12a\x1C\x1DW`\0\x80\xFD[P\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1C4W`\0\x80\xFD[` \x83\x01\x91P\x83` \x82`\x05\x1B\x85\x01\x01\x11\x15a\x1COW`\0\x80\xFD[\x92P\x92\x90PV[`\0\x80` \x83\x85\x03\x12\x15a\x1CiW`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1C\x7FW`\0\x80\xFD[a\x1C\x8B\x85\x82\x86\x01a\x1C\x0BV[\x90\x96\x90\x95P\x93PPPPV[` \x80\x82R\x82Q\x82\x82\x01\x81\x90R`\0\x91\x90\x84\x82\x01\x90`@\x85\x01\x90\x84[\x81\x81\x10\x15a\x1C\xCFW\x83Q\x83R\x92\x84\x01\x92\x91\x84\x01\x91`\x01\x01a\x1C\xB3V[P\x90\x96\x95PPPPPPV[`\0`@\x826\x03\x12\x15a\x1C\xEDW`\0\x80\xFD[a\x1C\xF5a\x19\xB6V[\x825\x81R` \x83\x015`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1D\x12W`\0\x80\xFD[a\x1D\x1E6\x82\x86\x01a\x1A\x82V[` \x83\x01RP\x92\x91PPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1DAW`\0\x80\xFD[\x83\x01\x805\x91P`\x01`\x01`@\x1B\x03\x82\x11\x15a\x1D[W`\0\x80\xFD[` \x01\x91P6\x81\x90\x03\x82\x13\x15a\x1COW`\0\x80\xFD[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x1D\x84W`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x18BWcNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[`\x1F\x82\x11\x15a\x08<W`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x1D\xCBWP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x14\x11W\x82\x81U`\x01\x01a\x1D\xD7V[`\0\x19`\x03\x83\x90\x1B\x1C\x19\x16`\x01\x91\x90\x91\x1B\x17\x90V[`\x01`\x01`@\x1B\x03\x83\x11\x15a\x1E\x16Wa\x1E\x16a\x19UV[a\x1E*\x83a\x1E$\x83Ta\x1DpV[\x83a\x1D\xA4V[`\0`\x1F\x84\x11`\x01\x81\x14a\x1EXW`\0\x85\x15a\x1EFWP\x83\x82\x015[a\x1EP\x86\x82a\x1D\xEAV[\x84UPa\x1E\xB2V[`\0\x83\x81R` \x90 `\x1F\x19\x86\x16\x90\x83[\x82\x81\x10\x15a\x1E\x89W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a\x1EiV[P\x86\x82\x10\x15a\x1E\xA6W`\0\x19`\xF8\x88`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x85`\x01\x1B\x01\x83U[PPPPPV[\x815\x81U`\x01\x80\x82\x01` a\x1E\xD0\x81\x86\x01\x86a\x1D*V[`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1E\xE7Wa\x1E\xE7a\x19UV[a\x1E\xFB\x81a\x1E\xF5\x86Ta\x1DpV[\x86a\x1D\xA4V[`\0`\x1F\x82\x11`\x01\x81\x14a\x1F)W`\0\x83\x15a\x1F\x17WP\x83\x82\x015[a\x1F!\x84\x82a\x1D\xEAV[\x87UPa\x1F~V[`\0\x86\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a\x1FWW\x86\x85\x015\x82U\x93\x87\x01\x93\x90\x89\x01\x90\x87\x01a\x1F:V[P\x84\x82\x10\x15a\x1FtW`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP\x86\x83\x88\x1B\x01\x86U[PPPPPPPPPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1F\xA0W`\0\x80\xFD[\x83\x01` \x81\x01\x92P5\x90P`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1F\xBFW`\0\x80\xFD[\x806\x03\x82\x13\x15a\x1COW`\0\x80\xFD[\x81\x83R\x81\x81` \x85\x017P`\0\x82\x82\x01` \x90\x81\x01\x91\x90\x91R`\x1F\x90\x91\x01`\x1F\x19\x16\x90\x91\x01\x01\x90V[` \x81R\x815` \x82\x01R`\0a \x11` \x84\x01\x84a\x1F\x89V[`@\x80\x85\x01Ra\x19\n``\x85\x01\x82\x84a\x1F\xCEV[`\0`@\x826\x03\x12\x15a 7W`\0\x80\xFD[a ?a\x19\xB6V[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a VW`\0\x80\xFD[a b6\x83\x87\x01a\x1A\x82V[\x83R` \x85\x015\x91P\x80\x82\x11\x15a xW`\0\x80\xFD[Pa\x1D\x1E6\x82\x86\x01a\x1A\x82V[a \x8F\x82\x83a\x1D*V[`\x01`\x01`@\x1B\x03\x81\x11\x15a \xA6Wa \xA6a\x19UV[a \xBA\x81a \xB4\x85Ta\x1DpV[\x85a\x1D\xA4V[`\0`\x1F\x82\x11`\x01\x81\x14a \xE8W`\0\x83\x15a \xD6WP\x83\x82\x015[a \xE0\x84\x82a\x1D\xEAV[\x86UPa!BV[`\0\x85\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a!\x19W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a \xF9V[P\x84\x82\x10\x15a!6W`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x83`\x01\x1B\x01\x85U[PPPPa!S` \x83\x01\x83a\x1D*V[a\x08\x07\x81\x83`\x01\x86\x01a\x1D\xFFV[` \x81R`\0a!q\x83\x84a\x1F\x89V[`@` \x85\x01Ra!\x86``\x85\x01\x82\x84a\x1F\xCEV[\x91PPa!\x96` \x85\x01\x85a\x1F\x89V[\x84\x83\x03`\x1F\x19\x01`@\x86\x01Ra!\xAD\x83\x82\x84a\x1F\xCEV[\x96\x95PPPPPPV[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`\0\x825`>\x19\x836\x03\x01\x81\x12a!\xE3W`\0\x80\xFD[\x91\x90\x91\x01\x92\x91PPV[`\0`\x01\x82\x01a\"\rWcNH{q`\xE0\x1B`\0R`\x11`\x04R`$`\0\xFD[P`\x01\x01\x90V[\x82\x81R`\0\x82Qa\",\x81` \x85\x01` \x87\x01a\x18\x95V[\x91\x90\x91\x01` \x01\x93\x92PPPV[`\0\x83Qa\"L\x81\x84` \x88\x01a\x18\x95V[\x83Q\x90\x83\x01\x90a\"`\x81\x83` \x88\x01a\x18\x95V[\x01\x94\x93PPPPV[\x80Qa\x1A(\x81a\x1A\x08V[\x80Qa\x1A(\x81a\x1A\xD8V[`\0\x82`\x1F\x83\x01\x12a\"\x90W`\0\x80\xFD[\x81Qa\"\x9Ea\x1A\xA1\x82a\x1A[V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a\"\xB3W`\0\x80\xFD[a\x16a\x82` \x83\x01` \x87\x01a\x18\x95V[`\0` \x82\x84\x03\x12\x15a\"\xD6W`\0\x80\xFD[\x81Q`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\"\xEDW`\0\x80\xFD[\x90\x83\x01\x90a\x01\0\x82\x86\x03\x12\x15a#\x02W`\0\x80\xFD[a#\na\x19\x93V[a#\x13\x83a\"iV[\x81Ra#!` \x84\x01a\"tV[` \x82\x01R`@\x83\x01Q\x82\x81\x11\x15a#8W`\0\x80\xFD[a#D\x87\x82\x86\x01a\"\x7FV[`@\x83\x01RPa#V``\x84\x01a\"iV[``\x82\x01Ra#g`\x80\x84\x01a\"iV[`\x80\x82\x01R`\xA0\x83\x01Q`\xA0\x82\x01Ra#\x82`\xC0\x84\x01a\"iV[`\xC0\x82\x01R`\xE0\x83\x01Q`\xE0\x82\x01R\x80\x93PPPP\x92\x91PPV[`\0` \x82\x84\x03\x12\x15a#\xAFW`\0\x80\xFD[a#\xB7a\x19kV[\x82Qa\x1AR\x81a\x1A\x08V[`\0` \x82\x84\x03\x12\x15a#\xD4W`\0\x80\xFD[\x81Qa#\xDF\x81a\x1A\x08V[\x93\x92PPPV[`\0` \x82\x84\x03\x12\x15a#\xF8W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a#\xDFW`\0\x80\xFD[j\x14\xDC\x1B\xDA\xD9P\xD8[\x1B\x19Y`\xAA\x1B\x81R`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x89``\x1B\x16`\x0B\x84\x01R\x87`\x1F\x84\x01R\x80\x87``\x1B\x16`?\x84\x01R\x85Qa$X\x81`S\x86\x01` \x8A\x01a\x18\x95V[``\x95\x90\x95\x1B\x16\x91\x90\x93\x01`S\x81\x01\x91\x90\x91R`g\x81\x01\x91\x90\x91R`\x87\x01\x95\x94PPPPPV[`\0\x82Qa!\xE3\x81\x84` \x87\x01a\x18\x95V[` \x81R`\0a#\xDF` \x83\x01\x84a\x18\xB9V\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The bytecode of the contract.
    pub static SPOKECHAINCALLINTENTBOOK_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\0\xCFW`\x005`\xE0\x1C\x80c\x86\xA2:k\x11a\0\x8CW\x80c\xD5_\x96\r\x11a\0fW\x80c\xD5_\x96\r\x14a\x01\xE0W\x80c\xE2V#\xE0\x14a\x01\xF3W\x80c\xFA\x81\x8B\x83\x14a\x02\x14W\x80c\xFE\x19\xC6\xAC\x14a\x024W`\0\x80\xFD[\x80c\x86\xA2:k\x14a\x01\x8FW\x80c\x87\xF6\x17\xB6\x14a\x01\xBAW\x80c\xC0e\x93\x05\x14a\x01\xCDW`\0\x80\xFD[\x80c\t\xC7\xB2\xF6\x14a\0\xD4W\x80cJ\xF26N\x14a\0\xE9W\x80cY\xA8D\xB4\x14a\x01\x0FW\x80c_\xF8\xA6k\x14a\x010W\x80c{\xF8\xBB\x88\x14a\x01kW\x80c\x83\xBDm\xD0\x14a\x01~W[`\0\x80\xFD[a\0\xE7a\0\xE26`\x04a\x18HV[a\x02GV[\0[a\0\xFCa\0\xF76`\x04a\x18HV[a\x04\x9AV[`@Q\x90\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\x01\"a\x01\x1D6`\x04a\x18|V[a\x05\xD4V[`@Qa\x01\x06\x92\x91\x90a\x18\xE5V[a\x01]a\x01>6`\x04a\x18|V[`\0` \x81\x90R\x90\x81R`@\x90 \x80T`\x01\x90\x91\x01T`\xFF\x90\x91\x16\x90\x82V[`@Qa\x01\x06\x92\x91\x90a\x19)V[a\0\xE7a\x01y6`\x04a\x18|V[a\x07\0V[a\0\xE7a\x01\x8C6`\x04a\x1A-V[PV[`\x03Ta\x01\xA2\x90`\x01`\x01`\xA0\x1B\x03\x16\x81V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01a\x01\x06V[a\0\xE7a\x01\xC86`\x04a\x18HV[a\x08\rV[a\0\xE7a\x01\xDB6`\x04a\x1A\xF5V[a\x08 V[a\0\xE7a\x01\xEE6`\x04a\x18|V[a\x08AV[a\x02\x06a\x02\x016`\x04a\x18|V[a\tOV[`@Qa\x01\x06\x92\x91\x90a\x1B\xF2V[a\x02'a\x02\"6`\x04a\x1CVV[a\tqV[`@Qa\x01\x06\x91\x90a\x1C\x97V[a\0\xE7a\x02B6`\x04a\x1CVV[a\n\x1FV[\x805`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x15a\x02\xAEW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FIntent already has a bid\0\0\0\0\0\0\0\0`D\x82\x01R`d\x01[`@Q\x80\x91\x03\x90\xFD[`\0\x81T`\xFF\x16`\x03\x81\x11\x15a\x02\xC6Wa\x02\xC6a\x19\x13V[\x03a\x03\x0BW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01Rt\x12[\x9D\x19[\x9D\x08\x19\x1B\xD9\\\xC8\x1B\x9B\xDD\x08\x19^\x1A\\\xDD`Z\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x03#Wa\x03#a\x19\x13V[\x03a\x03pW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[`\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x03\x88Wa\x03\x88a\x19\x13V[\x03a\x03\xD1W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\0a\x03\xE4a\x03\xDF\x85a\x1C\xDBV[a\n]V[`\0\x81\x81R`\x02` R`@\x90 T\x90\x91P\x15a\x048W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x12`$\x82\x01RqBid already exists`p\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\0\x81\x81R`\x02` R`@\x90 \x84\x90a\x04R\x82\x82a\x1E\xB9V[PP`\x01\x82\x01\x81\x90U\x80\x83\x7Fdi[\xEF\xF9W(\xF3\xEB5\xAC\xAF>E\x0B\xAD\xD7\xE5c\xA5\xCBXe^\x9D\xDA\xDD\xFAm\xECfI\x86`@Qa\x04\x8C\x91\x90a\x1F\xF7V[`@Q\x80\x91\x03\x90\xA3PPPPV[`\0a\x04\xADa\x04\xA8\x83a %V[a\n\x97V[\x90P`\0\x80\x82\x81R` \x81\x90R`@\x90 T`\xFF\x16`\x03\x81\x11\x15a\x04\xD3Wa\x04\xD3a\x19\x13V[\x14a\x05\x18W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01RtIntent already exists`X\x1B`D\x82\x01R`d\x01a\x02\xA5V[`@\x80Q\x80\x82\x01\x90\x91R\x80`\x01\x81R`\0` \x91\x82\x01\x81\x90R\x83\x81R\x90\x81\x90R`@\x90 \x81Q\x81T\x82\x90`\xFF\x19\x16`\x01\x83`\x03\x81\x11\x15a\x05ZWa\x05Za\x19\x13V[\x02\x17\x90UP` \x91\x82\x01Q`\x01\x91\x82\x01U`\0\x83\x81R\x91R`@\x90 \x82\x90a\x05\x82\x82\x82a \x85V[\x90PPa\x05\x8E\x81a\n\xB4V[a\x05\x97\x81a\x0C.V[\x80\x7F\\/\xF1\xA21\x9AN\xC07\x07\x9E\xD0\xFA\xCBgnj\xDE\x19\xE5\xAC\xCBR\x86F;\xF34J\xAB\xD0G\x83`@Qa\x05\xC7\x91\x90a!aV[`@Q\x80\x91\x03\x90\xA2\x91\x90PV[`\x01` R`\0\x90\x81R`@\x90 \x80T\x81\x90a\x05\xEF\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x06\x1B\x90a\x1DpV[\x80\x15a\x06hW\x80`\x1F\x10a\x06=Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06hV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x06KW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90\x80`\x01\x01\x80Ta\x06}\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x06\xA9\x90a\x1DpV[\x80\x15a\x06\xF6W\x80`\x1F\x10a\x06\xCBWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06\xF6V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x06\xD9W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90P\x82V[`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x80a\x07`W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1A`$\x82\x01R\x7FIntent does not have a bid\0\0\0\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[`\0a\x07l\x84\x83a\r\x94V[`\0`\x01\x80\x86\x01\x82\x90U\x84\x82R`\x02` R`@\x82 \x82\x81U\x92\x93Pa\x07\x94\x90\x83\x01\x82a\x17\xE2V[PP\x80\x15a\x07\xD9W\x82T`\xFF\x19\x16`\x02\x17\x83U`@Q\x82\x90\x85\x90\x7F\xBF\x89u\x13\x9A\xEE\x07\x94\xECPWC<4\xFB\x93\x9E\x0FeZ\x87\xB0Q\xE3*:\xAE$\xA6U/N\x90`\0\x90\xA3a\x08\x07V[`@Q\x82\x90\x85\x90\x7F\x84oK\x93k-|\xCF_\xCB\x9F1z\xB7\x91\xF5\xEC\xE5a\x11\x1E\x890n\x99}\x88\xBB\x84*<S\x90`\0\x90\xA3[PPPPV[a\x08\x16\x81a\x02GV[a\x01\x8C\x815a\x07\0V[`\0a\x08+\x82a\x11\xA9V[\x90Pa\x08<\x83\x83`\0\x01Q\x83a\x13/V[PPPV[`\0\x81\x81R` \x81\x90R`@\x90 `\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x08gWa\x08ga\x19\x13V[\x03a\x08\xB0W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02\xA5V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x08\xC8Wa\x08\xC8a\x19\x13V[\x03a\t\x15W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[\x80T`\xFF\x19\x16`\x03\x17\x81U`@Q\x82\x90\x7F\xC0\x8E\xB6M\xB1j9\xD2\x84\x89`\xAF\x04\xE3\xF1o\xB4\x04\xD9\xD46\xA9\xF0\xE9\xD7\xD0\xD4\x85G\x15\xC9\xDC\x90`\0\x90\xA2PPV[`\x02` R`\0\x90\x81R`@\x90 \x80T`\x01\x82\x01\x80T\x91\x92\x91a\x06}\x90a\x1DpV[``\x81`\x01`\x01`@\x1B\x03\x81\x11\x15a\t\x8BWa\t\x8Ba\x19UV[`@Q\x90\x80\x82R\x80` \x02` \x01\x82\x01`@R\x80\x15a\t\xB4W\x81` \x01` \x82\x02\x806\x837\x01\x90P[P\x90P`\0[\x82\x81\x10\x15a\n\x18Wa\t\xE9\x84\x84\x83\x81\x81\x10a\t\xD7Wa\t\xD7a!\xB7V[\x90P` \x02\x81\x01\x90a\0\xF7\x91\x90a!\xCDV[\x82\x82\x81Q\x81\x10a\t\xFBWa\t\xFBa!\xB7V[` \x90\x81\x02\x91\x90\x91\x01\x01R\x80a\n\x10\x81a!\xEDV[\x91PPa\t\xBAV[P\x92\x91PPV[`\0[\x81\x81\x10\x15a\x08<Wa\nK\x83\x83\x83\x81\x81\x10a\n?Wa\n?a!\xB7V[\x90P` \x02\x015a\x08AV[\x80a\nU\x81a!\xEDV[\x91PPa\n\"V[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\nz\x92\x91\x90a\"\x14V[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\nz\x92\x91\x90a\":V[`\0\x81\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x82\x90\x82\x90a\n\xDA\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0B\x06\x90a\x1DpV[\x80\x15a\x0BSW\x80`\x1F\x10a\x0B(Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0BSV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0B6W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0Bl\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0B\x98\x90a\x1DpV[\x80\x15a\x0B\xE5W\x80`\x1F\x10a\x0B\xBAWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0B\xE5V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0B\xC8W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\x0C\n\x91\x90a\"\xC4V[`\xE0\x81\x01Q\x90\x91P\x15a\x08<Wa\x08<\x81`\xC0\x01Q\x82`\xE0\x01Q\x83`\0\x01Qa\x14\x19V[`\0\x81\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x82\x90\x82\x90a\x0CT\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0C\x80\x90a\x1DpV[\x80\x15a\x0C\xCDW\x80`\x1F\x10a\x0C\xA2Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0C\xCDV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0C\xB0W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0C\xE6\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\r\x12\x90a\x1DpV[\x80\x15a\r_W\x80`\x1F\x10a\r4Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\r_V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\rBW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\r\x84\x91\x90a\"\xC4V[\x90Pa\x08<\x82` \x01Q\x82a\x08 V[`\0\x82\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x83\x92\x91\x90\x82\x90\x82\x90a\r\xBE\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\r\xEA\x90a\x1DpV[\x80\x15a\x0E7W\x80`\x1F\x10a\x0E\x0CWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0E7V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0E\x1AW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0EP\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0E|\x90a\x1DpV[\x80\x15a\x0E\xC9W\x80`\x1F\x10a\x0E\x9EWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0E\xC9V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0E\xACW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\x0E\xEE\x91\x90a\"\xC4V[\x90P`\0`\x02`\0\x87\x81R` \x01\x90\x81R` \x01`\0 `@Q\x80`@\x01`@R\x90\x81`\0\x82\x01T\x81R` \x01`\x01\x82\x01\x80Ta\x0F*\x90a\x1DpV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0FV\x90a\x1DpV[\x80\x15a\x0F\xA3W\x80`\x1F\x10a\x0FxWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0F\xA3V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0F\x86W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81` \x01Q\x80` \x01\x90Q\x81\x01\x90a\x0F\xC8\x91\x90a#\x9DV[\x90P`\0a\x100`@Q\x80`\xC0\x01`@R\x80\x84`\0\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x8A\x81R` \x01\x86``\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x86`@\x01Q\x81R` \x01\x86`\x80\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x86`\xA0\x01Q\x81RPa\x14%V[`\x03T` \x86\x01Q`@Qc\xB6n\x93_`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x91\x16`\x04\x82\x01R\x91\x92P`\0\x91`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x90c\xB6n\x93_\x90`$\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x10\x8AW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x10\xAE\x91\x90a#\xC2V[`@Qc:\xF1\xB3\x0B`\xE1\x1B\x81R`\x04\x81\x01\x84\x90R\x90\x91P`\x01`\x01`\xA0\x1B\x03\x82\x16\x90cu\xE3f\x16\x90`$\x01` `@Q\x80\x83\x03\x81`\0\x87Z\xF1\x15\x80\x15a\x10\xF8W=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x11\x1C\x91\x90a#\xE6V[a\x11yW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`(`$\x82\x01R\x7FSpokeChainCallIntentBook: Invali`D\x82\x01Rg\x19\x08\x1A[\x9D\x19[\x9D`\xC2\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[`\xE0\x85\x01Q\x15a\x11\x9AWa\x11\x9A\x85`\xC0\x01Q\x86`\xE0\x01Q\x85`\0\x01Qa\x14UV[P`\x01\x98\x97PPPPPPPPV[`@\x80Q\x7F\xC2\xF8xqv\xB8\xACk\xF7![J\xDC\xC1\xE0i\xBFJ\xB8-\x9A\xB1\xDF\x05\xA5z\x91\xD4%\x93[n` \x82\x01R\x7Fe\x8Cpc\x17\xDB\"\x0Fp_}\xFA%1\x18n&\x8C\xC9\xE9\x9D\\\xDE+T\xE7*\xD1\xB0\x9E57\x91\x81\x01\x91\x90\x91R\x7F\x06\xC0\x15\xBD\"\xB4\xC6\x96\x90\x93<\x10X\x87\x8E\xBD\xFE\xF3\x1F\x9A\xAA\xE4\x0B\xBE\x86\xD8\xA0\x9F\xE1\xB2\x97,``\x82\x01RF`\x80\x82\x01R`\0\x90\x81\x90`\xA0\x01`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 \x86Q\x87\x83\x01Q\x93\x88\x01Q\x80Q\x90\x84\x01 ``\x89\x01Q`\x80\x8A\x01Q`\xA0\x8B\x01Q\x94\x98P`\0\x97a\x12\xDC\x97\x7F\xE6:}q\x82\xD0\xFA\xE2\xB2\xE5\x17\xA7\x15]\xE1\xBD\xE7\x1DS\xE7\xD9:W\x0B\\.=\xCAZw:\xB5\x97\x95\x96\x90\x95\x90\x91\x01\x96\x87R`\x01`\x01`\xA0\x1B\x03\x95\x86\x16` \x88\x01Rc\xFF\xFF\xFF\xFF\x94\x90\x94\x16`@\x87\x01R``\x86\x01\x92\x90\x92R\x83\x16`\x80\x85\x01R\x90\x91\x16`\xA0\x83\x01R`\xC0\x82\x01R`\xE0\x01\x90V[`@\x80Q\x80\x83\x03`\x1F\x19\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 a\x19\x01`\xF0\x1B\x82\x85\x01R`\"\x84\x01\x95\x90\x95R`B\x80\x84\x01\x95\x90\x95R\x81Q\x80\x84\x03\x90\x95\x01\x85R`b\x90\x92\x01\x90R\x82Q\x92\x01\x91\x90\x91 \x93\x92PPPV[`\0\x80`\0a\x13=\x86a\x14`V[`@\x80Q`\0\x81R` \x81\x01\x80\x83R\x89\x90R`\xFF\x85\x16\x91\x81\x01\x91\x90\x91R``\x81\x01\x83\x90R`\x80\x81\x01\x82\x90R\x92\x95P\x90\x93P\x91P`\x01`\x01`\xA0\x1B\x03\x86\x16\x90`\x01\x90`\xA0\x01` `@Q` \x81\x03\x90\x80\x84\x03\x90\x85Z\xFA\x15\x80\x15a\x13\xA3W=`\0\x80>=`\0\xFD[PPP` `@Q\x03Q`\x01`\x01`\xA0\x1B\x03\x16\x14a\x14\x11W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`%`$\x82\x01R\x7FVerification error: Signer is in`D\x82\x01Rd\x1D\x98[\x1AY`\xDA\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[PPPPPPV[a\x08<\x83\x820\x85a\x14\xE2V[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q\x93Q`\0\x97a\nz\x97\x90\x96\x95\x91\x01a$\x08V[a\x08<\x83\x82\x84a\x15MV[`\0\x80`\0\x83Q`A\x14a\x14\xC6W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`'`$\x82\x01R\x7FThe signature length is not equa`D\x82\x01Rfl to 65`\xC8\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[PPP` \x81\x01Q`@\x82\x01Q``\x90\x92\x01Q`\0\x1A\x92\x90\x91\x90V[`@Q`\x01`\x01`\xA0\x1B\x03\x80\x85\x16`$\x83\x01R\x83\x16`D\x82\x01R`d\x81\x01\x82\x90Ra\x08\x07\x90\x85\x90c#\xB8r\xDD`\xE0\x1B\x90`\x84\x01[`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x91\x90R` \x81\x01\x80Q`\x01`\x01`\xE0\x1B\x03\x16`\x01`\x01`\xE0\x1B\x03\x19\x90\x93\x16\x92\x90\x92\x17\x90\x91Ra\x15}V[`@Q`\x01`\x01`\xA0\x1B\x03\x83\x16`$\x82\x01R`D\x81\x01\x82\x90Ra\x08<\x90\x84\x90c\xA9\x05\x9C\xBB`\xE0\x1B\x90`d\x01a\x15\x16V[`\0a\x15\xD2\x82`@Q\x80`@\x01`@R\x80` \x81R` \x01\x7FSafeERC20: low-level call failed\x81RP\x85`\x01`\x01`\xA0\x1B\x03\x16a\x16R\x90\x92\x91\x90c\xFF\xFF\xFF\xFF\x16V[\x90P\x80Q`\0\x14\x80a\x15\xF3WP\x80\x80` \x01\x90Q\x81\x01\x90a\x15\xF3\x91\x90a#\xE6V[a\x08<W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`*`$\x82\x01R\x7FSafeERC20: ERC20 operation did n`D\x82\x01Ri\x1B\xDD\x08\x1C\xDDX\xD8\xD9YY`\xB2\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[``a\x16a\x84\x84`\0\x85a\x16iV[\x94\x93PPPPV[``\x82G\x10\x15a\x16\xCAW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FAddress: insufficient balance fo`D\x82\x01Re\x1C\x88\x18\xD8[\x1B`\xD2\x1B`d\x82\x01R`\x84\x01a\x02\xA5V[`\0\x80\x86`\x01`\x01`\xA0\x1B\x03\x16\x85\x87`@Qa\x16\xE6\x91\x90a$\x7FV[`\0`@Q\x80\x83\x03\x81\x85\x87Z\xF1\x92PPP=\x80`\0\x81\x14a\x17#W`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x17(V[``\x91P[P\x91P\x91Pa\x179\x87\x83\x83\x87a\x17DV[\x97\x96PPPPPPPV[``\x83\x15a\x17\xB3W\x82Q`\0\x03a\x17\xACW`\x01`\x01`\xA0\x1B\x03\x85\x16;a\x17\xACW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1D`$\x82\x01R\x7FAddress: call to non-contract\0\0\0`D\x82\x01R`d\x01a\x02\xA5V[P\x81a\x16aV[a\x16a\x83\x83\x81Q\x15a\x17\xC8W\x81Q\x80\x83` \x01\xFD[\x80`@QbF\x1B\xCD`\xE5\x1B\x81R`\x04\x01a\x02\xA5\x91\x90a$\x91V[P\x80Ta\x17\xEE\x90a\x1DpV[`\0\x82U\x80`\x1F\x10a\x17\xFEWPPV[`\x1F\x01` \x90\x04\x90`\0R` `\0 \x90\x81\x01\x90a\x01\x8C\x91\x90[\x80\x82\x11\x15a\x18,W`\0\x81U`\x01\x01a\x18\x18V[P\x90V[`\0`@\x82\x84\x03\x12\x15a\x18BW`\0\x80\xFD[P\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x18ZW`\0\x80\xFD[\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x18pW`\0\x80\xFD[a\x16a\x84\x82\x85\x01a\x180V[`\0` \x82\x84\x03\x12\x15a\x18\x8EW`\0\x80\xFD[P5\x91\x90PV[`\0[\x83\x81\x10\x15a\x18\xB0W\x81\x81\x01Q\x83\x82\x01R` \x01a\x18\x98V[PP`\0\x91\x01RV[`\0\x81Q\x80\x84Ra\x18\xD1\x81` \x86\x01` \x86\x01a\x18\x95V[`\x1F\x01`\x1F\x19\x16\x92\x90\x92\x01` \x01\x92\x91PPV[`@\x81R`\0a\x18\xF8`@\x83\x01\x85a\x18\xB9V[\x82\x81\x03` \x84\x01Ra\x19\n\x81\x85a\x18\xB9V[\x95\x94PPPPPV[cNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[`@\x81\x01`\x04\x84\x10a\x19KWcNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[\x92\x81R` \x01R\x90V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@Q` \x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x19\x8DWa\x19\x8Da\x19UV[`@R\x90V[`@Qa\x01\0\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x19\x8DWa\x19\x8Da\x19UV[`@\x80Q\x90\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x19\x8DWa\x19\x8Da\x19UV[`@Q`\x1F\x82\x01`\x1F\x19\x16\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x1A\0Wa\x1A\0a\x19UV[`@R\x91\x90PV[`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x01\x8CW`\0\x80\xFD[\x805a\x1A(\x81a\x1A\x08V[\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x1A?W`\0\x80\xFD[a\x1AGa\x19kV[\x825a\x1AR\x81a\x1A\x08V[\x81R\x93\x92PPPV[`\0`\x01`\x01`@\x1B\x03\x82\x11\x15a\x1AtWa\x1Ata\x19UV[P`\x1F\x01`\x1F\x19\x16` \x01\x90V[`\0\x82`\x1F\x83\x01\x12a\x1A\x93W`\0\x80\xFD[\x815a\x1A\xA6a\x1A\xA1\x82a\x1A[V[a\x19\xD8V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a\x1A\xBBW`\0\x80\xFD[\x81` \x85\x01` \x83\x017`\0\x91\x81\x01` \x01\x91\x90\x91R\x93\x92PPPV[c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\x01\x8CW`\0\x80\xFD[\x805a\x1A(\x81a\x1A\xD8V[`\0\x80`@\x83\x85\x03\x12\x15a\x1B\x08W`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\x1B\x1FW`\0\x80\xFD[a\x1B+\x86\x83\x87\x01a\x1A\x82V[\x93P` \x85\x015\x91P\x80\x82\x11\x15a\x1BAW`\0\x80\xFD[\x90\x84\x01\x90a\x01\0\x82\x87\x03\x12\x15a\x1BVW`\0\x80\xFD[a\x1B^a\x19\x93V[a\x1Bg\x83a\x1A\x1DV[\x81Ra\x1Bu` \x84\x01a\x1A\xEAV[` \x82\x01R`@\x83\x015\x82\x81\x11\x15a\x1B\x8CW`\0\x80\xFD[a\x1B\x98\x88\x82\x86\x01a\x1A\x82V[`@\x83\x01RPa\x1B\xAA``\x84\x01a\x1A\x1DV[``\x82\x01Ra\x1B\xBB`\x80\x84\x01a\x1A\x1DV[`\x80\x82\x01R`\xA0\x83\x015`\xA0\x82\x01Ra\x1B\xD6`\xC0\x84\x01a\x1A\x1DV[`\xC0\x82\x01R`\xE0\x83\x015`\xE0\x82\x01R\x80\x93PPPP\x92P\x92\x90PV[\x82\x81R`@` \x82\x01R`\0a\x16a`@\x83\x01\x84a\x18\xB9V[`\0\x80\x83`\x1F\x84\x01\x12a\x1C\x1DW`\0\x80\xFD[P\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1C4W`\0\x80\xFD[` \x83\x01\x91P\x83` \x82`\x05\x1B\x85\x01\x01\x11\x15a\x1COW`\0\x80\xFD[\x92P\x92\x90PV[`\0\x80` \x83\x85\x03\x12\x15a\x1CiW`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1C\x7FW`\0\x80\xFD[a\x1C\x8B\x85\x82\x86\x01a\x1C\x0BV[\x90\x96\x90\x95P\x93PPPPV[` \x80\x82R\x82Q\x82\x82\x01\x81\x90R`\0\x91\x90\x84\x82\x01\x90`@\x85\x01\x90\x84[\x81\x81\x10\x15a\x1C\xCFW\x83Q\x83R\x92\x84\x01\x92\x91\x84\x01\x91`\x01\x01a\x1C\xB3V[P\x90\x96\x95PPPPPPV[`\0`@\x826\x03\x12\x15a\x1C\xEDW`\0\x80\xFD[a\x1C\xF5a\x19\xB6V[\x825\x81R` \x83\x015`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1D\x12W`\0\x80\xFD[a\x1D\x1E6\x82\x86\x01a\x1A\x82V[` \x83\x01RP\x92\x91PPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1DAW`\0\x80\xFD[\x83\x01\x805\x91P`\x01`\x01`@\x1B\x03\x82\x11\x15a\x1D[W`\0\x80\xFD[` \x01\x91P6\x81\x90\x03\x82\x13\x15a\x1COW`\0\x80\xFD[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x1D\x84W`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x18BWcNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[`\x1F\x82\x11\x15a\x08<W`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x1D\xCBWP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x14\x11W\x82\x81U`\x01\x01a\x1D\xD7V[`\0\x19`\x03\x83\x90\x1B\x1C\x19\x16`\x01\x91\x90\x91\x1B\x17\x90V[`\x01`\x01`@\x1B\x03\x83\x11\x15a\x1E\x16Wa\x1E\x16a\x19UV[a\x1E*\x83a\x1E$\x83Ta\x1DpV[\x83a\x1D\xA4V[`\0`\x1F\x84\x11`\x01\x81\x14a\x1EXW`\0\x85\x15a\x1EFWP\x83\x82\x015[a\x1EP\x86\x82a\x1D\xEAV[\x84UPa\x1E\xB2V[`\0\x83\x81R` \x90 `\x1F\x19\x86\x16\x90\x83[\x82\x81\x10\x15a\x1E\x89W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a\x1EiV[P\x86\x82\x10\x15a\x1E\xA6W`\0\x19`\xF8\x88`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x85`\x01\x1B\x01\x83U[PPPPPV[\x815\x81U`\x01\x80\x82\x01` a\x1E\xD0\x81\x86\x01\x86a\x1D*V[`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1E\xE7Wa\x1E\xE7a\x19UV[a\x1E\xFB\x81a\x1E\xF5\x86Ta\x1DpV[\x86a\x1D\xA4V[`\0`\x1F\x82\x11`\x01\x81\x14a\x1F)W`\0\x83\x15a\x1F\x17WP\x83\x82\x015[a\x1F!\x84\x82a\x1D\xEAV[\x87UPa\x1F~V[`\0\x86\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a\x1FWW\x86\x85\x015\x82U\x93\x87\x01\x93\x90\x89\x01\x90\x87\x01a\x1F:V[P\x84\x82\x10\x15a\x1FtW`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP\x86\x83\x88\x1B\x01\x86U[PPPPPPPPPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1F\xA0W`\0\x80\xFD[\x83\x01` \x81\x01\x92P5\x90P`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1F\xBFW`\0\x80\xFD[\x806\x03\x82\x13\x15a\x1COW`\0\x80\xFD[\x81\x83R\x81\x81` \x85\x017P`\0\x82\x82\x01` \x90\x81\x01\x91\x90\x91R`\x1F\x90\x91\x01`\x1F\x19\x16\x90\x91\x01\x01\x90V[` \x81R\x815` \x82\x01R`\0a \x11` \x84\x01\x84a\x1F\x89V[`@\x80\x85\x01Ra\x19\n``\x85\x01\x82\x84a\x1F\xCEV[`\0`@\x826\x03\x12\x15a 7W`\0\x80\xFD[a ?a\x19\xB6V[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a VW`\0\x80\xFD[a b6\x83\x87\x01a\x1A\x82V[\x83R` \x85\x015\x91P\x80\x82\x11\x15a xW`\0\x80\xFD[Pa\x1D\x1E6\x82\x86\x01a\x1A\x82V[a \x8F\x82\x83a\x1D*V[`\x01`\x01`@\x1B\x03\x81\x11\x15a \xA6Wa \xA6a\x19UV[a \xBA\x81a \xB4\x85Ta\x1DpV[\x85a\x1D\xA4V[`\0`\x1F\x82\x11`\x01\x81\x14a \xE8W`\0\x83\x15a \xD6WP\x83\x82\x015[a \xE0\x84\x82a\x1D\xEAV[\x86UPa!BV[`\0\x85\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a!\x19W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a \xF9V[P\x84\x82\x10\x15a!6W`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x83`\x01\x1B\x01\x85U[PPPPa!S` \x83\x01\x83a\x1D*V[a\x08\x07\x81\x83`\x01\x86\x01a\x1D\xFFV[` \x81R`\0a!q\x83\x84a\x1F\x89V[`@` \x85\x01Ra!\x86``\x85\x01\x82\x84a\x1F\xCEV[\x91PPa!\x96` \x85\x01\x85a\x1F\x89V[\x84\x83\x03`\x1F\x19\x01`@\x86\x01Ra!\xAD\x83\x82\x84a\x1F\xCEV[\x96\x95PPPPPPV[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`\0\x825`>\x19\x836\x03\x01\x81\x12a!\xE3W`\0\x80\xFD[\x91\x90\x91\x01\x92\x91PPV[`\0`\x01\x82\x01a\"\rWcNH{q`\xE0\x1B`\0R`\x11`\x04R`$`\0\xFD[P`\x01\x01\x90V[\x82\x81R`\0\x82Qa\",\x81` \x85\x01` \x87\x01a\x18\x95V[\x91\x90\x91\x01` \x01\x93\x92PPPV[`\0\x83Qa\"L\x81\x84` \x88\x01a\x18\x95V[\x83Q\x90\x83\x01\x90a\"`\x81\x83` \x88\x01a\x18\x95V[\x01\x94\x93PPPPV[\x80Qa\x1A(\x81a\x1A\x08V[\x80Qa\x1A(\x81a\x1A\xD8V[`\0\x82`\x1F\x83\x01\x12a\"\x90W`\0\x80\xFD[\x81Qa\"\x9Ea\x1A\xA1\x82a\x1A[V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a\"\xB3W`\0\x80\xFD[a\x16a\x82` \x83\x01` \x87\x01a\x18\x95V[`\0` \x82\x84\x03\x12\x15a\"\xD6W`\0\x80\xFD[\x81Q`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\"\xEDW`\0\x80\xFD[\x90\x83\x01\x90a\x01\0\x82\x86\x03\x12\x15a#\x02W`\0\x80\xFD[a#\na\x19\x93V[a#\x13\x83a\"iV[\x81Ra#!` \x84\x01a\"tV[` \x82\x01R`@\x83\x01Q\x82\x81\x11\x15a#8W`\0\x80\xFD[a#D\x87\x82\x86\x01a\"\x7FV[`@\x83\x01RPa#V``\x84\x01a\"iV[``\x82\x01Ra#g`\x80\x84\x01a\"iV[`\x80\x82\x01R`\xA0\x83\x01Q`\xA0\x82\x01Ra#\x82`\xC0\x84\x01a\"iV[`\xC0\x82\x01R`\xE0\x83\x01Q`\xE0\x82\x01R\x80\x93PPPP\x92\x91PPV[`\0` \x82\x84\x03\x12\x15a#\xAFW`\0\x80\xFD[a#\xB7a\x19kV[\x82Qa\x1AR\x81a\x1A\x08V[`\0` \x82\x84\x03\x12\x15a#\xD4W`\0\x80\xFD[\x81Qa#\xDF\x81a\x1A\x08V[\x93\x92PPPV[`\0` \x82\x84\x03\x12\x15a#\xF8W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a#\xDFW`\0\x80\xFD[j\x14\xDC\x1B\xDA\xD9P\xD8[\x1B\x19Y`\xAA\x1B\x81R`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x89``\x1B\x16`\x0B\x84\x01R\x87`\x1F\x84\x01R\x80\x87``\x1B\x16`?\x84\x01R\x85Qa$X\x81`S\x86\x01` \x8A\x01a\x18\x95V[``\x95\x90\x95\x1B\x16\x91\x90\x93\x01`S\x81\x01\x91\x90\x91R`g\x81\x01\x91\x90\x91R`\x87\x01\x95\x94PPPPPV[`\0\x82Qa!\xE3\x81\x84` \x87\x01a\x18\x95V[` \x81R`\0a#\xDF` \x83\x01\x84a\x18\xB9V\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The deployed bytecode of the contract.
    pub static SPOKECHAINCALLINTENTBOOK_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct SpokeChainCallIntentBook<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for SpokeChainCallIntentBook<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for SpokeChainCallIntentBook<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for SpokeChainCallIntentBook<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for SpokeChainCallIntentBook<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(SpokeChainCallIntentBook))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> SpokeChainCallIntentBook<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                SPOKECHAINCALLINTENTBOOK_ABI.clone(),
                client,
            ))
        }
        /// Constructs the general purpose `Deployer` instance based on the provided constructor arguments and sends it.
        /// Returns a new instance of a deployer that returns an instance of this contract after sending the transaction
        ///
        /// Notes:
        /// - If there are no constructor arguments, you should pass `()` as the argument.
        /// - The default poll duration is 7 seconds.
        /// - The default number of confirmations is 1 block.
        ///
        ///
        /// # Example
        ///
        /// Generate contract bindings with `abigen!` and deploy a new contract instance.
        ///
        /// *Note*: this requires a `bytecode` and `abi` object in the `greeter.json` artifact.
        ///
        /// ```ignore
        /// # async fn deploy<M: ethers::providers::Middleware>(client: ::std::sync::Arc<M>) {
        ///     abigen!(Greeter, "../greeter.json");
        ///
        ///    let greeter_contract = Greeter::deploy(client, "Hello world!".to_string()).unwrap().send().await.unwrap();
        ///    let msg = greeter_contract.greet().call().await.unwrap();
        /// # }
        /// ```
        pub fn deploy<T: ::ethers::core::abi::Tokenize>(
            client: ::std::sync::Arc<M>,
            constructor_args: T,
        ) -> ::core::result::Result<
            ::ethers::contract::builders::ContractDeployer<M, Self>,
            ::ethers::contract::ContractError<M>,
        > {
            let factory = ::ethers::contract::ContractFactory::new(
                SPOKECHAINCALLINTENTBOOK_ABI.clone(),
                SPOKECHAINCALLINTENTBOOK_BYTECODE.clone().into(),
                client,
            );
            let deployer = factory.deploy(constructor_args)?;
            let deployer = ::ethers::contract::ContractDeployer::new(deployer);
            Ok(deployer)
        }
        ///Calls the contract's `cancelBatchIntent` (0xfe19c6ac) function
        pub fn cancel_batch_intent(
            &self,
            intent_ids: ::std::vec::Vec<[u8; 32]>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([254, 25, 198, 172], intent_ids)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `cancelIntent` (0xd55f960d) function
        pub fn cancel_intent(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([213, 95, 150, 13], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `intentBidData` (0xe25623e0) function
        pub fn intent_bid_data(
            &self,
            p0: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ([u8; 32], ::ethers::core::types::Bytes)>
        {
            self.0
                .method_hash([226, 86, 35, 224], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `intentData` (0x59a844b4) function
        pub fn intent_data(
            &self,
            p0: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (::ethers::core::types::Bytes, ::ethers::core::types::Bytes),
        > {
            self.0
                .method_hash([89, 168, 68, 180], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `intentStates` (0x5ff8a66b) function
        pub fn intent_states(
            &self,
            p0: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, (u8, [u8; 32])> {
            self.0
                .method_hash([95, 248, 166, 107], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `matchAndSettle` (0x87f617b6) function
        pub fn match_and_settle(
            &self,
            intent_bid: IntentBid,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([135, 246, 23, 182], (intent_bid,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `matchIntent` (0x09c7b2f6) function
        pub fn match_intent(
            &self,
            intent_bid: IntentBid,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([9, 199, 178, 246], (intent_bid,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `placeBatchIntent` (0xfa818b83) function
        pub fn place_batch_intent(
            &self,
            intents: ::std::vec::Vec<Intent>,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::vec::Vec<[u8; 32]>> {
            self.0
                .method_hash([250, 129, 139, 131], intents)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `placeIntent` (0x4af2364e) function
        pub fn place_intent(
            &self,
            intent: Intent,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([74, 242, 54, 78], (intent,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `settleIntent` (0x7bf8bb88) function
        pub fn settle_intent(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([123, 248, 187, 136], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `verifierRegistry` (0x86a23a6b) function
        pub fn verifier_registry(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([134, 162, 58, 107], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `verifyBid` (0x83bd6dd0) function
        pub fn verify_bid(
            &self,
            spoke_chain_call_bid: SpokeChainCallBid,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([131, 189, 109, 208], (spoke_chain_call_bid,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `verifySignature` (0xc0659305) function
        pub fn verify_signature(
            &self,
            signature: ::ethers::core::types::Bytes,
            spoke_chain_call: SpokeChainCall,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([192, 101, 147, 5], (signature, spoke_chain_call))
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `IntentCancelled` event
        pub fn intent_cancelled_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentCancelledFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentCreated` event
        pub fn intent_created_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentCreatedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentMatch` event
        pub fn intent_match_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentMatchFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentPartiallySettled` event
        pub fn intent_partially_settled_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentPartiallySettledFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentSettled` event
        pub fn intent_settled_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentSettledFilter>
        {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            SpokeChainCallIntentBookEvents,
        > {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for SpokeChainCallIntentBook<M>
    {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(name = "IntentCancelled", abi = "IntentCancelled(bytes32)")]
    pub struct IntentCancelledFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(name = "IntentCreated", abi = "IntentCreated(bytes32,(bytes,bytes))")]
    pub struct IntentCreatedFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
        pub intent: Intent,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(
        name = "IntentMatch",
        abi = "IntentMatch(bytes32,bytes32,(bytes32,bytes))"
    )]
    pub struct IntentMatchFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
        #[ethevent(indexed)]
        pub intent_bid_id: [u8; 32],
        pub intent_bid: IntentBid,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(
        name = "IntentPartiallySettled",
        abi = "IntentPartiallySettled(bytes32,bytes32)"
    )]
    pub struct IntentPartiallySettledFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
        #[ethevent(indexed)]
        pub intent_bid_id: [u8; 32],
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(name = "IntentSettled", abi = "IntentSettled(bytes32,bytes32)")]
    pub struct IntentSettledFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
        #[ethevent(indexed)]
        pub intent_bid_id: [u8; 32],
    }
    ///Container type for all of the contract's events
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        serde::Serialize,
        serde::Deserialize,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub enum SpokeChainCallIntentBookEvents {
        IntentCancelledFilter(IntentCancelledFilter),
        IntentCreatedFilter(IntentCreatedFilter),
        IntentMatchFilter(IntentMatchFilter),
        IntentPartiallySettledFilter(IntentPartiallySettledFilter),
        IntentSettledFilter(IntentSettledFilter),
    }
    impl ::ethers::contract::EthLogDecode for SpokeChainCallIntentBookEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = IntentCancelledFilter::decode_log(log) {
                return Ok(SpokeChainCallIntentBookEvents::IntentCancelledFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = IntentCreatedFilter::decode_log(log) {
                return Ok(SpokeChainCallIntentBookEvents::IntentCreatedFilter(decoded));
            }
            if let Ok(decoded) = IntentMatchFilter::decode_log(log) {
                return Ok(SpokeChainCallIntentBookEvents::IntentMatchFilter(decoded));
            }
            if let Ok(decoded) = IntentPartiallySettledFilter::decode_log(log) {
                return Ok(SpokeChainCallIntentBookEvents::IntentPartiallySettledFilter(decoded));
            }
            if let Ok(decoded) = IntentSettledFilter::decode_log(log) {
                return Ok(SpokeChainCallIntentBookEvents::IntentSettledFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for SpokeChainCallIntentBookEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::IntentCancelledFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentCreatedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentMatchFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentPartiallySettledFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentSettledFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<IntentCancelledFilter> for SpokeChainCallIntentBookEvents {
        fn from(value: IntentCancelledFilter) -> Self {
            Self::IntentCancelledFilter(value)
        }
    }
    impl ::core::convert::From<IntentCreatedFilter> for SpokeChainCallIntentBookEvents {
        fn from(value: IntentCreatedFilter) -> Self {
            Self::IntentCreatedFilter(value)
        }
    }
    impl ::core::convert::From<IntentMatchFilter> for SpokeChainCallIntentBookEvents {
        fn from(value: IntentMatchFilter) -> Self {
            Self::IntentMatchFilter(value)
        }
    }
    impl ::core::convert::From<IntentPartiallySettledFilter> for SpokeChainCallIntentBookEvents {
        fn from(value: IntentPartiallySettledFilter) -> Self {
            Self::IntentPartiallySettledFilter(value)
        }
    }
    impl ::core::convert::From<IntentSettledFilter> for SpokeChainCallIntentBookEvents {
        fn from(value: IntentSettledFilter) -> Self {
            Self::IntentSettledFilter(value)
        }
    }
    ///Container type for all input parameters for the `cancelBatchIntent` function with signature `cancelBatchIntent(bytes32[])` and selector `0xfe19c6ac`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "cancelBatchIntent", abi = "cancelBatchIntent(bytes32[])")]
    pub struct CancelBatchIntentCall {
        pub intent_ids: ::std::vec::Vec<[u8; 32]>,
    }
    ///Container type for all input parameters for the `cancelIntent` function with signature `cancelIntent(bytes32)` and selector `0xd55f960d`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "cancelIntent", abi = "cancelIntent(bytes32)")]
    pub struct CancelIntentCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `intentBidData` function with signature `intentBidData(bytes32)` and selector `0xe25623e0`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "intentBidData", abi = "intentBidData(bytes32)")]
    pub struct IntentBidDataCall(pub [u8; 32]);
    ///Container type for all input parameters for the `intentData` function with signature `intentData(bytes32)` and selector `0x59a844b4`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "intentData", abi = "intentData(bytes32)")]
    pub struct IntentDataCall(pub [u8; 32]);
    ///Container type for all input parameters for the `intentStates` function with signature `intentStates(bytes32)` and selector `0x5ff8a66b`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "intentStates", abi = "intentStates(bytes32)")]
    pub struct IntentStatesCall(pub [u8; 32]);
    ///Container type for all input parameters for the `matchAndSettle` function with signature `matchAndSettle((bytes32,bytes))` and selector `0x87f617b6`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "matchAndSettle", abi = "matchAndSettle((bytes32,bytes))")]
    pub struct MatchAndSettleCall {
        pub intent_bid: IntentBid,
    }
    ///Container type for all input parameters for the `matchIntent` function with signature `matchIntent((bytes32,bytes))` and selector `0x09c7b2f6`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "matchIntent", abi = "matchIntent((bytes32,bytes))")]
    pub struct MatchIntentCall {
        pub intent_bid: IntentBid,
    }
    ///Container type for all input parameters for the `placeBatchIntent` function with signature `placeBatchIntent((bytes,bytes)[])` and selector `0xfa818b83`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "placeBatchIntent", abi = "placeBatchIntent((bytes,bytes)[])")]
    pub struct PlaceBatchIntentCall {
        pub intents: ::std::vec::Vec<Intent>,
    }
    ///Container type for all input parameters for the `placeIntent` function with signature `placeIntent((bytes,bytes))` and selector `0x4af2364e`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "placeIntent", abi = "placeIntent((bytes,bytes))")]
    pub struct PlaceIntentCall {
        pub intent: Intent,
    }
    ///Container type for all input parameters for the `settleIntent` function with signature `settleIntent(bytes32)` and selector `0x7bf8bb88`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "settleIntent", abi = "settleIntent(bytes32)")]
    pub struct SettleIntentCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `verifierRegistry` function with signature `verifierRegistry()` and selector `0x86a23a6b`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "verifierRegistry", abi = "verifierRegistry()")]
    pub struct VerifierRegistryCall;
    ///Container type for all input parameters for the `verifyBid` function with signature `verifyBid((address))` and selector `0x83bd6dd0`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "verifyBid", abi = "verifyBid((address))")]
    pub struct VerifyBidCall {
        pub spoke_chain_call_bid: SpokeChainCallBid,
    }
    ///Container type for all input parameters for the `verifySignature` function with signature `verifySignature(bytes,(address,uint32,bytes,address,address,uint256,address,uint256))` and selector `0xc0659305`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "verifySignature",
        abi = "verifySignature(bytes,(address,uint32,bytes,address,address,uint256,address,uint256))"
    )]
    pub struct VerifySignatureCall {
        pub signature: ::ethers::core::types::Bytes,
        pub spoke_chain_call: SpokeChainCall,
    }
    ///Container type for all of the contract's call
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        serde::Serialize,
        serde::Deserialize,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub enum SpokeChainCallIntentBookCalls {
        CancelBatchIntent(CancelBatchIntentCall),
        CancelIntent(CancelIntentCall),
        IntentBidData(IntentBidDataCall),
        IntentData(IntentDataCall),
        IntentStates(IntentStatesCall),
        MatchAndSettle(MatchAndSettleCall),
        MatchIntent(MatchIntentCall),
        PlaceBatchIntent(PlaceBatchIntentCall),
        PlaceIntent(PlaceIntentCall),
        SettleIntent(SettleIntentCall),
        VerifierRegistry(VerifierRegistryCall),
        VerifyBid(VerifyBidCall),
        VerifySignature(VerifySignatureCall),
    }
    impl ::ethers::core::abi::AbiDecode for SpokeChainCallIntentBookCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) =
                <CancelBatchIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::CancelBatchIntent(decoded));
            }
            if let Ok(decoded) = <CancelIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::CancelIntent(decoded));
            }
            if let Ok(decoded) = <IntentBidDataCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBidData(decoded));
            }
            if let Ok(decoded) = <IntentDataCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::IntentData(decoded));
            }
            if let Ok(decoded) = <IntentStatesCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentStates(decoded));
            }
            if let Ok(decoded) =
                <MatchAndSettleCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::MatchAndSettle(decoded));
            }
            if let Ok(decoded) = <MatchIntentCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::MatchIntent(decoded));
            }
            if let Ok(decoded) =
                <PlaceBatchIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::PlaceBatchIntent(decoded));
            }
            if let Ok(decoded) = <PlaceIntentCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::PlaceIntent(decoded));
            }
            if let Ok(decoded) = <SettleIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SettleIntent(decoded));
            }
            if let Ok(decoded) =
                <VerifierRegistryCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VerifierRegistry(decoded));
            }
            if let Ok(decoded) = <VerifyBidCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::VerifyBid(decoded));
            }
            if let Ok(decoded) =
                <VerifySignatureCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VerifySignature(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for SpokeChainCallIntentBookCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::CancelBatchIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CancelIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IntentBidData(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IntentData(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IntentStates(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::MatchAndSettle(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::MatchIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::PlaceBatchIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::PlaceIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SettleIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VerifierRegistry(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VerifyBid(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VerifySignature(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for SpokeChainCallIntentBookCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CancelBatchIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::CancelIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentBidData(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentData(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentStates(element) => ::core::fmt::Display::fmt(element, f),
                Self::MatchAndSettle(element) => ::core::fmt::Display::fmt(element, f),
                Self::MatchIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::PlaceBatchIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::PlaceIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::SettleIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::VerifierRegistry(element) => ::core::fmt::Display::fmt(element, f),
                Self::VerifyBid(element) => ::core::fmt::Display::fmt(element, f),
                Self::VerifySignature(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<CancelBatchIntentCall> for SpokeChainCallIntentBookCalls {
        fn from(value: CancelBatchIntentCall) -> Self {
            Self::CancelBatchIntent(value)
        }
    }
    impl ::core::convert::From<CancelIntentCall> for SpokeChainCallIntentBookCalls {
        fn from(value: CancelIntentCall) -> Self {
            Self::CancelIntent(value)
        }
    }
    impl ::core::convert::From<IntentBidDataCall> for SpokeChainCallIntentBookCalls {
        fn from(value: IntentBidDataCall) -> Self {
            Self::IntentBidData(value)
        }
    }
    impl ::core::convert::From<IntentDataCall> for SpokeChainCallIntentBookCalls {
        fn from(value: IntentDataCall) -> Self {
            Self::IntentData(value)
        }
    }
    impl ::core::convert::From<IntentStatesCall> for SpokeChainCallIntentBookCalls {
        fn from(value: IntentStatesCall) -> Self {
            Self::IntentStates(value)
        }
    }
    impl ::core::convert::From<MatchAndSettleCall> for SpokeChainCallIntentBookCalls {
        fn from(value: MatchAndSettleCall) -> Self {
            Self::MatchAndSettle(value)
        }
    }
    impl ::core::convert::From<MatchIntentCall> for SpokeChainCallIntentBookCalls {
        fn from(value: MatchIntentCall) -> Self {
            Self::MatchIntent(value)
        }
    }
    impl ::core::convert::From<PlaceBatchIntentCall> for SpokeChainCallIntentBookCalls {
        fn from(value: PlaceBatchIntentCall) -> Self {
            Self::PlaceBatchIntent(value)
        }
    }
    impl ::core::convert::From<PlaceIntentCall> for SpokeChainCallIntentBookCalls {
        fn from(value: PlaceIntentCall) -> Self {
            Self::PlaceIntent(value)
        }
    }
    impl ::core::convert::From<SettleIntentCall> for SpokeChainCallIntentBookCalls {
        fn from(value: SettleIntentCall) -> Self {
            Self::SettleIntent(value)
        }
    }
    impl ::core::convert::From<VerifierRegistryCall> for SpokeChainCallIntentBookCalls {
        fn from(value: VerifierRegistryCall) -> Self {
            Self::VerifierRegistry(value)
        }
    }
    impl ::core::convert::From<VerifyBidCall> for SpokeChainCallIntentBookCalls {
        fn from(value: VerifyBidCall) -> Self {
            Self::VerifyBid(value)
        }
    }
    impl ::core::convert::From<VerifySignatureCall> for SpokeChainCallIntentBookCalls {
        fn from(value: VerifySignatureCall) -> Self {
            Self::VerifySignature(value)
        }
    }
    ///Container type for all return fields from the `intentBidData` function with signature `intentBidData(bytes32)` and selector `0xe25623e0`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct IntentBidDataReturn {
        pub intent_id: [u8; 32],
        pub bid: ::ethers::core::types::Bytes,
    }
    ///Container type for all return fields from the `intentData` function with signature `intentData(bytes32)` and selector `0x59a844b4`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct IntentDataReturn {
        pub intent: ::ethers::core::types::Bytes,
        pub signature: ::ethers::core::types::Bytes,
    }
    ///Container type for all return fields from the `intentStates` function with signature `intentStates(bytes32)` and selector `0x5ff8a66b`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct IntentStatesReturn {
        pub status: u8,
        pub intent_bid_id: [u8; 32],
    }
    ///Container type for all return fields from the `placeBatchIntent` function with signature `placeBatchIntent((bytes,bytes)[])` and selector `0xfa818b83`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct PlaceBatchIntentReturn {
        pub intent_ids: ::std::vec::Vec<[u8; 32]>,
    }
    ///Container type for all return fields from the `placeIntent` function with signature `placeIntent((bytes,bytes))` and selector `0x4af2364e`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct PlaceIntentReturn {
        pub intent_id: [u8; 32],
    }
    ///Container type for all return fields from the `verifierRegistry` function with signature `verifierRegistry()` and selector `0x86a23a6b`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct VerifierRegistryReturn(pub ::ethers::core::types::Address);
    ///`SpokeChainCall(address,uint32,bytes,address,address,uint256,address,uint256)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct SpokeChainCall {
        pub author: ::ethers::core::types::Address,
        pub chain_id: u32,
        pub call_data: ::ethers::core::types::Bytes,
        pub contract_to_call: ::ethers::core::types::Address,
        pub token: ::ethers::core::types::Address,
        pub amount: ::ethers::core::types::U256,
        pub reward_token: ::ethers::core::types::Address,
        pub reward_amount: ::ethers::core::types::U256,
    }
    ///`SpokeChainCallBid(address)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct SpokeChainCallBid {
        pub caller: ::ethers::core::types::Address,
    }
}
