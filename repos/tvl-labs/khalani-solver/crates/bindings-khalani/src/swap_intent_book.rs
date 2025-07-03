pub use swap_intent_book::*;
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
pub mod swap_intent_book {
    pub use super::super::shared_types::*;
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![
                    ::ethers::core::abi::ethabi::Param {
                        name: ::std::borrow::ToOwned::to_owned("_verifierRegistry"),
                        kind: ::ethers::core::abi::ethabi::ParamType::Address,
                        internal_type: ::core::option::Option::Some(
                            ::std::borrow::ToOwned::to_owned("contract VerifierRegistry"),
                        ),
                    },
                    ::ethers::core::abi::ethabi::Param {
                        name: ::std::borrow::ToOwned::to_owned("_rewarder"),
                        kind: ::ethers::core::abi::ethabi::ParamType::Address,
                        internal_type: ::core::option::Option::Some(
                            ::std::borrow::ToOwned::to_owned("contract IRewarder"),
                        ),
                    },
                ],
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
                    ::std::borrow::ToOwned::to_owned("verify"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("verify"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("swapIntentBid"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                ::ethers::core::abi::ethabi::ParamType::Address,
                                ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                            ],),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned(
                                    "struct SwapIntentLib.SwapIntentBid",
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
                                name: ::std::borrow::ToOwned::to_owned("swapIntentOrder"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Tuple(::std::vec![
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Uint(32usize),
                                    ::ethers::core::abi::ethabi::ParamType::Uint(32usize),
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                ],),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned(
                                        "struct SwapIntentLib.SwapIntent",
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
    pub static SWAPINTENTBOOK_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x80`@R4\x80\x15b\0\0\x11W`\0\x80\xFD[P`@Qb\0#\x128\x03\x80b\0#\x12\x839\x81\x01`@\x81\x90Rb\0\x004\x91b\0\0\x7FV[`\x03\x80T`\x01`\x01`\xA0\x1B\x03\x93\x84\x16`\x01`\x01`\xA0\x1B\x03\x19\x91\x82\x16\x17\x90\x91U`\x04\x80T\x92\x90\x93\x16\x91\x16\x17\x90Ub\0\0\xBEV[`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14b\0\0|W`\0\x80\xFD[PV[`\0\x80`@\x83\x85\x03\x12\x15b\0\0\x93W`\0\x80\xFD[\x82Qb\0\0\xA0\x81b\0\0fV[` \x84\x01Q\x90\x92Pb\0\0\xB3\x81b\0\0fV[\x80\x91PP\x92P\x92\x90PV[a\"D\x80b\0\0\xCE`\09`\0\xF3\xFE`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\0\xB4W`\x005`\xE0\x1C\x80c\x87\xF6\x17\xB6\x11a\0qW\x80c\x87\xF6\x17\xB6\x14a\x01tW\x80c\x9E\xA6\xCB\x82\x14a\x01\x87W\x80c\xD5_\x96\r\x14a\x01\x9AW\x80c\xE2V#\xE0\x14a\x01\xADW\x80c\xFA\x81\x8B\x83\x14a\x01\xCEW\x80c\xFE\x19\xC6\xAC\x14a\x01\xEEW`\0\x80\xFD[\x80c\x03\x89\\\x91\x14a\0\xB9W\x80c\t\xC7\xB2\xF6\x14a\0\xCCW\x80cJ\xF26N\x14a\0\xDFW\x80cY\xA8D\xB4\x14a\x01\x05W\x80c_\xF8\xA6k\x14a\x01&W\x80c{\xF8\xBB\x88\x14a\x01aW[`\0\x80\xFD[a\0\xCAa\0\xC76`\x04a\x16yV[PV[\0[a\0\xCAa\0\xDA6`\x04a\x16\xCBV[a\x02\x01V[a\0\xF2a\0\xED6`\x04a\x16\xCBV[a\x04TV[`@Q\x90\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\x01\x18a\x01\x136`\x04a\x16\xFFV[a\x05\x84V[`@Qa\0\xFC\x92\x91\x90a\x17hV[a\x01Sa\x0146`\x04a\x16\xFFV[`\0` \x81\x90R\x90\x81R`@\x90 \x80T`\x01\x90\x91\x01T`\xFF\x90\x91\x16\x90\x82V[`@Qa\0\xFC\x92\x91\x90a\x17\xACV[a\0\xCAa\x01o6`\x04a\x16\xFFV[a\x06\xB0V[a\0\xCAa\x01\x826`\x04a\x16\xCBV[a\x07\xBDV[a\0\xCAa\x01\x956`\x04a\x18rV[a\x07\xD0V[a\0\xCAa\x01\xA86`\x04a\x16\xFFV[a\x07\xF1V[a\x01\xC0a\x01\xBB6`\x04a\x16\xFFV[a\x08\xFFV[`@Qa\0\xFC\x92\x91\x90a\x19|V[a\x01\xE1a\x01\xDC6`\x04a\x19\xE0V[a\t!V[`@Qa\0\xFC\x91\x90a\x1A!V[a\0\xCAa\x01\xFC6`\x04a\x19\xE0V[a\t\xCFV[\x805`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x15a\x02hW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FIntent already has a bid\0\0\0\0\0\0\0\0`D\x82\x01R`d\x01[`@Q\x80\x91\x03\x90\xFD[`\0\x81T`\xFF\x16`\x03\x81\x11\x15a\x02\x80Wa\x02\x80a\x17\x96V[\x03a\x02\xC5W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01Rt\x12[\x9D\x19[\x9D\x08\x19\x1B\xD9\\\xC8\x1B\x9B\xDD\x08\x19^\x1A\\\xDD`Z\x1B`D\x82\x01R`d\x01a\x02_V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x02\xDDWa\x02\xDDa\x17\x96V[\x03a\x03*W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[`\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x03BWa\x03Ba\x17\x96V[\x03a\x03\x8BW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02_V[`\0a\x03\x9Ea\x03\x99\x85a\x1AeV[a\n\rV[`\0\x81\x81R`\x02` R`@\x90 T\x90\x91P\x15a\x03\xF2W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x12`$\x82\x01RqBid already exists`p\x1B`D\x82\x01R`d\x01a\x02_V[`\0\x81\x81R`\x02` R`@\x90 \x84\x90a\x04\x0C\x82\x82a\x1CCV[PP`\x01\x82\x01\x81\x90U\x80\x83\x7Fdi[\xEF\xF9W(\xF3\xEB5\xAC\xAF>E\x0B\xAD\xD7\xE5c\xA5\xCBXe^\x9D\xDA\xDD\xFAm\xECfI\x86`@Qa\x04F\x91\x90a\x1D\x81V[`@Q\x80\x91\x03\x90\xA3PPPPV[`\0a\x04ga\x04b\x83a\x1D\xAFV[a\nGV[\x90P`\0\x80\x82\x81R` \x81\x90R`@\x90 T`\xFF\x16`\x03\x81\x11\x15a\x04\x8DWa\x04\x8Da\x17\x96V[\x14a\x04\xD2W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01RtIntent already exists`X\x1B`D\x82\x01R`d\x01a\x02_V[`@\x80Q\x80\x82\x01\x90\x91R\x80`\x01\x81R`\0` \x91\x82\x01\x81\x90R\x83\x81R\x90\x81\x90R`@\x90 \x81Q\x81T\x82\x90`\xFF\x19\x16`\x01\x83`\x03\x81\x11\x15a\x05\x14Wa\x05\x14a\x17\x96V[\x02\x17\x90UP` \x91\x82\x01Q`\x01\x91\x82\x01U`\0\x83\x81R\x91R`@\x90 \x82\x90a\x05<\x82\x82a\x1E\x0FV[PPa\x05G\x81a\ndV[\x80\x7F\\/\xF1\xA21\x9AN\xC07\x07\x9E\xD0\xFA\xCBgnj\xDE\x19\xE5\xAC\xCBR\x86F;\xF34J\xAB\xD0G\x83`@Qa\x05w\x91\x90a\x1E\xEBV[`@Q\x80\x91\x03\x90\xA2\x91\x90PV[`\x01` R`\0\x90\x81R`@\x90 \x80T\x81\x90a\x05\x9F\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x05\xCB\x90a\x1A\xFAV[\x80\x15a\x06\x18W\x80`\x1F\x10a\x05\xEDWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06\x18V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x05\xFBW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90\x80`\x01\x01\x80Ta\x06-\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x06Y\x90a\x1A\xFAV[\x80\x15a\x06\xA6W\x80`\x1F\x10a\x06{Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06\xA6V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x06\x89W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90P\x82V[`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x80a\x07\x10W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1A`$\x82\x01R\x7FIntent does not have a bid\0\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[`\0a\x07\x1C\x84\x83a\x0B\xCAV[`\0`\x01\x80\x86\x01\x82\x90U\x84\x82R`\x02` R`@\x82 \x82\x81U\x92\x93Pa\x07D\x90\x83\x01\x82a\x15uV[PP\x80\x15a\x07\x89W\x82T`\xFF\x19\x16`\x02\x17\x83U`@Q\x82\x90\x85\x90\x7F\xBF\x89u\x13\x9A\xEE\x07\x94\xECPWC<4\xFB\x93\x9E\x0FeZ\x87\xB0Q\xE3*:\xAE$\xA6U/N\x90`\0\x90\xA3a\x07\xB7V[`@Q\x82\x90\x85\x90\x7F\x84oK\x93k-|\xCF_\xCB\x9F1z\xB7\x91\xF5\xEC\xE5a\x11\x1E\x890n\x99}\x88\xBB\x84*<S\x90`\0\x90\xA3[PPPPV[a\x07\xC6\x81a\x02\x01V[a\0\xC7\x815a\x06\xB0V[`\0a\x07\xDB\x82a\x112V[\x90Pa\x07\xEC\x83\x83`\0\x01Q\x83a\x12\xDFV[PPPV[`\0\x81\x81R` \x81\x90R`@\x90 `\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x08\x17Wa\x08\x17a\x17\x96V[\x03a\x08`W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02_V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x08xWa\x08xa\x17\x96V[\x03a\x08\xC5W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[\x80T`\xFF\x19\x16`\x03\x17\x81U`@Q\x82\x90\x7F\xC0\x8E\xB6M\xB1j9\xD2\x84\x89`\xAF\x04\xE3\xF1o\xB4\x04\xD9\xD46\xA9\xF0\xE9\xD7\xD0\xD4\x85G\x15\xC9\xDC\x90`\0\x90\xA2PPV[`\x02` R`\0\x90\x81R`@\x90 \x80T`\x01\x82\x01\x80T\x91\x92\x91a\x06-\x90a\x1A\xFAV[``\x81`\x01`\x01`@\x1B\x03\x81\x11\x15a\t;Wa\t;a\x15\xC3V[`@Q\x90\x80\x82R\x80` \x02` \x01\x82\x01`@R\x80\x15a\tdW\x81` \x01` \x82\x02\x806\x837\x01\x90P[P\x90P`\0[\x82\x81\x10\x15a\t\xC8Wa\t\x99\x84\x84\x83\x81\x81\x10a\t\x87Wa\t\x87a\x1FAV[\x90P` \x02\x81\x01\x90a\0\xED\x91\x90a\x1FWV[\x82\x82\x81Q\x81\x10a\t\xABWa\t\xABa\x1FAV[` \x90\x81\x02\x91\x90\x91\x01\x01R\x80a\t\xC0\x81a\x1FwV[\x91PPa\tjV[P\x92\x91PPV[`\0[\x81\x81\x10\x15a\x07\xECWa\t\xFB\x83\x83\x83\x81\x81\x10a\t\xEFWa\t\xEFa\x1FAV[\x90P` \x02\x015a\x07\xF1V[\x80a\n\x05\x81a\x1FwV[\x91PPa\t\xD2V[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\n*\x92\x91\x90a\x1F\x9EV[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\n*\x92\x91\x90a\x1F\xC4V[`\0\x81\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x82\x90\x82\x90a\n\x8A\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\n\xB6\x90a\x1A\xFAV[\x80\x15a\x0B\x03W\x80`\x1F\x10a\n\xD8Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0B\x03V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\n\xE6W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0B\x1C\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0BH\x90a\x1A\xFAV[\x80\x15a\x0B\x95W\x80`\x1F\x10a\x0BjWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0B\x95V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0BxW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\x0B\xBA\x91\x90a NV[\x90Pa\x07\xEC\x82` \x01Q\x82a\x07\xD0V[`\0\x82\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x83\x92\x91\x90\x82\x90\x82\x90a\x0B\xF4\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0C \x90a\x1A\xFAV[\x80\x15a\x0CmW\x80`\x1F\x10a\x0CBWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0CmV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0CPW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0C\x86\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0C\xB2\x90a\x1A\xFAV[\x80\x15a\x0C\xFFW\x80`\x1F\x10a\x0C\xD4Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0C\xFFV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0C\xE2W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\r$\x91\x90a NV[\x90P`\0`\x02`\0\x86\x81R` \x01\x90\x81R` \x01`\0 `@Q\x80`@\x01`@R\x90\x81`\0\x82\x01T\x81R` \x01`\x01\x82\x01\x80Ta\r`\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\r\x8C\x90a\x1A\xFAV[\x80\x15a\r\xD9W\x80`\x1F\x10a\r\xAEWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\r\xD9V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\r\xBCW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81` \x01Q\x80` \x01\x90Q\x81\x01\x90a\r\xFE\x91\x90a!1V[\x90P`\0a\x0E\x0B\x84a\x13\xC9V[`\x03T` \x86\x01Q`@Qc\xB6n\x93_`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x91\x16`\x04\x82\x01R\x91\x92P`\x01`\x01`\xA0\x1B\x03\x16\x90c\xB6n\x93_\x90`$\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x0E`W=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x0E\x84\x91\x90a!kV[`\x01`\x01`\xA0\x1B\x03\x16cu\xE3f\x16a\x0E\x9B\x83a\x14\tV[`@Q\x82c\xFF\xFF\xFF\xFF\x16`\xE0\x1B\x81R`\x04\x01a\x0E\xB9\x91\x81R` \x01\x90V[` `@Q\x80\x83\x03\x81`\0\x87Z\xF1\x15\x80\x15a\x0E\xD8W=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x0E\xFC\x91\x90a!\x8FV[a\x0FHW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1A`$\x82\x01R\x7Ftoken not locked at source\0\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[`\x03T`@\x85\x81\x01Q\x90Qc\xB6n\x93_`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x91\x16`\x04\x82\x01R`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x90c\xB6n\x93_\x90`$\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x0F\x9CW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x0F\xC0\x91\x90a!kV[`\x01`\x01`\xA0\x1B\x03\x16cu\xE3f\x16a\x0F\xE1\x83\x85`\0\x01Q\x86` \x01Qa\x14(V[`@Q\x82c\xFF\xFF\xFF\xFF\x16`\xE0\x1B\x81R`\x04\x01a\x0F\xFF\x91\x81R` \x01\x90V[` `@Q\x80\x83\x03\x81`\0\x87Z\xF1\x15\x80\x15a\x10\x1EW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x10B\x91\x90a!\x8FV[a\x10\x98W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`!`$\x82\x01R\x7Fswap not fulfilled at destinatio`D\x82\x01R`7`\xF9\x1B`d\x82\x01R`\x84\x01a\x02_V[`\x04\x80T` \x86\x01Q``\x87\x01Q`\xA0\x88\x01Q\x86Q`@Qc\x18\x06\xC3C`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x94\x16\x95\x84\x01\x95\x90\x95R`\x01`\x01`\xA0\x1B\x03\x91\x82\x16`$\x84\x01R`D\x83\x01R\x92\x83\x16`d\x82\x01R\x91\x16\x90c\x18\x06\xC3C\x90`\x84\x01`\0`@Q\x80\x83\x03\x81`\0\x87\x80;\x15\x80\x15a\x11\x0CW`\0\x80\xFD[PZ\xF1\x15\x80\x15a\x11 W=`\0\x80>=`\0\xFD[P`\x01\x9B\x9APPPPPPPPPPPV[`@\x80Q\x7F\xC2\xF8xqv\xB8\xACk\xF7![J\xDC\xC1\xE0i\xBFJ\xB8-\x9A\xB1\xDF\x05\xA5z\x91\xD4%\x93[n` \x82\x01R\x7F\xD4\xE2\xD2a\xFF\xA0\xA31\xA9>\xD4\xAE\xE4\x94\x07o\xDC\x03\xDA\x7F\x1A\x99\xDFT\xA9d\x8Ca\xCA\x1D\x85\x94\x91\x81\x01\x91\x90\x91R\x7F\x06\xC0\x15\xBD\"\xB4\xC6\x96\x90\x93<\x10X\x87\x8E\xBD\xFE\xF3\x1F\x9A\xAA\xE4\x0B\xBE\x86\xD8\xA0\x9F\xE1\xB2\x97,``\x82\x01RF`\x80\x82\x01R`\0\x90\x81\x90`\xA0\x01`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 \x86Q\x92\x87\x01Q`\x80\x88\x01Q`\xA0\x89\x01Q\x89\x85\x01Q`\xC0\x8B\x01Q\x80Q\x90\x87\x01 ``\x8C\x01Q`\xE0\x8D\x01Qa\x01\0\x8E\x01Q\x97\x9BP`\0\x9Aa\x12\x8C\x9A\x7F\x9F4\xD6E\xC3}:\xED\xB5\x03Rz\x88\xEB=\xAF\x0B\xAD\xF2*\xDE\x9B\x80C\x07\xCD\xD0\xBF2\x8A\x9B\x13\x9A\x90\x99\x91\x01\x99\x8AR`\x01`\x01`\xA0\x1B\x03\x98\x89\x16` \x8B\x01Rc\xFF\xFF\xFF\xFF\x97\x88\x16`@\x8B\x01R\x95\x88\x16``\x8A\x01R`\x80\x89\x01\x94\x90\x94R\x91\x90\x94\x16`\xA0\x87\x01R`\xC0\x86\x01\x93\x90\x93R\x91\x90\x92\x16`\xE0\x84\x01Ra\x01\0\x83\x01Ra\x01 \x82\x01Ra\x01@\x01\x90V[`@\x80Q\x80\x83\x03`\x1F\x19\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 a\x19\x01`\xF0\x1B\x82\x85\x01R`\"\x84\x01\x95\x90\x95R`B\x80\x84\x01\x95\x90\x95R\x81Q\x80\x84\x03\x90\x95\x01\x85R`b\x90\x92\x01\x90R\x82Q\x92\x01\x91\x90\x91 \x93\x92PPPV[`\0\x80`\0a\x12\xED\x86a\x14^V[`@\x80Q`\0\x81R` \x81\x01\x80\x83R\x89\x90R`\xFF\x85\x16\x91\x81\x01\x91\x90\x91R``\x81\x01\x83\x90R`\x80\x81\x01\x82\x90R\x92\x95P\x90\x93P\x91P`\x01`\x01`\xA0\x1B\x03\x86\x16\x90`\x01\x90`\xA0\x01` `@Q` \x81\x03\x90\x80\x84\x03\x90\x85Z\xFA\x15\x80\x15a\x13SW=`\0\x80>=`\0\xFD[PPP` `@Q\x03Q`\x01`\x01`\xA0\x1B\x03\x16\x14a\x13\xC1W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`%`$\x82\x01R\x7FVerification error: Signer is in`D\x82\x01Rd\x1D\x98[\x1AY`\xDA\x1B`d\x82\x01R`\x84\x01a\x02_V[PPPPPPV[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q`\xC0\x89\x01Q`\xE0\x8A\x01Qa\x01\0\x8B\x01Q\x96Q`\0\x9Aa\n*\x9A\x90\x99\x98\x91\x01a!\xB1V[`\0a\x14\"`@Q\x80` \x01`@R\x80\x84\x81RPa\x14\xE0V[\x92\x91PPV[`\0a\x14V`@Q\x80``\x01`@R\x80\x86\x81R` \x01\x85`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x84\x81RPa\x15\x14V[\x94\x93PPPPV[`\0\x80`\0\x83Q`A\x14a\x14\xC4W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`'`$\x82\x01R\x7FThe signature length is not equa`D\x82\x01Rfl to 65`\xC8\x1B`d\x82\x01R`\x84\x01a\x02_V[PPP` \x81\x01Q`@\x82\x01Q``\x90\x92\x01Q`\0\x1A\x92\x90\x91\x90V[\x80Q`@QrSwapIntentTokenLock`h\x1B` \x82\x01R`3\x81\x01\x91\x90\x91R`\0\x90`S\x01a\n*V[`\0\x81`\0\x01Q\x82` \x01Q\x83`@\x01Q`@Q` \x01a\n*\x93\x92\x91\x90o\x14\xDD\xD8\\\x12[\x9D\x19[\x9D\x11\x9A[\x1B\x19Y`\x82\x1B\x81R`\x10\x81\x01\x93\x90\x93R``\x91\x90\x91\x1Bk\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x16`0\x83\x01R`D\x82\x01R`d\x01\x90V[P\x80Ta\x15\x81\x90a\x1A\xFAV[`\0\x82U\x80`\x1F\x10a\x15\x91WPPV[`\x1F\x01` \x90\x04\x90`\0R` `\0 \x90\x81\x01\x90a\0\xC7\x91\x90[\x80\x82\x11\x15a\x15\xBFW`\0\x81U`\x01\x01a\x15\xABV[P\x90V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@\x80Q\x90\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x15\xFBWa\x15\xFBa\x15\xC3V[`@R\x90V[`@Qa\x01 \x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x15\xFBWa\x15\xFBa\x15\xC3V[`@Q`\x1F\x82\x01`\x1F\x19\x16\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x16LWa\x16La\x15\xC3V[`@R\x91\x90PV[`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\0\xC7W`\0\x80\xFD[\x805a\x16t\x81a\x16TV[\x91\x90PV[`\0`@\x82\x84\x03\x12\x15a\x16\x8BW`\0\x80\xFD[a\x16\x93a\x15\xD9V[\x825a\x16\x9E\x81a\x16TV[\x81R` \x92\x83\x015\x92\x81\x01\x92\x90\x92RP\x91\x90PV[`\0`@\x82\x84\x03\x12\x15a\x16\xC5W`\0\x80\xFD[P\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x16\xDDW`\0\x80\xFD[\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x16\xF3W`\0\x80\xFD[a\x14V\x84\x82\x85\x01a\x16\xB3V[`\0` \x82\x84\x03\x12\x15a\x17\x11W`\0\x80\xFD[P5\x91\x90PV[`\0[\x83\x81\x10\x15a\x173W\x81\x81\x01Q\x83\x82\x01R` \x01a\x17\x1BV[PP`\0\x91\x01RV[`\0\x81Q\x80\x84Ra\x17T\x81` \x86\x01` \x86\x01a\x17\x18V[`\x1F\x01`\x1F\x19\x16\x92\x90\x92\x01` \x01\x92\x91PPV[`@\x81R`\0a\x17{`@\x83\x01\x85a\x17<V[\x82\x81\x03` \x84\x01Ra\x17\x8D\x81\x85a\x17<V[\x95\x94PPPPPV[cNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[`@\x81\x01`\x04\x84\x10a\x17\xCEWcNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[\x92\x81R` \x01R\x90V[`\0`\x01`\x01`@\x1B\x03\x82\x11\x15a\x17\xF1Wa\x17\xF1a\x15\xC3V[P`\x1F\x01`\x1F\x19\x16` \x01\x90V[`\0\x82`\x1F\x83\x01\x12a\x18\x10W`\0\x80\xFD[\x815a\x18#a\x18\x1E\x82a\x17\xD8V[a\x16$V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a\x188W`\0\x80\xFD[\x81` \x85\x01` \x83\x017`\0\x91\x81\x01` \x01\x91\x90\x91R\x93\x92PPPV[c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\0\xC7W`\0\x80\xFD[\x805a\x16t\x81a\x18UV[`\0\x80`@\x83\x85\x03\x12\x15a\x18\x85W`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\x18\x9CW`\0\x80\xFD[a\x18\xA8\x86\x83\x87\x01a\x17\xFFV[\x93P` \x85\x015\x91P\x80\x82\x11\x15a\x18\xBEW`\0\x80\xFD[\x90\x84\x01\x90a\x01 \x82\x87\x03\x12\x15a\x18\xD3W`\0\x80\xFD[a\x18\xDBa\x16\x01V[a\x18\xE4\x83a\x16iV[\x81Ra\x18\xF2` \x84\x01a\x18gV[` \x82\x01Ra\x19\x03`@\x84\x01a\x18gV[`@\x82\x01Ra\x19\x14``\x84\x01a\x16iV[``\x82\x01Ra\x19%`\x80\x84\x01a\x16iV[`\x80\x82\x01R`\xA0\x83\x015`\xA0\x82\x01R`\xC0\x83\x015\x82\x81\x11\x15a\x19FW`\0\x80\xFD[a\x19R\x88\x82\x86\x01a\x17\xFFV[`\xC0\x83\x01RP`\xE0\x83\x015`\xE0\x82\x01Ra\x01\0\x91P\x81\x83\x015\x82\x82\x01R\x80\x93PPPP\x92P\x92\x90PV[\x82\x81R`@` \x82\x01R`\0a\x14V`@\x83\x01\x84a\x17<V[`\0\x80\x83`\x1F\x84\x01\x12a\x19\xA7W`\0\x80\xFD[P\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x19\xBEW`\0\x80\xFD[` \x83\x01\x91P\x83` \x82`\x05\x1B\x85\x01\x01\x11\x15a\x19\xD9W`\0\x80\xFD[\x92P\x92\x90PV[`\0\x80` \x83\x85\x03\x12\x15a\x19\xF3W`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1A\tW`\0\x80\xFD[a\x1A\x15\x85\x82\x86\x01a\x19\x95V[\x90\x96\x90\x95P\x93PPPPV[` \x80\x82R\x82Q\x82\x82\x01\x81\x90R`\0\x91\x90\x84\x82\x01\x90`@\x85\x01\x90\x84[\x81\x81\x10\x15a\x1AYW\x83Q\x83R\x92\x84\x01\x92\x91\x84\x01\x91`\x01\x01a\x1A=V[P\x90\x96\x95PPPPPPV[`\0`@\x826\x03\x12\x15a\x1AwW`\0\x80\xFD[a\x1A\x7Fa\x15\xD9V[\x825\x81R` \x83\x015`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1A\x9CW`\0\x80\xFD[a\x1A\xA86\x82\x86\x01a\x17\xFFV[` \x83\x01RP\x92\x91PPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1A\xCBW`\0\x80\xFD[\x83\x01\x805\x91P`\x01`\x01`@\x1B\x03\x82\x11\x15a\x1A\xE5W`\0\x80\xFD[` \x01\x91P6\x81\x90\x03\x82\x13\x15a\x19\xD9W`\0\x80\xFD[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x1B\x0EW`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x16\xC5WcNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[`\x1F\x82\x11\x15a\x07\xECW`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x1BUWP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x13\xC1W\x82\x81U`\x01\x01a\x1BaV[`\0\x19`\x03\x83\x90\x1B\x1C\x19\x16`\x01\x91\x90\x91\x1B\x17\x90V[`\x01`\x01`@\x1B\x03\x83\x11\x15a\x1B\xA0Wa\x1B\xA0a\x15\xC3V[a\x1B\xB4\x83a\x1B\xAE\x83Ta\x1A\xFAV[\x83a\x1B.V[`\0`\x1F\x84\x11`\x01\x81\x14a\x1B\xE2W`\0\x85\x15a\x1B\xD0WP\x83\x82\x015[a\x1B\xDA\x86\x82a\x1BtV[\x84UPa\x1C<V[`\0\x83\x81R` \x90 `\x1F\x19\x86\x16\x90\x83[\x82\x81\x10\x15a\x1C\x13W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a\x1B\xF3V[P\x86\x82\x10\x15a\x1C0W`\0\x19`\xF8\x88`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x85`\x01\x1B\x01\x83U[PPPPPV[\x815\x81U`\x01\x80\x82\x01` a\x1CZ\x81\x86\x01\x86a\x1A\xB4V[`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1CqWa\x1Cqa\x15\xC3V[a\x1C\x85\x81a\x1C\x7F\x86Ta\x1A\xFAV[\x86a\x1B.V[`\0`\x1F\x82\x11`\x01\x81\x14a\x1C\xB3W`\0\x83\x15a\x1C\xA1WP\x83\x82\x015[a\x1C\xAB\x84\x82a\x1BtV[\x87UPa\x1D\x08V[`\0\x86\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a\x1C\xE1W\x86\x85\x015\x82U\x93\x87\x01\x93\x90\x89\x01\x90\x87\x01a\x1C\xC4V[P\x84\x82\x10\x15a\x1C\xFEW`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP\x86\x83\x88\x1B\x01\x86U[PPPPPPPPPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1D*W`\0\x80\xFD[\x83\x01` \x81\x01\x92P5\x90P`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1DIW`\0\x80\xFD[\x806\x03\x82\x13\x15a\x19\xD9W`\0\x80\xFD[\x81\x83R\x81\x81` \x85\x017P`\0\x82\x82\x01` \x90\x81\x01\x91\x90\x91R`\x1F\x90\x91\x01`\x1F\x19\x16\x90\x91\x01\x01\x90V[` \x81R\x815` \x82\x01R`\0a\x1D\x9B` \x84\x01\x84a\x1D\x13V[`@\x80\x85\x01Ra\x17\x8D``\x85\x01\x82\x84a\x1DXV[`\0`@\x826\x03\x12\x15a\x1D\xC1W`\0\x80\xFD[a\x1D\xC9a\x15\xD9V[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\x1D\xE0W`\0\x80\xFD[a\x1D\xEC6\x83\x87\x01a\x17\xFFV[\x83R` \x85\x015\x91P\x80\x82\x11\x15a\x1E\x02W`\0\x80\xFD[Pa\x1A\xA86\x82\x86\x01a\x17\xFFV[a\x1E\x19\x82\x83a\x1A\xB4V[`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1E0Wa\x1E0a\x15\xC3V[a\x1ED\x81a\x1E>\x85Ta\x1A\xFAV[\x85a\x1B.V[`\0`\x1F\x82\x11`\x01\x81\x14a\x1ErW`\0\x83\x15a\x1E`WP\x83\x82\x015[a\x1Ej\x84\x82a\x1BtV[\x86UPa\x1E\xCCV[`\0\x85\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a\x1E\xA3W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a\x1E\x83V[P\x84\x82\x10\x15a\x1E\xC0W`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x83`\x01\x1B\x01\x85U[PPPPa\x1E\xDD` \x83\x01\x83a\x1A\xB4V[a\x07\xB7\x81\x83`\x01\x86\x01a\x1B\x89V[` \x81R`\0a\x1E\xFB\x83\x84a\x1D\x13V[`@` \x85\x01Ra\x1F\x10``\x85\x01\x82\x84a\x1DXV[\x91PPa\x1F ` \x85\x01\x85a\x1D\x13V[\x84\x83\x03`\x1F\x19\x01`@\x86\x01Ra\x1F7\x83\x82\x84a\x1DXV[\x96\x95PPPPPPV[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`\0\x825`>\x19\x836\x03\x01\x81\x12a\x1FmW`\0\x80\xFD[\x91\x90\x91\x01\x92\x91PPV[`\0`\x01\x82\x01a\x1F\x97WcNH{q`\xE0\x1B`\0R`\x11`\x04R`$`\0\xFD[P`\x01\x01\x90V[\x82\x81R`\0\x82Qa\x1F\xB6\x81` \x85\x01` \x87\x01a\x17\x18V[\x91\x90\x91\x01` \x01\x93\x92PPPV[`\0\x83Qa\x1F\xD6\x81\x84` \x88\x01a\x17\x18V[\x83Q\x90\x83\x01\x90a\x1F\xEA\x81\x83` \x88\x01a\x17\x18V[\x01\x94\x93PPPPV[\x80Qa\x16t\x81a\x16TV[\x80Qa\x16t\x81a\x18UV[`\0\x82`\x1F\x83\x01\x12a \x1AW`\0\x80\xFD[\x81Qa (a\x18\x1E\x82a\x17\xD8V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a =W`\0\x80\xFD[a\x14V\x82` \x83\x01` \x87\x01a\x17\x18V[`\0` \x82\x84\x03\x12\x15a `W`\0\x80\xFD[\x81Q`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a wW`\0\x80\xFD[\x90\x83\x01\x90a\x01 \x82\x86\x03\x12\x15a \x8CW`\0\x80\xFD[a \x94a\x16\x01V[a \x9D\x83a\x1F\xF3V[\x81Ra \xAB` \x84\x01a\x1F\xFEV[` \x82\x01Ra \xBC`@\x84\x01a\x1F\xFEV[`@\x82\x01Ra \xCD``\x84\x01a\x1F\xF3V[``\x82\x01Ra \xDE`\x80\x84\x01a\x1F\xF3V[`\x80\x82\x01R`\xA0\x83\x01Q`\xA0\x82\x01R`\xC0\x83\x01Q\x82\x81\x11\x15a \xFFW`\0\x80\xFD[a!\x0B\x87\x82\x86\x01a \tV[`\xC0\x83\x01RP`\xE0\x83\x81\x01Q\x90\x82\x01Ra\x01\0\x92\x83\x01Q\x92\x81\x01\x92\x90\x92RP\x93\x92PPPV[`\0`@\x82\x84\x03\x12\x15a!CW`\0\x80\xFD[a!Ka\x15\xD9V[\x82Qa!V\x81a\x16TV[\x81R` \x92\x83\x01Q\x92\x81\x01\x92\x90\x92RP\x91\x90PV[`\0` \x82\x84\x03\x12\x15a!}W`\0\x80\xFD[\x81Qa!\x88\x81a\x16TV[\x93\x92PPPV[`\0` \x82\x84\x03\x12\x15a!\xA1W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a!\x88W`\0\x80\xFD[`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x8C``\x1B\x16\x83Rc\xFF\xFF\xFF\xFF`\xE0\x1B\x80\x8C`\xE0\x1B\x16`\x14\x85\x01R\x80\x8B`\xE0\x1B\x16`\x18\x85\x01RP\x80\x89``\x1B\x16`\x1C\x84\x01R\x80\x88``\x1B\x16`0\x84\x01RP\x85`D\x83\x01R\x84Qa\"\x18\x81`d\x85\x01` \x89\x01a\x17\x18V[\x90\x91\x01`d\x81\x01\x93\x90\x93RP`\x84\x82\x01R`\xA4\x01\x97\x96PPPPPPPV\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The bytecode of the contract.
    pub static SWAPINTENTBOOK_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\0\xB4W`\x005`\xE0\x1C\x80c\x87\xF6\x17\xB6\x11a\0qW\x80c\x87\xF6\x17\xB6\x14a\x01tW\x80c\x9E\xA6\xCB\x82\x14a\x01\x87W\x80c\xD5_\x96\r\x14a\x01\x9AW\x80c\xE2V#\xE0\x14a\x01\xADW\x80c\xFA\x81\x8B\x83\x14a\x01\xCEW\x80c\xFE\x19\xC6\xAC\x14a\x01\xEEW`\0\x80\xFD[\x80c\x03\x89\\\x91\x14a\0\xB9W\x80c\t\xC7\xB2\xF6\x14a\0\xCCW\x80cJ\xF26N\x14a\0\xDFW\x80cY\xA8D\xB4\x14a\x01\x05W\x80c_\xF8\xA6k\x14a\x01&W\x80c{\xF8\xBB\x88\x14a\x01aW[`\0\x80\xFD[a\0\xCAa\0\xC76`\x04a\x16yV[PV[\0[a\0\xCAa\0\xDA6`\x04a\x16\xCBV[a\x02\x01V[a\0\xF2a\0\xED6`\x04a\x16\xCBV[a\x04TV[`@Q\x90\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\x01\x18a\x01\x136`\x04a\x16\xFFV[a\x05\x84V[`@Qa\0\xFC\x92\x91\x90a\x17hV[a\x01Sa\x0146`\x04a\x16\xFFV[`\0` \x81\x90R\x90\x81R`@\x90 \x80T`\x01\x90\x91\x01T`\xFF\x90\x91\x16\x90\x82V[`@Qa\0\xFC\x92\x91\x90a\x17\xACV[a\0\xCAa\x01o6`\x04a\x16\xFFV[a\x06\xB0V[a\0\xCAa\x01\x826`\x04a\x16\xCBV[a\x07\xBDV[a\0\xCAa\x01\x956`\x04a\x18rV[a\x07\xD0V[a\0\xCAa\x01\xA86`\x04a\x16\xFFV[a\x07\xF1V[a\x01\xC0a\x01\xBB6`\x04a\x16\xFFV[a\x08\xFFV[`@Qa\0\xFC\x92\x91\x90a\x19|V[a\x01\xE1a\x01\xDC6`\x04a\x19\xE0V[a\t!V[`@Qa\0\xFC\x91\x90a\x1A!V[a\0\xCAa\x01\xFC6`\x04a\x19\xE0V[a\t\xCFV[\x805`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x15a\x02hW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FIntent already has a bid\0\0\0\0\0\0\0\0`D\x82\x01R`d\x01[`@Q\x80\x91\x03\x90\xFD[`\0\x81T`\xFF\x16`\x03\x81\x11\x15a\x02\x80Wa\x02\x80a\x17\x96V[\x03a\x02\xC5W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01Rt\x12[\x9D\x19[\x9D\x08\x19\x1B\xD9\\\xC8\x1B\x9B\xDD\x08\x19^\x1A\\\xDD`Z\x1B`D\x82\x01R`d\x01a\x02_V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x02\xDDWa\x02\xDDa\x17\x96V[\x03a\x03*W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[`\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x03BWa\x03Ba\x17\x96V[\x03a\x03\x8BW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02_V[`\0a\x03\x9Ea\x03\x99\x85a\x1AeV[a\n\rV[`\0\x81\x81R`\x02` R`@\x90 T\x90\x91P\x15a\x03\xF2W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x12`$\x82\x01RqBid already exists`p\x1B`D\x82\x01R`d\x01a\x02_V[`\0\x81\x81R`\x02` R`@\x90 \x84\x90a\x04\x0C\x82\x82a\x1CCV[PP`\x01\x82\x01\x81\x90U\x80\x83\x7Fdi[\xEF\xF9W(\xF3\xEB5\xAC\xAF>E\x0B\xAD\xD7\xE5c\xA5\xCBXe^\x9D\xDA\xDD\xFAm\xECfI\x86`@Qa\x04F\x91\x90a\x1D\x81V[`@Q\x80\x91\x03\x90\xA3PPPPV[`\0a\x04ga\x04b\x83a\x1D\xAFV[a\nGV[\x90P`\0\x80\x82\x81R` \x81\x90R`@\x90 T`\xFF\x16`\x03\x81\x11\x15a\x04\x8DWa\x04\x8Da\x17\x96V[\x14a\x04\xD2W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x15`$\x82\x01RtIntent already exists`X\x1B`D\x82\x01R`d\x01a\x02_V[`@\x80Q\x80\x82\x01\x90\x91R\x80`\x01\x81R`\0` \x91\x82\x01\x81\x90R\x83\x81R\x90\x81\x90R`@\x90 \x81Q\x81T\x82\x90`\xFF\x19\x16`\x01\x83`\x03\x81\x11\x15a\x05\x14Wa\x05\x14a\x17\x96V[\x02\x17\x90UP` \x91\x82\x01Q`\x01\x91\x82\x01U`\0\x83\x81R\x91R`@\x90 \x82\x90a\x05<\x82\x82a\x1E\x0FV[PPa\x05G\x81a\ndV[\x80\x7F\\/\xF1\xA21\x9AN\xC07\x07\x9E\xD0\xFA\xCBgnj\xDE\x19\xE5\xAC\xCBR\x86F;\xF34J\xAB\xD0G\x83`@Qa\x05w\x91\x90a\x1E\xEBV[`@Q\x80\x91\x03\x90\xA2\x91\x90PV[`\x01` R`\0\x90\x81R`@\x90 \x80T\x81\x90a\x05\x9F\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x05\xCB\x90a\x1A\xFAV[\x80\x15a\x06\x18W\x80`\x1F\x10a\x05\xEDWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06\x18V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x05\xFBW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90\x80`\x01\x01\x80Ta\x06-\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x06Y\x90a\x1A\xFAV[\x80\x15a\x06\xA6W\x80`\x1F\x10a\x06{Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x06\xA6V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x06\x89W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x90P\x82V[`\0\x81\x81R` \x81\x90R`@\x90 `\x01\x81\x01T\x80a\x07\x10W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1A`$\x82\x01R\x7FIntent does not have a bid\0\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[`\0a\x07\x1C\x84\x83a\x0B\xCAV[`\0`\x01\x80\x86\x01\x82\x90U\x84\x82R`\x02` R`@\x82 \x82\x81U\x92\x93Pa\x07D\x90\x83\x01\x82a\x15uV[PP\x80\x15a\x07\x89W\x82T`\xFF\x19\x16`\x02\x17\x83U`@Q\x82\x90\x85\x90\x7F\xBF\x89u\x13\x9A\xEE\x07\x94\xECPWC<4\xFB\x93\x9E\x0FeZ\x87\xB0Q\xE3*:\xAE$\xA6U/N\x90`\0\x90\xA3a\x07\xB7V[`@Q\x82\x90\x85\x90\x7F\x84oK\x93k-|\xCF_\xCB\x9F1z\xB7\x91\xF5\xEC\xE5a\x11\x1E\x890n\x99}\x88\xBB\x84*<S\x90`\0\x90\xA3[PPPPV[a\x07\xC6\x81a\x02\x01V[a\0\xC7\x815a\x06\xB0V[`\0a\x07\xDB\x82a\x112V[\x90Pa\x07\xEC\x83\x83`\0\x01Q\x83a\x12\xDFV[PPPV[`\0\x81\x81R` \x81\x90R`@\x90 `\x02\x81T`\xFF\x16`\x03\x81\x11\x15a\x08\x17Wa\x08\x17a\x17\x96V[\x03a\x08`W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x19`$\x82\x01Rx\x12[\x9D\x19[\x9D\x08\x1A\\\xC8\x18[\x1C\x99XY\x1EH\x1C\xD9]\x1D\x1B\x19Y`:\x1B`D\x82\x01R`d\x01a\x02_V[`\x03\x81T`\xFF\x16`\x03\x81\x11\x15a\x08xWa\x08xa\x17\x96V[\x03a\x08\xC5W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1B`$\x82\x01R\x7FIntent is already cancelled\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[\x80T`\xFF\x19\x16`\x03\x17\x81U`@Q\x82\x90\x7F\xC0\x8E\xB6M\xB1j9\xD2\x84\x89`\xAF\x04\xE3\xF1o\xB4\x04\xD9\xD46\xA9\xF0\xE9\xD7\xD0\xD4\x85G\x15\xC9\xDC\x90`\0\x90\xA2PPV[`\x02` R`\0\x90\x81R`@\x90 \x80T`\x01\x82\x01\x80T\x91\x92\x91a\x06-\x90a\x1A\xFAV[``\x81`\x01`\x01`@\x1B\x03\x81\x11\x15a\t;Wa\t;a\x15\xC3V[`@Q\x90\x80\x82R\x80` \x02` \x01\x82\x01`@R\x80\x15a\tdW\x81` \x01` \x82\x02\x806\x837\x01\x90P[P\x90P`\0[\x82\x81\x10\x15a\t\xC8Wa\t\x99\x84\x84\x83\x81\x81\x10a\t\x87Wa\t\x87a\x1FAV[\x90P` \x02\x81\x01\x90a\0\xED\x91\x90a\x1FWV[\x82\x82\x81Q\x81\x10a\t\xABWa\t\xABa\x1FAV[` \x90\x81\x02\x91\x90\x91\x01\x01R\x80a\t\xC0\x81a\x1FwV[\x91PPa\tjV[P\x92\x91PPV[`\0[\x81\x81\x10\x15a\x07\xECWa\t\xFB\x83\x83\x83\x81\x81\x10a\t\xEFWa\t\xEFa\x1FAV[\x90P` \x02\x015a\x07\xF1V[\x80a\n\x05\x81a\x1FwV[\x91PPa\t\xD2V[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\n*\x92\x91\x90a\x1F\x9EV[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0\x81`\0\x01Q\x82` \x01Q`@Q` \x01a\n*\x92\x91\x90a\x1F\xC4V[`\0\x81\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x82\x90\x82\x90a\n\x8A\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\n\xB6\x90a\x1A\xFAV[\x80\x15a\x0B\x03W\x80`\x1F\x10a\n\xD8Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0B\x03V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\n\xE6W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0B\x1C\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0BH\x90a\x1A\xFAV[\x80\x15a\x0B\x95W\x80`\x1F\x10a\x0BjWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0B\x95V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0BxW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\x0B\xBA\x91\x90a NV[\x90Pa\x07\xEC\x82` \x01Q\x82a\x07\xD0V[`\0\x82\x81R`\x01` R`@\x80\x82 \x81Q\x80\x83\x01\x90\x92R\x80T\x83\x92\x91\x90\x82\x90\x82\x90a\x0B\xF4\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0C \x90a\x1A\xFAV[\x80\x15a\x0CmW\x80`\x1F\x10a\x0CBWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0CmV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0CPW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81R` \x01`\x01\x82\x01\x80Ta\x0C\x86\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\x0C\xB2\x90a\x1A\xFAV[\x80\x15a\x0C\xFFW\x80`\x1F\x10a\x0C\xD4Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x0C\xFFV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x0C\xE2W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81`\0\x01Q\x80` \x01\x90Q\x81\x01\x90a\r$\x91\x90a NV[\x90P`\0`\x02`\0\x86\x81R` \x01\x90\x81R` \x01`\0 `@Q\x80`@\x01`@R\x90\x81`\0\x82\x01T\x81R` \x01`\x01\x82\x01\x80Ta\r`\x90a\x1A\xFAV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\r\x8C\x90a\x1A\xFAV[\x80\x15a\r\xD9W\x80`\x1F\x10a\r\xAEWa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\r\xD9V[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\r\xBCW\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81RPP\x90P`\0\x81` \x01Q\x80` \x01\x90Q\x81\x01\x90a\r\xFE\x91\x90a!1V[\x90P`\0a\x0E\x0B\x84a\x13\xC9V[`\x03T` \x86\x01Q`@Qc\xB6n\x93_`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x91\x16`\x04\x82\x01R\x91\x92P`\x01`\x01`\xA0\x1B\x03\x16\x90c\xB6n\x93_\x90`$\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x0E`W=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x0E\x84\x91\x90a!kV[`\x01`\x01`\xA0\x1B\x03\x16cu\xE3f\x16a\x0E\x9B\x83a\x14\tV[`@Q\x82c\xFF\xFF\xFF\xFF\x16`\xE0\x1B\x81R`\x04\x01a\x0E\xB9\x91\x81R` \x01\x90V[` `@Q\x80\x83\x03\x81`\0\x87Z\xF1\x15\x80\x15a\x0E\xD8W=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x0E\xFC\x91\x90a!\x8FV[a\x0FHW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1A`$\x82\x01R\x7Ftoken not locked at source\0\0\0\0\0\0`D\x82\x01R`d\x01a\x02_V[`\x03T`@\x85\x81\x01Q\x90Qc\xB6n\x93_`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x91\x16`\x04\x82\x01R`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x90c\xB6n\x93_\x90`$\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x0F\x9CW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x0F\xC0\x91\x90a!kV[`\x01`\x01`\xA0\x1B\x03\x16cu\xE3f\x16a\x0F\xE1\x83\x85`\0\x01Q\x86` \x01Qa\x14(V[`@Q\x82c\xFF\xFF\xFF\xFF\x16`\xE0\x1B\x81R`\x04\x01a\x0F\xFF\x91\x81R` \x01\x90V[` `@Q\x80\x83\x03\x81`\0\x87Z\xF1\x15\x80\x15a\x10\x1EW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x10B\x91\x90a!\x8FV[a\x10\x98W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`!`$\x82\x01R\x7Fswap not fulfilled at destinatio`D\x82\x01R`7`\xF9\x1B`d\x82\x01R`\x84\x01a\x02_V[`\x04\x80T` \x86\x01Q``\x87\x01Q`\xA0\x88\x01Q\x86Q`@Qc\x18\x06\xC3C`\xE0\x1B\x81Rc\xFF\xFF\xFF\xFF\x90\x94\x16\x95\x84\x01\x95\x90\x95R`\x01`\x01`\xA0\x1B\x03\x91\x82\x16`$\x84\x01R`D\x83\x01R\x92\x83\x16`d\x82\x01R\x91\x16\x90c\x18\x06\xC3C\x90`\x84\x01`\0`@Q\x80\x83\x03\x81`\0\x87\x80;\x15\x80\x15a\x11\x0CW`\0\x80\xFD[PZ\xF1\x15\x80\x15a\x11 W=`\0\x80>=`\0\xFD[P`\x01\x9B\x9APPPPPPPPPPPV[`@\x80Q\x7F\xC2\xF8xqv\xB8\xACk\xF7![J\xDC\xC1\xE0i\xBFJ\xB8-\x9A\xB1\xDF\x05\xA5z\x91\xD4%\x93[n` \x82\x01R\x7F\xD4\xE2\xD2a\xFF\xA0\xA31\xA9>\xD4\xAE\xE4\x94\x07o\xDC\x03\xDA\x7F\x1A\x99\xDFT\xA9d\x8Ca\xCA\x1D\x85\x94\x91\x81\x01\x91\x90\x91R\x7F\x06\xC0\x15\xBD\"\xB4\xC6\x96\x90\x93<\x10X\x87\x8E\xBD\xFE\xF3\x1F\x9A\xAA\xE4\x0B\xBE\x86\xD8\xA0\x9F\xE1\xB2\x97,``\x82\x01RF`\x80\x82\x01R`\0\x90\x81\x90`\xA0\x01`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 \x86Q\x92\x87\x01Q`\x80\x88\x01Q`\xA0\x89\x01Q\x89\x85\x01Q`\xC0\x8B\x01Q\x80Q\x90\x87\x01 ``\x8C\x01Q`\xE0\x8D\x01Qa\x01\0\x8E\x01Q\x97\x9BP`\0\x9Aa\x12\x8C\x9A\x7F\x9F4\xD6E\xC3}:\xED\xB5\x03Rz\x88\xEB=\xAF\x0B\xAD\xF2*\xDE\x9B\x80C\x07\xCD\xD0\xBF2\x8A\x9B\x13\x9A\x90\x99\x91\x01\x99\x8AR`\x01`\x01`\xA0\x1B\x03\x98\x89\x16` \x8B\x01Rc\xFF\xFF\xFF\xFF\x97\x88\x16`@\x8B\x01R\x95\x88\x16``\x8A\x01R`\x80\x89\x01\x94\x90\x94R\x91\x90\x94\x16`\xA0\x87\x01R`\xC0\x86\x01\x93\x90\x93R\x91\x90\x92\x16`\xE0\x84\x01Ra\x01\0\x83\x01Ra\x01 \x82\x01Ra\x01@\x01\x90V[`@\x80Q\x80\x83\x03`\x1F\x19\x01\x81R\x82\x82R\x80Q` \x91\x82\x01 a\x19\x01`\xF0\x1B\x82\x85\x01R`\"\x84\x01\x95\x90\x95R`B\x80\x84\x01\x95\x90\x95R\x81Q\x80\x84\x03\x90\x95\x01\x85R`b\x90\x92\x01\x90R\x82Q\x92\x01\x91\x90\x91 \x93\x92PPPV[`\0\x80`\0a\x12\xED\x86a\x14^V[`@\x80Q`\0\x81R` \x81\x01\x80\x83R\x89\x90R`\xFF\x85\x16\x91\x81\x01\x91\x90\x91R``\x81\x01\x83\x90R`\x80\x81\x01\x82\x90R\x92\x95P\x90\x93P\x91P`\x01`\x01`\xA0\x1B\x03\x86\x16\x90`\x01\x90`\xA0\x01` `@Q` \x81\x03\x90\x80\x84\x03\x90\x85Z\xFA\x15\x80\x15a\x13SW=`\0\x80>=`\0\xFD[PPP` `@Q\x03Q`\x01`\x01`\xA0\x1B\x03\x16\x14a\x13\xC1W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`%`$\x82\x01R\x7FVerification error: Signer is in`D\x82\x01Rd\x1D\x98[\x1AY`\xDA\x1B`d\x82\x01R`\x84\x01a\x02_V[PPPPPPV[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q`\xC0\x89\x01Q`\xE0\x8A\x01Qa\x01\0\x8B\x01Q\x96Q`\0\x9Aa\n*\x9A\x90\x99\x98\x91\x01a!\xB1V[`\0a\x14\"`@Q\x80` \x01`@R\x80\x84\x81RPa\x14\xE0V[\x92\x91PPV[`\0a\x14V`@Q\x80``\x01`@R\x80\x86\x81R` \x01\x85`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x84\x81RPa\x15\x14V[\x94\x93PPPPV[`\0\x80`\0\x83Q`A\x14a\x14\xC4W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`'`$\x82\x01R\x7FThe signature length is not equa`D\x82\x01Rfl to 65`\xC8\x1B`d\x82\x01R`\x84\x01a\x02_V[PPP` \x81\x01Q`@\x82\x01Q``\x90\x92\x01Q`\0\x1A\x92\x90\x91\x90V[\x80Q`@QrSwapIntentTokenLock`h\x1B` \x82\x01R`3\x81\x01\x91\x90\x91R`\0\x90`S\x01a\n*V[`\0\x81`\0\x01Q\x82` \x01Q\x83`@\x01Q`@Q` \x01a\n*\x93\x92\x91\x90o\x14\xDD\xD8\\\x12[\x9D\x19[\x9D\x11\x9A[\x1B\x19Y`\x82\x1B\x81R`\x10\x81\x01\x93\x90\x93R``\x91\x90\x91\x1Bk\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x16`0\x83\x01R`D\x82\x01R`d\x01\x90V[P\x80Ta\x15\x81\x90a\x1A\xFAV[`\0\x82U\x80`\x1F\x10a\x15\x91WPPV[`\x1F\x01` \x90\x04\x90`\0R` `\0 \x90\x81\x01\x90a\0\xC7\x91\x90[\x80\x82\x11\x15a\x15\xBFW`\0\x81U`\x01\x01a\x15\xABV[P\x90V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@\x80Q\x90\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x15\xFBWa\x15\xFBa\x15\xC3V[`@R\x90V[`@Qa\x01 \x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x15\xFBWa\x15\xFBa\x15\xC3V[`@Q`\x1F\x82\x01`\x1F\x19\x16\x81\x01`\x01`\x01`@\x1B\x03\x81\x11\x82\x82\x10\x17\x15a\x16LWa\x16La\x15\xC3V[`@R\x91\x90PV[`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\0\xC7W`\0\x80\xFD[\x805a\x16t\x81a\x16TV[\x91\x90PV[`\0`@\x82\x84\x03\x12\x15a\x16\x8BW`\0\x80\xFD[a\x16\x93a\x15\xD9V[\x825a\x16\x9E\x81a\x16TV[\x81R` \x92\x83\x015\x92\x81\x01\x92\x90\x92RP\x91\x90PV[`\0`@\x82\x84\x03\x12\x15a\x16\xC5W`\0\x80\xFD[P\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x16\xDDW`\0\x80\xFD[\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x16\xF3W`\0\x80\xFD[a\x14V\x84\x82\x85\x01a\x16\xB3V[`\0` \x82\x84\x03\x12\x15a\x17\x11W`\0\x80\xFD[P5\x91\x90PV[`\0[\x83\x81\x10\x15a\x173W\x81\x81\x01Q\x83\x82\x01R` \x01a\x17\x1BV[PP`\0\x91\x01RV[`\0\x81Q\x80\x84Ra\x17T\x81` \x86\x01` \x86\x01a\x17\x18V[`\x1F\x01`\x1F\x19\x16\x92\x90\x92\x01` \x01\x92\x91PPV[`@\x81R`\0a\x17{`@\x83\x01\x85a\x17<V[\x82\x81\x03` \x84\x01Ra\x17\x8D\x81\x85a\x17<V[\x95\x94PPPPPV[cNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[`@\x81\x01`\x04\x84\x10a\x17\xCEWcNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[\x92\x81R` \x01R\x90V[`\0`\x01`\x01`@\x1B\x03\x82\x11\x15a\x17\xF1Wa\x17\xF1a\x15\xC3V[P`\x1F\x01`\x1F\x19\x16` \x01\x90V[`\0\x82`\x1F\x83\x01\x12a\x18\x10W`\0\x80\xFD[\x815a\x18#a\x18\x1E\x82a\x17\xD8V[a\x16$V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a\x188W`\0\x80\xFD[\x81` \x85\x01` \x83\x017`\0\x91\x81\x01` \x01\x91\x90\x91R\x93\x92PPPV[c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\0\xC7W`\0\x80\xFD[\x805a\x16t\x81a\x18UV[`\0\x80`@\x83\x85\x03\x12\x15a\x18\x85W`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\x18\x9CW`\0\x80\xFD[a\x18\xA8\x86\x83\x87\x01a\x17\xFFV[\x93P` \x85\x015\x91P\x80\x82\x11\x15a\x18\xBEW`\0\x80\xFD[\x90\x84\x01\x90a\x01 \x82\x87\x03\x12\x15a\x18\xD3W`\0\x80\xFD[a\x18\xDBa\x16\x01V[a\x18\xE4\x83a\x16iV[\x81Ra\x18\xF2` \x84\x01a\x18gV[` \x82\x01Ra\x19\x03`@\x84\x01a\x18gV[`@\x82\x01Ra\x19\x14``\x84\x01a\x16iV[``\x82\x01Ra\x19%`\x80\x84\x01a\x16iV[`\x80\x82\x01R`\xA0\x83\x015`\xA0\x82\x01R`\xC0\x83\x015\x82\x81\x11\x15a\x19FW`\0\x80\xFD[a\x19R\x88\x82\x86\x01a\x17\xFFV[`\xC0\x83\x01RP`\xE0\x83\x015`\xE0\x82\x01Ra\x01\0\x91P\x81\x83\x015\x82\x82\x01R\x80\x93PPPP\x92P\x92\x90PV[\x82\x81R`@` \x82\x01R`\0a\x14V`@\x83\x01\x84a\x17<V[`\0\x80\x83`\x1F\x84\x01\x12a\x19\xA7W`\0\x80\xFD[P\x815`\x01`\x01`@\x1B\x03\x81\x11\x15a\x19\xBEW`\0\x80\xFD[` \x83\x01\x91P\x83` \x82`\x05\x1B\x85\x01\x01\x11\x15a\x19\xD9W`\0\x80\xFD[\x92P\x92\x90PV[`\0\x80` \x83\x85\x03\x12\x15a\x19\xF3W`\0\x80\xFD[\x825`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1A\tW`\0\x80\xFD[a\x1A\x15\x85\x82\x86\x01a\x19\x95V[\x90\x96\x90\x95P\x93PPPPV[` \x80\x82R\x82Q\x82\x82\x01\x81\x90R`\0\x91\x90\x84\x82\x01\x90`@\x85\x01\x90\x84[\x81\x81\x10\x15a\x1AYW\x83Q\x83R\x92\x84\x01\x92\x91\x84\x01\x91`\x01\x01a\x1A=V[P\x90\x96\x95PPPPPPV[`\0`@\x826\x03\x12\x15a\x1AwW`\0\x80\xFD[a\x1A\x7Fa\x15\xD9V[\x825\x81R` \x83\x015`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1A\x9CW`\0\x80\xFD[a\x1A\xA86\x82\x86\x01a\x17\xFFV[` \x83\x01RP\x92\x91PPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1A\xCBW`\0\x80\xFD[\x83\x01\x805\x91P`\x01`\x01`@\x1B\x03\x82\x11\x15a\x1A\xE5W`\0\x80\xFD[` \x01\x91P6\x81\x90\x03\x82\x13\x15a\x19\xD9W`\0\x80\xFD[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x1B\x0EW`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x16\xC5WcNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[`\x1F\x82\x11\x15a\x07\xECW`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x1BUWP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x13\xC1W\x82\x81U`\x01\x01a\x1BaV[`\0\x19`\x03\x83\x90\x1B\x1C\x19\x16`\x01\x91\x90\x91\x1B\x17\x90V[`\x01`\x01`@\x1B\x03\x83\x11\x15a\x1B\xA0Wa\x1B\xA0a\x15\xC3V[a\x1B\xB4\x83a\x1B\xAE\x83Ta\x1A\xFAV[\x83a\x1B.V[`\0`\x1F\x84\x11`\x01\x81\x14a\x1B\xE2W`\0\x85\x15a\x1B\xD0WP\x83\x82\x015[a\x1B\xDA\x86\x82a\x1BtV[\x84UPa\x1C<V[`\0\x83\x81R` \x90 `\x1F\x19\x86\x16\x90\x83[\x82\x81\x10\x15a\x1C\x13W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a\x1B\xF3V[P\x86\x82\x10\x15a\x1C0W`\0\x19`\xF8\x88`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x85`\x01\x1B\x01\x83U[PPPPPV[\x815\x81U`\x01\x80\x82\x01` a\x1CZ\x81\x86\x01\x86a\x1A\xB4V[`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1CqWa\x1Cqa\x15\xC3V[a\x1C\x85\x81a\x1C\x7F\x86Ta\x1A\xFAV[\x86a\x1B.V[`\0`\x1F\x82\x11`\x01\x81\x14a\x1C\xB3W`\0\x83\x15a\x1C\xA1WP\x83\x82\x015[a\x1C\xAB\x84\x82a\x1BtV[\x87UPa\x1D\x08V[`\0\x86\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a\x1C\xE1W\x86\x85\x015\x82U\x93\x87\x01\x93\x90\x89\x01\x90\x87\x01a\x1C\xC4V[P\x84\x82\x10\x15a\x1C\xFEW`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP\x86\x83\x88\x1B\x01\x86U[PPPPPPPPPV[`\0\x80\x835`\x1E\x19\x846\x03\x01\x81\x12a\x1D*W`\0\x80\xFD[\x83\x01` \x81\x01\x92P5\x90P`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1DIW`\0\x80\xFD[\x806\x03\x82\x13\x15a\x19\xD9W`\0\x80\xFD[\x81\x83R\x81\x81` \x85\x017P`\0\x82\x82\x01` \x90\x81\x01\x91\x90\x91R`\x1F\x90\x91\x01`\x1F\x19\x16\x90\x91\x01\x01\x90V[` \x81R\x815` \x82\x01R`\0a\x1D\x9B` \x84\x01\x84a\x1D\x13V[`@\x80\x85\x01Ra\x17\x8D``\x85\x01\x82\x84a\x1DXV[`\0`@\x826\x03\x12\x15a\x1D\xC1W`\0\x80\xFD[a\x1D\xC9a\x15\xD9V[\x825`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\x1D\xE0W`\0\x80\xFD[a\x1D\xEC6\x83\x87\x01a\x17\xFFV[\x83R` \x85\x015\x91P\x80\x82\x11\x15a\x1E\x02W`\0\x80\xFD[Pa\x1A\xA86\x82\x86\x01a\x17\xFFV[a\x1E\x19\x82\x83a\x1A\xB4V[`\x01`\x01`@\x1B\x03\x81\x11\x15a\x1E0Wa\x1E0a\x15\xC3V[a\x1ED\x81a\x1E>\x85Ta\x1A\xFAV[\x85a\x1B.V[`\0`\x1F\x82\x11`\x01\x81\x14a\x1ErW`\0\x83\x15a\x1E`WP\x83\x82\x015[a\x1Ej\x84\x82a\x1BtV[\x86UPa\x1E\xCCV[`\0\x85\x81R` \x90 `\x1F\x19\x84\x16\x90\x83[\x82\x81\x10\x15a\x1E\xA3W\x86\x85\x015\x82U` \x94\x85\x01\x94`\x01\x90\x92\x01\x91\x01a\x1E\x83V[P\x84\x82\x10\x15a\x1E\xC0W`\0\x19`\xF8\x86`\x03\x1B\x16\x1C\x19\x84\x87\x015\x16\x81U[PP`\x01\x83`\x01\x1B\x01\x85U[PPPPa\x1E\xDD` \x83\x01\x83a\x1A\xB4V[a\x07\xB7\x81\x83`\x01\x86\x01a\x1B\x89V[` \x81R`\0a\x1E\xFB\x83\x84a\x1D\x13V[`@` \x85\x01Ra\x1F\x10``\x85\x01\x82\x84a\x1DXV[\x91PPa\x1F ` \x85\x01\x85a\x1D\x13V[\x84\x83\x03`\x1F\x19\x01`@\x86\x01Ra\x1F7\x83\x82\x84a\x1DXV[\x96\x95PPPPPPV[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`\0\x825`>\x19\x836\x03\x01\x81\x12a\x1FmW`\0\x80\xFD[\x91\x90\x91\x01\x92\x91PPV[`\0`\x01\x82\x01a\x1F\x97WcNH{q`\xE0\x1B`\0R`\x11`\x04R`$`\0\xFD[P`\x01\x01\x90V[\x82\x81R`\0\x82Qa\x1F\xB6\x81` \x85\x01` \x87\x01a\x17\x18V[\x91\x90\x91\x01` \x01\x93\x92PPPV[`\0\x83Qa\x1F\xD6\x81\x84` \x88\x01a\x17\x18V[\x83Q\x90\x83\x01\x90a\x1F\xEA\x81\x83` \x88\x01a\x17\x18V[\x01\x94\x93PPPPV[\x80Qa\x16t\x81a\x16TV[\x80Qa\x16t\x81a\x18UV[`\0\x82`\x1F\x83\x01\x12a \x1AW`\0\x80\xFD[\x81Qa (a\x18\x1E\x82a\x17\xD8V[\x81\x81R\x84` \x83\x86\x01\x01\x11\x15a =W`\0\x80\xFD[a\x14V\x82` \x83\x01` \x87\x01a\x17\x18V[`\0` \x82\x84\x03\x12\x15a `W`\0\x80\xFD[\x81Q`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a wW`\0\x80\xFD[\x90\x83\x01\x90a\x01 \x82\x86\x03\x12\x15a \x8CW`\0\x80\xFD[a \x94a\x16\x01V[a \x9D\x83a\x1F\xF3V[\x81Ra \xAB` \x84\x01a\x1F\xFEV[` \x82\x01Ra \xBC`@\x84\x01a\x1F\xFEV[`@\x82\x01Ra \xCD``\x84\x01a\x1F\xF3V[``\x82\x01Ra \xDE`\x80\x84\x01a\x1F\xF3V[`\x80\x82\x01R`\xA0\x83\x01Q`\xA0\x82\x01R`\xC0\x83\x01Q\x82\x81\x11\x15a \xFFW`\0\x80\xFD[a!\x0B\x87\x82\x86\x01a \tV[`\xC0\x83\x01RP`\xE0\x83\x81\x01Q\x90\x82\x01Ra\x01\0\x92\x83\x01Q\x92\x81\x01\x92\x90\x92RP\x93\x92PPPV[`\0`@\x82\x84\x03\x12\x15a!CW`\0\x80\xFD[a!Ka\x15\xD9V[\x82Qa!V\x81a\x16TV[\x81R` \x92\x83\x01Q\x92\x81\x01\x92\x90\x92RP\x91\x90PV[`\0` \x82\x84\x03\x12\x15a!}W`\0\x80\xFD[\x81Qa!\x88\x81a\x16TV[\x93\x92PPPV[`\0` \x82\x84\x03\x12\x15a!\xA1W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a!\x88W`\0\x80\xFD[`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x8C``\x1B\x16\x83Rc\xFF\xFF\xFF\xFF`\xE0\x1B\x80\x8C`\xE0\x1B\x16`\x14\x85\x01R\x80\x8B`\xE0\x1B\x16`\x18\x85\x01RP\x80\x89``\x1B\x16`\x1C\x84\x01R\x80\x88``\x1B\x16`0\x84\x01RP\x85`D\x83\x01R\x84Qa\"\x18\x81`d\x85\x01` \x89\x01a\x17\x18V[\x90\x91\x01`d\x81\x01\x93\x90\x93RP`\x84\x82\x01R`\xA4\x01\x97\x96PPPPPPPV\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The deployed bytecode of the contract.
    pub static SWAPINTENTBOOK_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct SwapIntentBook<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for SwapIntentBook<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for SwapIntentBook<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for SwapIntentBook<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for SwapIntentBook<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(SwapIntentBook))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> SwapIntentBook<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                SWAPINTENTBOOK_ABI.clone(),
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
                SWAPINTENTBOOK_ABI.clone(),
                SWAPINTENTBOOK_BYTECODE.clone().into(),
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
        ///Calls the contract's `verify` (0x03895c91) function
        pub fn verify(
            &self,
            swap_intent_bid: SwapIntentBid,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([3, 137, 92, 145], (swap_intent_bid,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `verifySignature` (0x9ea6cb82) function
        pub fn verify_signature(
            &self,
            signature: ::ethers::core::types::Bytes,
            swap_intent_order: SwapIntent,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([158, 166, 203, 130], (signature, swap_intent_order))
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
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, SwapIntentBookEvents>
        {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for SwapIntentBook<M>
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
    pub enum SwapIntentBookEvents {
        IntentCancelledFilter(IntentCancelledFilter),
        IntentCreatedFilter(IntentCreatedFilter),
        IntentMatchFilter(IntentMatchFilter),
        IntentPartiallySettledFilter(IntentPartiallySettledFilter),
        IntentSettledFilter(IntentSettledFilter),
    }
    impl ::ethers::contract::EthLogDecode for SwapIntentBookEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = IntentCancelledFilter::decode_log(log) {
                return Ok(SwapIntentBookEvents::IntentCancelledFilter(decoded));
            }
            if let Ok(decoded) = IntentCreatedFilter::decode_log(log) {
                return Ok(SwapIntentBookEvents::IntentCreatedFilter(decoded));
            }
            if let Ok(decoded) = IntentMatchFilter::decode_log(log) {
                return Ok(SwapIntentBookEvents::IntentMatchFilter(decoded));
            }
            if let Ok(decoded) = IntentPartiallySettledFilter::decode_log(log) {
                return Ok(SwapIntentBookEvents::IntentPartiallySettledFilter(decoded));
            }
            if let Ok(decoded) = IntentSettledFilter::decode_log(log) {
                return Ok(SwapIntentBookEvents::IntentSettledFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for SwapIntentBookEvents {
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
    impl ::core::convert::From<IntentCancelledFilter> for SwapIntentBookEvents {
        fn from(value: IntentCancelledFilter) -> Self {
            Self::IntentCancelledFilter(value)
        }
    }
    impl ::core::convert::From<IntentCreatedFilter> for SwapIntentBookEvents {
        fn from(value: IntentCreatedFilter) -> Self {
            Self::IntentCreatedFilter(value)
        }
    }
    impl ::core::convert::From<IntentMatchFilter> for SwapIntentBookEvents {
        fn from(value: IntentMatchFilter) -> Self {
            Self::IntentMatchFilter(value)
        }
    }
    impl ::core::convert::From<IntentPartiallySettledFilter> for SwapIntentBookEvents {
        fn from(value: IntentPartiallySettledFilter) -> Self {
            Self::IntentPartiallySettledFilter(value)
        }
    }
    impl ::core::convert::From<IntentSettledFilter> for SwapIntentBookEvents {
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
    ///Container type for all input parameters for the `verify` function with signature `verify((address,uint256))` and selector `0x03895c91`
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
    #[ethcall(name = "verify", abi = "verify((address,uint256))")]
    pub struct VerifyCall {
        pub swap_intent_bid: SwapIntentBid,
    }
    ///Container type for all input parameters for the `verifySignature` function with signature `verifySignature(bytes,(address,uint32,uint32,address,address,uint256,bytes,uint256,uint256))` and selector `0x9ea6cb82`
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
        abi = "verifySignature(bytes,(address,uint32,uint32,address,address,uint256,bytes,uint256,uint256))"
    )]
    pub struct VerifySignatureCall {
        pub signature: ::ethers::core::types::Bytes,
        pub swap_intent_order: SwapIntent,
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
    pub enum SwapIntentBookCalls {
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
        Verify(VerifyCall),
        VerifySignature(VerifySignatureCall),
    }
    impl ::ethers::core::abi::AbiDecode for SwapIntentBookCalls {
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
            if let Ok(decoded) = <VerifyCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Verify(decoded));
            }
            if let Ok(decoded) =
                <VerifySignatureCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VerifySignature(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for SwapIntentBookCalls {
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
                Self::Verify(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VerifySignature(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for SwapIntentBookCalls {
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
                Self::Verify(element) => ::core::fmt::Display::fmt(element, f),
                Self::VerifySignature(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<CancelBatchIntentCall> for SwapIntentBookCalls {
        fn from(value: CancelBatchIntentCall) -> Self {
            Self::CancelBatchIntent(value)
        }
    }
    impl ::core::convert::From<CancelIntentCall> for SwapIntentBookCalls {
        fn from(value: CancelIntentCall) -> Self {
            Self::CancelIntent(value)
        }
    }
    impl ::core::convert::From<IntentBidDataCall> for SwapIntentBookCalls {
        fn from(value: IntentBidDataCall) -> Self {
            Self::IntentBidData(value)
        }
    }
    impl ::core::convert::From<IntentDataCall> for SwapIntentBookCalls {
        fn from(value: IntentDataCall) -> Self {
            Self::IntentData(value)
        }
    }
    impl ::core::convert::From<IntentStatesCall> for SwapIntentBookCalls {
        fn from(value: IntentStatesCall) -> Self {
            Self::IntentStates(value)
        }
    }
    impl ::core::convert::From<MatchAndSettleCall> for SwapIntentBookCalls {
        fn from(value: MatchAndSettleCall) -> Self {
            Self::MatchAndSettle(value)
        }
    }
    impl ::core::convert::From<MatchIntentCall> for SwapIntentBookCalls {
        fn from(value: MatchIntentCall) -> Self {
            Self::MatchIntent(value)
        }
    }
    impl ::core::convert::From<PlaceBatchIntentCall> for SwapIntentBookCalls {
        fn from(value: PlaceBatchIntentCall) -> Self {
            Self::PlaceBatchIntent(value)
        }
    }
    impl ::core::convert::From<PlaceIntentCall> for SwapIntentBookCalls {
        fn from(value: PlaceIntentCall) -> Self {
            Self::PlaceIntent(value)
        }
    }
    impl ::core::convert::From<SettleIntentCall> for SwapIntentBookCalls {
        fn from(value: SettleIntentCall) -> Self {
            Self::SettleIntent(value)
        }
    }
    impl ::core::convert::From<VerifyCall> for SwapIntentBookCalls {
        fn from(value: VerifyCall) -> Self {
            Self::Verify(value)
        }
    }
    impl ::core::convert::From<VerifySignatureCall> for SwapIntentBookCalls {
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
    ///`SwapIntentBid(address,uint256)`
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
    pub struct SwapIntentBid {
        pub filler: ::ethers::core::types::Address,
        pub fill_amount: ::ethers::core::types::U256,
    }
}
