pub use intent_book::*;
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
pub mod intent_book {
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![
                    ::ethers::core::abi::ethabi::Param {
                        name: ::std::borrow::ToOwned::to_owned("solutionLib"),
                        kind: ::ethers::core::abi::ethabi::ParamType::Address,
                        internal_type: ::core::option::Option::Some(
                            ::std::borrow::ToOwned::to_owned("address"),
                        ),
                    },
                ],
            }),
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("addPublisher"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("addPublisher"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("newPublisher"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("addSolver"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("addSolver"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("newSolver"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("cancelIntent"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("cancelIntent"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("checkIntentValidToSpend"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned(
                                "checkIntentValidToSpend",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("signedIntent"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                        ],
                                                    ),
                                                ],
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Bytes,
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct SignedIntent"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bool"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getIntent"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getIntent"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                        ::std::boxed::Box::new(
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                        ),
                                                    ),
                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                        ::std::boxed::Box::new(
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                        ),
                                                    ),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                ],
                                            ),
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct Intent"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getIntentChainRoot"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getIntentChainRoot"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getIntentId"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getIntentId"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intent"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                        ::std::boxed::Box::new(
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                        ),
                                                    ),
                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                        ::std::boxed::Box::new(
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                        ),
                                                    ),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                ],
                                            ),
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct Intent"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getIntentIdsByAuthor"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned(
                                "getIntentIdsByAuthor",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("author"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32[]"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getIntentState"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getIntentState"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("enum IntentState"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getNonce"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getNonce"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("_user"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getNonce"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getReceiptManager"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getReceiptManager"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getSignedIntent"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getSignedIntent"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                        ],
                                                    ),
                                                ],
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Bytes,
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct SignedIntent"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getTokenManager"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getTokenManager"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("isSolver"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("isSolver"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("solver"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bool"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("lockIntent"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("lockIntent"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("lockIntents"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("lockIntents"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentIds"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32[]"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("owner"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("owner"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("publishIntent"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("publishIntent"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("signedIntent"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                        ],
                                                    ),
                                                ],
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Bytes,
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct SignedIntent"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("removePublisher"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("removePublisher"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("publisher"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("removeSolver"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("removeSolver"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("newSolver"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("renounceOwnership"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("renounceOwnership"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("setReceiptManager"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("setReceiptManager"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("receiptManager"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("setTokenManager"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("setTokenManager"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("tokenManager"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("solve"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("solve"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("_solution"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                                ::std::vec![
                                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                                        ::std::boxed::Box::new(
                                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                                        ),
                                                                    ),
                                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                                        ::std::boxed::Box::new(
                                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                                        ),
                                                                    ),
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                                ],
                                                            ),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                                ::std::vec![
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                                ],
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct Solution"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("transferOwnership"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("transferOwnership"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("newOwner"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("validateSolutionInputs"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned(
                                "validateSolutionInputs",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("solution"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                                        ::std::vec![
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                                ::std::vec![
                                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                                        ::std::boxed::Box::new(
                                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                                        ),
                                                                    ),
                                                                    ::ethers::core::abi::ethabi::ParamType::Array(
                                                                        ::std::boxed::Box::new(
                                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                                        ),
                                                                    ),
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                                ],
                                                            ),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                                ::std::vec![
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                                ],
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                ::std::boxed::Box::new(
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(64usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                        ],
                                                    ),
                                                ),
                                            ),
                                        ],
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct Solution"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                    ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                        ::std::vec![
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Array(
                                                                ::std::boxed::Box::new(
                                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                                ),
                                                            ),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                            ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                                        ],
                                                    ),
                                                ],
                                            ),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("struct Intent[]"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
            ]),
            events: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("IntentCancelled"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("IntentCancelled"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    indexed: true,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentCreated"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("IntentCreated"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    indexed: true,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("author"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: true,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("srcMToken"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: true,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("srcAmount"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("mTokens"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::Address,
                                        ),
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("mAmounts"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                        ),
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned(
                                        "outcomeAssetStructure",
                                    ),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("fillStructure"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                                    indexed: false,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentLocked"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("IntentLocked"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    indexed: true,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentPublisherAdded"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentPublisherAdded",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("publisher"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: true,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentPublisherRevoked"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentPublisherRevoked",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("publisher"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: true,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentSolved"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("IntentSolved"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    indexed: true,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("OwnershipTransferred"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned(
                                "OwnershipTransferred",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("previousOwner"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: true,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("newOwner"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: true,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
            ]),
            errors: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned(
                        "IntentBook__CannotCancelNonOpenIntent",
                    ),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__CannotCancelNonOpenIntent",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned(
                        "IntentBook__CannotLockIntentThatIsNotOpen",
                    ),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__CannotLockIntentThatIsNotOpen",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned(
                        "IntentBook__CannotSpendIntentThatIsNotOpen",
                    ),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__CannotSpendIntentThatIsNotOpen",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__IntentAlreadyExists"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__IntentAlreadyExists",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("_intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__IntentExpired"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__IntentExpired",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__IntentNotFound"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__IntentNotFound",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__IntentNotSpendable"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__IntentNotSpendable",
                            ),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("intentId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__InvalidIntentAuthor"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__InvalidIntentAuthor",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__InvalidIntentNonce"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__InvalidIntentNonce",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("IntentBook__InvalidSignature"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__InvalidSignature",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned(
                        "IntentBook__UnauthorizedCancellationAttempt",
                    ),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__UnauthorizedCancellationAttempt",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned(
                        "IntentBook__UnauthorizedIntentPublisher",
                    ),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::AbiError {
                            name: ::std::borrow::ToOwned::to_owned(
                                "IntentBook__UnauthorizedIntentPublisher",
                            ),
                            inputs: ::std::vec![],
                        },
                    ],
                ),
            ]),
            receive: false,
            fallback: false,
        }
    }
    ///The parsed JSON ABI of the contract.
    pub static INTENTBOOK_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x804`\xB6W`\x1Fa1\x918\x81\x90\x03\x91\x82\x01`\x1F\x19\x16\x83\x01\x91`\x01`\x01`@\x1B\x03\x83\x11\x84\x84\x10\x17`\xBBW\x80\x84\x92` \x94`@R\x839\x81\x01\x03\x12`\xB6WQ`\x01`\x01`\xA0\x1B\x03\x81\x16\x90\x81\x90\x03`\xB6W`\0\x80T3`\x01`\x01`\xA0\x1B\x03\x19\x82\x16\x81\x17\x83U`@Q\x93\x92\x90\x91`\x01`\x01`\xA0\x1B\x03\x16\x90\x7F\x8B\xE0\x07\x9CS\x16Y\x14\x13D\xCD\x1F\xD0\xA4\xF2\x84\x19I\x7F\x97\"\xA3\xDA\xAF\xE3\xB4\x18okdW\xE0\x90\x80\xA3`\x0B\x80T`\x01`\x01`\xA0\x1B\x03\x19\x16\x91\x90\x91\x17\x90Ua0\xBF\x90\x81a\0\xD2\x829\xF3[`\0\x80\xFD[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD\xFE`\x80`@R`\x046\x10\x15a\0\x12W`\0\x80\xFD[`\0\x805`\xE0\x1C\x80b\xDC\xE5\x13\x14a\x18\xE9W\x80c\x02\xCC%\r\x14a\x18\xAAW\x80c\x14\xE02\x08\x14a\x18\x81W\x80c*\xD7Z\xB1\x14a\x0EMW\x80c-\x035\xAB\x14a\x0E\x14W\x80c/\xF7\x1Ai\x14a\r\xCFW\x80c<\x9D\x93\x98\x14a\r\x9BW\x80c<\xE3\x0E\xBA\x14a\x08=W\x80cm\xC62\xF0\x14a\x07\xB7W\x80cqP\x18\xA6\x14a\x07]W\x80cv?2=\x14a\x06\xF4W\x80c|\xB2\xB7\x9C\x14a\x06\xAFW\x80c\x89\x82\xC7J\x14a\x06lW\x80c\x8D\xA5\xCB[\x14a\x06EW\x80c\x8F\xD5{\x92\x14a\x06\x04W\x80c\xAB\x97\xD5\x9D\x14a\x05\xDBW\x80c\xAEa\xC5\xAE\x14a\x05uW\x80c\xB4%{\x9A\x14a\x05<W\x80c\xCC\x90!\t\x14a\x05\x0EW\x80c\xCD\xCE\xF5\x87\x14a\x04\xEBW\x80c\xD0\x87\xD2\x88\x14a\x04\xC4W\x80c\xD5_\x96\r\x14a\x04\x1AW\x80c\xDC\x94\x80\x9A\x14a\x03yW\x80c\xECX\xF4\xB8\x14a\x035W\x80c\xF1<F\xAA\x14a\x02\xFDW\x80c\xF2\xFD\xE3\x8B\x14a\x027Wc\xF5hU\x9E\x14a\x01EW`\0\x80\xFD[4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045`\x01`\x01`@\x1B\x03\x81\x11a\x022Wa\x01u\x906\x90`\x04\x01a\x19\xF1V[\x90a\x01~a+GV[\x80\x91[\x80Q\x83\x10\x15a\x02.Wa\x01\x94\x83\x82a#\xC5V[Q\x92a\x01\x9Ea+GV[\x83\x83R`\x07` R`\xFF`@\x84 T\x16`\x07\x81\x10\x15a\x02\x1AW`\x01\x03a\x02\x06W\x83\x83\x94`\x01\x93\x94R`\x07` R`@\x85 `\x02`\xFF\x19\x82T\x16\x17\x90U\x7F\x87h\x16\xF4\xC1x]O\xE0\xA5\xFB,\x17>\x1A\x11\x89\xF0\x8D\xBFVd\xFF\x14\xA5P\x99=(\xF4ld\x85\x80\xA2\x01\x91\x90a\x01\x81V[c\x1EO\x9A\x8F`\xE0\x1B\x83R`\x04\x84\x90R`$\x83\xFD[cNH{q`\xE0\x1B\x84R`!`\x04R`$\x84\xFD[P\x80\xF3[P[\x80\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x02Qa\x19\x08V[a\x02Ya+GV[`\x01`\x01`\xA0\x1B\x03\x16\x80\x15a\x02\xA9W\x81T`\x01`\x01`\xA0\x1B\x03\x19\x81\x16\x82\x17\x83U`\x01`\x01`\xA0\x1B\x03\x16\x7F\x8B\xE0\x07\x9CS\x16Y\x14\x13D\xCD\x1F\xD0\xA4\xF2\x84\x19I\x7F\x97\"\xA3\xDA\xAF\xE3\xB4\x18okdW\xE0\x83\x80\xA3\x80\xF3[`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FOwnable: new owner is the zero a`D\x82\x01Reddress`\xD0\x1B`d\x82\x01R`\x84\x90\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x031a\x03\x1D`\x045a)2V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a\x1F\x9EV[\x03\x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x03Oa\x19\x08V[a\x03Wa+GV[`\x01`\x01`\xA0\x1B\x03\x16\x81R`\x03` R`@\x81 \x80T`\xFF\x19\x16`\x01\x17\x90U\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045a\x03\x96a+GV[\x80\x82R`\x07` R`\xFF`@\x83 T\x16`\x07\x81\x10\x15a\x04\x06W`\x01\x03a\x03\xF4W\x80\x82R`\x07` R`@\x82 \x80T`\xFF\x19\x16`\x02\x17\x90U\x7F\x87h\x16\xF4\xC1x]O\xE0\xA5\xFB,\x17>\x1A\x11\x89\xF0\x8D\xBFVd\xFF\x14\xA5P\x99=(\xF4ld\x82\x80\xA2\x80\xF3[c\x1EO\x9A\x8F`\xE0\x1B\x82R`\x04R`$\x90\xFD[cNH{q`\xE0\x1B\x83R`!`\x04R`$\x83\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045\x80\x82R`\x07` R`\xFF`@\x83 T\x16`\x07\x81\x10\x15a\x04\x06W`\x01\x03a\x04\xB5W`\x01`\x01`\xA0\x1B\x03a\x04`\x82a)2V[Q\x163\x03a\x04\xA6W\x80\x82R`\x07` R`@\x82 \x80T`\xFF\x19\x16`\x06\x17\x90U\x7F\xC0\x8E\xB6M\xB1j9\xD2\x84\x89`\xAF\x04\xE3\xF1o\xB4\x04\xD9\xD46\xA9\xF0\xE9\xD7\xD0\xD4\x85G\x15\xC9\xDC\x82\x80\xA2\x80\xF3[ck\xC0\xA3\xC9`\xE0\x1B\x82R`\x04\x82\xFD[cu\xA7\xC9\x1D`\xE1\x1B\x82R`\x04\x82\xFD[P4a\x024W\x80`\x03\x196\x01\x12a\x024W`@` \x913\x81R`\x02\x83R T`@Q\x90\x81R\xF3[P4a\x024W` a\x05\x04a\x04\xFF6a \xFEV[a(\xB1V[`@Q\x90\x15\x15\x81R\xF3[P4a\x024Wa\x031a\x05(a\x05#6a\x1B\xFCV[a'\xB3V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a\"\x03V[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045\x81R`\x07` R`\xFF`@\x82 T\x16`@Q\x90`\x07\x81\x10\x15a\x04\x06W` \x92P\x81R\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x05\x8Fa\x19\x08V[a\x05\x97a+GV[`\x01`\x01`\xA0\x1B\x03\x16\x80\x82R`\x04` R`@\x82 \x80T`\xFF\x19\x16\x90U\x7F\xB0\xC9q|\x14/\x93\xDB\xBD\x96\xF8\x87c\xE6\x91Lq:\x8D+\x1F\xD9z\xFE\x1AD\x07\xCB\x94\x14\xB3;\x82\x80\xA2\x80\xF3[P4a\x024W\x80`\x03\x196\x01\x12a\x024W`\tT`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x06\x1Ea\x19\x08V[a\x06&a+GV[`\x01`\x01`\xA0\x1B\x03\x16\x81R`\x03` R`@\x81 \x80T`\xFF\x19\x16\x90U\x80\xF3[P4a\x024W\x80`\x03\x196\x01\x12a\x024WT`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045\x90`\x01`\x01`@\x1B\x03\x82\x11a\x024W` a\x06\xA7a\x06\xA26`\x04\x86\x01a\x1ANV[a.\x9EV[`@Q\x90\x81R\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x06\xC9a\x19\x08V[a\x06\xD1a+GV[`\x01\x80`\xA0\x1B\x03\x16k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\xA0\x1B`\tT\x16\x17`\tU\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x07\x0Ea\x19\x08V[a\x07\x16a+GV[`\x01`\x01`\xA0\x1B\x03\x16\x80\x82R`\x04` R`@\x82 \x80T`\xFF\x19\x16`\x01\x17\x90U\x7F\xBEv\x91\x0E\x8B,(\x1B\x08\x04q\x13\x94\xE0\x90\xE9&N\xD0`F\xF0\x06\x7F \xB2\xFD\xEB\x93\xD9\x11\x0E\x82\x80\xA2\x80\xF3[P4a\x024W\x80`\x03\x196\x01\x12a\x024Wa\x07va+GV[\x80T`\x01`\x01`\xA0\x1B\x03\x19\x81\x16\x82U\x81\x90`\x01`\x01`\xA0\x1B\x03\x16\x7F\x8B\xE0\x07\x9CS\x16Y\x14\x13D\xCD\x1F\xD0\xA4\xF2\x84\x19I\x7F\x97\"\xA3\xDA\xAF\xE3\xB4\x18okdW\xE0\x82\x80\xA3\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x01`\x01`\xA0\x1B\x03a\x07\xD9a\x19\x08V[\x16\x81R`\x05` R`@\x81 `@Q\x91\x82` \x83T\x91\x82\x81R\x01\x92\x82R` \x82 \x91[\x81\x81\x10a\x08'Wa\x031\x85a\x08\x13\x81\x87\x03\x82a\x19\xB9V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a!\xCFV[\x82T\x84R` \x90\x93\x01\x92`\x01\x92\x83\x01\x92\x01a\x07\xFCV[P4a\x024Wa\x08L6a \xFEV[\x80Q\x903\x83R`\x04` R`\xFF`@\x84 T\x16\x15a\r\x8CW\x80QQ`\x01`\x01`\xA0\x1B\x03\x16\x83R`\x02` R`@\x80\x84 T\x90\x83\x01Q\x11\x15a\r}W` \x82\x01QC\x11a\rnWa\x08\x9C0\x82a+\x9FV[\x15a\r_Wa\x08\xAA\x82a.\x9EV[\x91\x82\x84R`\x07` R`\xFF`@\x85 T\x16`\x07\x81\x10\x15a\rKWa\r7W`\tT\x81Q``\x83\x01\x80Q`\x80\x85\x01\x80Q\x90\x96\x92\x95\x94\x92\x93\x89\x93`\x01`\x01`\xA0\x1B\x03\x93\x84\x16\x93\x91\x82\x16\x91\x16\x80;\x15a\r3W\x84\x92`@Q\x94\x85\x93c)iQ\x11`\xE2\x1B\x85R`\x04\x85\x01R\x8B`$\x85\x01R`D\x84\x01R`d\x83\x01R`\xA0`\x84\x83\x01R\x81\x83\x81a\t8`\xA4\x82\x01\x8Aa \x9BV[\x03\x92Z\xF1\x80\x15a\r(Wa\r\x0FW[PP\x80Q`@`\x01\x80`\xA0\x1B\x03\x82Q\x16\x91\x01Q\x90\x80\x88R`\x02` R`@\x88 T\x82\x11a\x0C\xFCW[PP\x84\x86R`\x06` \x90\x81R`@\x80\x88 \x83Q\x80Q\x82T`\x01`\x01`\xA0\x1B\x03\x19\x90\x81\x16`\x01`\x01`\xA0\x1B\x03\x92\x83\x16\x17\x84U\x94\x82\x01Q`\x01\x84\x01U\x92\x81\x01Q`\x02\x83\x01U``\x81\x01Q`\x03\x83\x01\x80T\x90\x95\x16\x93\x16\x92\x90\x92\x17\x90\x92U`\x80\x81\x01Q`\x04\x83\x01U`\xA0\x01Q\x80Q\x80Q\x90`\x05\x84\x01\x90`\x01`\x01`@\x1B\x03\x83\x11a\x0C\xCBW`\x01`@\x1B\x83\x11a\x0C\xCBW` \x90a\n\x0C\x84\x84T\x81\x86U\x85a&\xB4V[\x01\x90\x8AR` \x8A \x8A[\x83\x81\x10a\x0C\xDFWPPPP`\x06\x82\x01` \x82\x01Q\x90\x81Q\x91`\x01`\x01`@\x1B\x03\x83\x11a\x0C\xCBW`\x01`@\x1B\x83\x11a\x0C\xCBW` \x90a\nY\x84\x84T\x81\x86U\x85a&\xB4V[\x01\x90\x8AR` \x8A \x8A[\x83\x81\x10a\x0C\xB7WPPPP`\x07\x82\x01\x90`@\x81\x01Q\x90`\x03\x82\x10\x15a\x0C\xA3W``\x83T\x91\x01Q`\x04\x81\x10\x15a\x0C\x8FW\x91`\x08\x93\x91`\xFFa\xFF\0` \x97\x95\x87\x1B\x16\x92\x16\x90a\xFF\xFF\x19\x16\x17\x17\x90U\x01\x91\x01Q\x80Q\x90`\x01`\x01`@\x1B\x03\x82\x11a\x0C{W\x81\x90a\n\xD0\x84Ta$IV[`\x1F\x81\x11a\x0C@W[P` \x90`\x1F\x83\x11`\x01\x14a\x0B\xDDW\x89\x92a\x0B\xD2W[PP\x81`\x01\x1B\x91`\0\x19\x90`\x03\x1B\x1C\x19\x16\x17\x90U[\x83\x85R`\x07` R`@\x85 `\x01`\xFF\x19\x82T\x16\x17\x90U`\x01\x80`\xA0\x1B\x03\x81Q\x16\x85R`\x05` Ra\x0B9\x84`@\x87 a&\xE6V[`\xA0`\x01\x80\x82\x1B\x03\x82Q\x16\x92`\x01\x80\x83\x1B\x03\x90Q\x16\x93Q\x91\x01\x94\x85Q\x90\x81Q\x96`@` \x84\x01Q\x93\x01Q\x91`\x03\x83\x10\x15a\x0B\xBEWP\x92a\x0B\xB3\x7F\xC9\xBB\xB5=&\xEA\x14$\x11\xFA\xAD\x9E\xC6\x12\x82\xA8\xC0;\x83H\x9F\xF7\xB4\xA6F\xD2)r<(O+\x93` \x99\x93a\x0B\xA6``\x8B\x98Q\x01a&\xD9V[\x91`@Q\x95\x86\x95\x86a'\x0FV[\x03\x90\xA4`@Q\x90\x81R\xF3[cNH{q`\xE0\x1B\x81R`!`\x04R`$\x90\xFD[\x01Q\x90P8\x80a\n\xEFV[\x84\x8AR\x81\x8A \x92P`\x1F\x19\x84\x16\x8A[\x81\x81\x10a\x0C(WP\x90\x84`\x01\x95\x94\x93\x92\x10a\x0C\x0FW[PPP\x81\x1B\x01\x90Ua\x0B\x04V[\x01Q`\0\x19`\xF8\x84`\x03\x1B\x16\x1C\x19\x16\x90U8\x80\x80a\x0C\x02V[\x92\x93` `\x01\x81\x92\x87\x86\x01Q\x81U\x01\x95\x01\x93\x01a\x0B\xECV[a\x0Ck\x90\x85\x8BR` \x8B `\x1F\x85\x01`\x05\x1C\x81\x01\x91` \x86\x10a\x0CqW[`\x1F\x01`\x05\x1C\x01\x90a&\x9DV[8a\n\xD9V[\x90\x91P\x81\x90a\x0C^V[cNH{q`\xE0\x1B\x88R`A`\x04R`$\x88\xFD[cNH{q`\xE0\x1B\x8BR`!`\x04R`$\x8B\xFD[cNH{q`\xE0\x1B\x8AR`!`\x04R`$\x8A\xFD[`\x01\x90` \x84Q\x94\x01\x93\x81\x84\x01U\x01a\ncV[cNH{q`\xE0\x1B\x8BR`A`\x04R`$\x8B\xFD[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x81\x83\x01U` \x90\x92\x01\x91`\x01\x01a\n\x16V[\x87R`\x02` R`@\x87 U8\x80a\toV[\x81a\r\x19\x91a\x19\xB9V[a\r$W\x858a\tGV[\x85\x80\xFD[`@Q=\x84\x82>=\x90\xFD[\x84\x80\xFD[c\xF2\xCB\xD3Q`\xE0\x1B\x84R`\x04\x83\x90R`$\x84\xFD[cNH{q`\xE0\x1B\x85R`!`\x04R`$\x85\xFD[c]\r5\xD9`\xE1\x1B\x83R`\x04\x83\xFD[cm\x0F|\xF1`\xE0\x1B\x83R`\x04\x83\xFD[c\n\xA0\xFAe`\xE3\x1B\x83R`\x04\x83\xFD[c\x1CZaC`\xE1\x1B\x83R`\x04\x83\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x031a\r\xBB`\x045a$\x83V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a \x9BV[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\r\xE9a\x19\x08V[a\r\xF1a+GV[`\x01\x80`\xA0\x1B\x03\x16k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\xA0\x1B`\nT\x16\x17`\nU\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W` \x90`@\x90`\x01`\x01`\xA0\x1B\x03a\x0E<a\x19\x08V[\x16\x81R`\x02\x83R T`@Q\x90\x81R\xF3[P4a\x024Wa\x0E\\6a\x1B\xFCV[a\x0Ee\x81a'\xB3V[\x90\x80Q\x90a\x0Eqa+GV[\x83[\x82Q\x81\x10\x15a\x0F\x1AWa\x0E\x86\x81\x84a#\xC5V[Qa\x0E\x8Fa+GV[\x80\x86R`\x07` R`\xFF`@\x87 T\x16`\x07\x81\x10\x15a\x0F\x06W`\x01\x03a\x0E\xF4W\x80\x86R`\x07` R`@\x86 \x80T`\xFF\x19\x16`\x02\x17\x90U`\x01\x91\x90\x7F\x87h\x16\xF4\xC1x]O\xE0\xA5\xFB,\x17>\x1A\x11\x89\xF0\x8D\xBFVd\xFF\x14\xA5P\x99=(\xF4ld\x87\x80\xA2\x01a\x0EsV[c\x1EO\x9A\x8F`\xE0\x1B\x86R`\x04R`$\x85\xFD[cNH{q`\xE0\x1B\x87R`!`\x04R`$\x87\xFD[P\x83\x83` \x83\x01Q\x92`@\x81\x01Q\x92`\x80``\x83\x01Q\x92\x01Q`\x01\x80`\xA0\x1B\x03`\x0BT\x16\x80;\x15a\x18^W`@Qc\x02\x05\xDCY`\xE0\x1B\x81R`\xA0`\x04\x82\x01R\x83\x81\x80a\x0F\xBEa\x0F\xACa\x0F\x9Aa\x0F\x88\x8Ea\x0Fv`\xA4\x87\x01\x8Fa\"\x03V[\x86\x81\x03`\x03\x19\x01`$\x88\x01R\x90a\"\x03V[\x84\x81\x03`\x03\x19\x01`D\x86\x01R\x8Da\"\x84V[\x83\x81\x03`\x03\x19\x01`d\x85\x01R\x8Aa\"\xF5V[\x82\x81\x03`\x03\x19\x01`\x84\x84\x01R\x87a#aV[\x03\x81\x85Z\xFA\x80\x15a\x18vWa\x18bW[P\x80;\x15a\x18^W`@Qc\xF0\x8Ft{`\xE0\x1B\x81R`\x80`\x04\x82\x01R\x90\x83\x90\x82\x90\x81\x80a\x10>a\x10,a\x10\x1A\x8Ea\x10\x08`\x84\x86\x01\x8Fa\"\x03V[\x85\x81\x03`\x03\x19\x01`$\x87\x01R\x90a\"\x03V[\x83\x81\x03`\x03\x19\x01`D\x85\x01R\x8Da\"\x84V[\x82\x81\x03`\x03\x19\x01`d\x84\x01R\x88a#aV[\x03\x91Z\xFA\x80\x15a\x18SW\x90\x83\x91a\x18>W[PP\x83Q\x94a\x10^\x86a\x19\xDAV[\x95a\x10l`@Q\x97\x88a\x19\xB9V[\x80\x87Ra\x10{`\x1F\x19\x91a\x19\xDAV[\x016` \x88\x017\x82[\x85Q\x81\x10\x15a\x10\xBCW\x80a\x10\xABa\x10\xA6a\x10\xA0`\x01\x94\x8Aa#\xC5V[Qa.\x9EV[a\"\\V[a\x10\xB5\x82\x8Aa#\xC5V[R\x01a\x10\x84V[P\x91\x94\x95\x90\x92\x95\x82Qa\x16vW[P\x84[\x87Q\x81\x10\x15a\x11\0W\x80a\x10\xE3`\x01\x92\x8Aa#\xC5V[Q\x87R`\x07` R`@\x87 \x80T`\xFF\x19\x16`\x03\x17\x90U\x01a\x10\xCDV[P\x91\x94\x90\x92\x95\x84[\x87Q\x81\x10\x15a\x11KW\x80a\x11!a\x10\xA0`\x01\x93\x8Ba#\xC5V[\x7F1\xB5\xEB\xB8\x81=\xFC\0\x9A\xD4\x17F,b\x9D\xF2\x16H\x1A\x8E]\xA7k\xDAT\xD5b\x93H\x0F\xA2\x91\x88\x80\xA2\x01a\x11\x08V[P\x90\x91\x92\x94\x84`@\x80Qa\x11^\x81a\x197V[\x82\x81R\x81Qa\x11l\x81a\x19hV[\x83\x81R\x83` \x82\x01R` \x82\x01R\x01R\x84[\x83Q\x81\x10\x15a\x15\xE3Wa\x11\x91\x81\x85a#\xC5V[Q` \x81\x01\x90a\x11\xA1\x82Qa+:V[`\x02\x81\x10\x15a\x15\xCFW\x15a\x11\xBAW[PP`\x01\x01a\x11~V[`\x01`\x01`@\x1B\x03` a\x11\xD4\x82a\x11\xE0\x94Q\x16\x8Da#\xC5V[Q\x93Q\x01Q\x16\x87a#\xC5V[Q\x80Q\x82Q\x91\x92\x91`\x01`\x01`\xA0\x1B\x03\x91\x82\x16\x91\x16\x03a\x15\xC0W` \x90`@Qa\x12\n\x83\x82a\x19\xB9V[\x89\x81R`@Qa\x12\x19\x81a\x19hV[\x84\x81R\x83\x81\x01\x91\x82Ra\x124a\x12.\x86a.\x9EV[\x93a.\x9EV[\x83\x8CR`\x08\x85R`@\x8C U`\x01\x80`\xA0\x1B\x03\x85Q\x16\x8BR`\x05\x84Ra\x12]\x83`@\x8D a&\xE6V[\x82\x8BR`\x06\x84R`@\x80\x8C \x91Q\x80Q\x83T`\x01`\x01`\xA0\x1B\x03\x19\x90\x81\x16`\x01`\x01`\xA0\x1B\x03\x92\x83\x16\x17\x85U\x82\x88\x01Q`\x01\x86\x01U\x92\x82\x01Q`\x02\x85\x01U``\x82\x01Q`\x03\x85\x01\x80T\x90\x94\x16\x91\x16\x17\x90\x91U`\x80\x81\x01Q`\x04\x83\x01U`\xA0\x01Q\x80Q\x80Q\x90`\x05\x84\x01\x90`\x01`\x01`@\x1B\x03\x83\x11a\x15\x91W`\x01`@\x1B\x83\x11a\x15\x91W\x90\x87\x8F\x92a\x12\xF3\x85\x84T\x81\x86U\x85a&\xB4V[\x01\x91R\x8D\x87\x81 \x90[\x83\x81\x10a\x15\xA5WPPPP`\x06\x82\x01\x85\x82\x01Q\x90\x81Q\x91`\x01`\x01`@\x1B\x03\x83\x11a\x15\x91W`\x01`@\x1B\x83\x11a\x15\x91W\x90\x87\x8F\x92a\x13?\x85\x84T\x81\x86U\x85a&\xB4V[\x01\x91R\x8D\x87\x81 \x90[\x83\x81\x10a\x15\x7FWPPPP`\x07\x82\x01\x90`@\x81\x01Q\x90`\x03\x82\x10\x15a\x14\x93W``\x83T\x91\x01Q`\x04\x81\x10\x15a\x15kW\x90`\xFF\x8F`\x08\x96\x95\x94\x93a\xFF\0\x91P\x87\x1B\x16\x92\x16\x90a\xFF\xFF\x19\x16\x17\x17\x90U\x01\x90Q\x80Q\x90`\x01`\x01`@\x1B\x03\x82\x11a\x15WW\x81\x90\x8Ca\x13\xB6\x85Ta$IV[\x87`\x1F\x82\x11a\x15)W[PPP\x85\x90\x8D`\x1F\x84\x11`\x01\x14a\x14\xC6W\x92a\x14\xBBW[PP\x81`\x01\x1B\x91`\0\x19\x90`\x03\x1B\x1C\x19\x16\x17\x90U[\x80\x89R`\x07\x82R`@\x89 `\x01`\xFF\x19\x82T\x16\x17\x90U`\x01T`\0\x19\x81\x14a\x14\xA7W`\x01\x01`\x01U`\x01\x80`\xA0\x1B\x03\x83Q\x16\x91`\x01\x80`\xA0\x1B\x03``\x85\x01Q\x16\x93`\xA0`\x80\x82\x01Q\x91\x01\x80Q\x90`@\x82Q\x94\x83\x01Q\x92\x01Q\x90`\x03\x82\x10\x15a\x14\x93W`\x01\x98\x97\x96\x95\x94\x92\x7F\xC9\xBB\xB5=&\xEA\x14$\x11\xFA\xAD\x9E\xC6\x12\x82\xA8\xC0;\x83H\x9F\xF7\xB4\xA6F\xD2)r<(O+\x94\x92a\x0B\xA6``a\x14\x89\x94Q\x01a&\xD9V[\x03\x90\xA4\x90\x89a\x11\xB0V[cNH{q`\xE0\x1B\x8ER`!`\x04R`$\x8E\xFD[cNH{q`\xE0\x1B\x8AR`\x11`\x04R`$\x8A\xFD[\x01Q\x90P\x8E\x80a\x13\xD7V[\x85\x81R\x87\x81 \x93P`\x1F\x19\x85\x16\x90[\x88\x82\x82\x10a\x15\x13WPP\x90\x84`\x01\x95\x94\x93\x92\x10a\x14\xFAW[PPP\x81\x1B\x01\x90Ua\x13\xECV[\x01Q`\0\x19`\xF8\x84`\x03\x1B\x16\x1C\x19\x16\x90U\x8E\x80\x80a\x14\xEDV[`\x01\x85\x96\x82\x93\x96\x86\x01Q\x81U\x01\x95\x01\x93\x01a\x14\xD5V[\x82\x87a\x15O\x94R `\x1F\x85\x01`\x05\x1C\x81\x01\x91\x89\x86\x10a\x0CqW`\x1F\x01`\x05\x1C\x01\x90a&\x9DV[\x8C8\x87a\x13\xC0V[cNH{q`\xE0\x1B\x8CR`A`\x04R`$\x8C\xFD[cNH{q`\xE0\x1B\x8FR`!`\x04R`$\x8F\xFD[\x82Q\x82\x82\x01U\x91\x88\x01\x91`\x01\x01a\x13HV[cNH{q`\xE0\x1B\x8FR`A`\x04R`$\x8F\xFD[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x82\x82\x01U\x91\x88\x01\x91`\x01\x01a\x12\xFCV[cEK\x12\xD9`\xE0\x1B\x88R`\x04\x88\xFD[cNH{q`\xE0\x1B\x89R`!`\x04R`$\x89\xFD[Pa\x16\x15\x91a\x16]a\x16k\x92a\x16K`\xA0\x96a\x169\x8Ba\x16'` \x9B`@Q\x9A\x8B\x99\x8E\x8B\x01\x9D\x8ER`\xC0\x8B\x01\x90a!\xCFV[\x89\x81\x03`\x1F\x19\x01`@\x8B\x01R\x90a\"\x03V[\x87\x81\x03`\x1F\x19\x01``\x89\x01R\x90a\"\x84V[\x85\x81\x03`\x1F\x19\x01`\x80\x87\x01R\x90a\"\xF5V[\x83\x81\x03`\x1F\x19\x01`\xA0\x85\x01R\x90a#aV[\x03`\x1F\x19\x81\x01\x83R\x82a\x19\xB9V[Q\x90 `@Q\x90\x81R\xF3[\x93\x91\x90\x95`\x01\x80`\xA0\x99\x97\x99\x1B\x03`\nT\x16\x95`\x01\x80`\xA0\x1B\x03`\tT\x16\x94\x89[\x83Q\x81\x10\x15a\x18-Wa\x16\xAA\x81\x85a#\xC5V[Q` \x81\x01\x90a\x16\xBA\x82Qa+:V[`\x02\x81\x10\x15a\x14\x93W\x8B\x8E\x93\x89\x8B\x94`\x01\x8F\x95\x14a\x16\xE2W[PPPPPPP`\x01\x01a\x16\x97V[a\x17\x10` \x93a\x17\t\x85\x94`\x01`\x01`@\x1B\x03\x80a\x17!\x96Q\x16\x97\x88\x94Q\x01Q\x16\x90a#\xC5V[Q\x97a#\xC5V[Q\x92a\x17\x1B\x84a.\x9EV[\x95a#\xC5V[Q\x94`\x84`\x01\x80`\xA0\x1B\x03`@\x83\x01Q\x16\x88\x84`\x01\x80`\xA0\x1B\x03\x85Q\x16\x94\x01\x96\x87Q\x98`@Q\x99\x8A\x96\x87\x95c\x0C\xE0\x07\xE3`\xE2\x1B\x87R`\x04\x87\x01R`$\x86\x01R`D\x85\x01R`d\x84\x01RZ\xF1\x92\x83\x15a\x18\"W\x85\x93a\x17\xEFW[P``\x01Q\x90Q\x91`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x90\x8B;\x15a\r3W`@Q\x93c\xCA\r\x857`\xE0\x1B\x85R`\x04\x85\x01R`$\x84\x01R`D\x83\x01R`d\x82\x01R\x81\x81`\x84\x81\x83\x8DZ\xF1\x80\x15a\r(Wa\x17\xD6W[\x89\x8B\x82\x89\x8B\x94a\x16\xD3V[\x81a\x17\xE0\x91a\x19\xB9V[a\x17\xEBW\x8A\x8Ca\x17\xCBV[\x8A\x80\xFD[\x90\x92P` \x81=\x82\x11a\x18\x1AW[\x81a\x18\n` \x93\x83a\x19\xB9V[\x81\x01\x03\x12a\r3WQ\x918a\x17zV[=\x91Pa\x17\xFDV[`@Q=\x87\x82>=\x90\xFD[P\x94P\x97\x95P\x95\x90\x91\x93P\x87a\x10\xCAV[\x81a\x18H\x91a\x19\xB9V[a\x022W\x81\x88a\x10PV[`@Q=\x85\x82>=\x90\xFD[\x82\x80\xFD[\x83a\x18o\x91\x94\x92\x94a\x19\xB9V[\x91\x88a\x0F\xCEV[`@Q=\x86\x82>=\x90\xFD[P4a\x024W\x80`\x03\x196\x01\x12a\x024W`\nT`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W` \x90`\xFF\x90`@\x90`\x01`\x01`\xA0\x1B\x03a\x18\xD5a\x19\x08V[\x16\x81R`\x03\x84R T\x16`@Q\x90\x15\x15\x81R\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W` a\x06\xA7`\x045a\"\\V[`\x045\x90`\x01`\x01`\xA0\x1B\x03\x82\x16\x82\x03a\x19\x1EWV[`\0\x80\xFD[5\x90`\x01`\x01`\xA0\x1B\x03\x82\x16\x82\x03a\x19\x1EWV[``\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[`\xC0\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[`\x80\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[\x90`\x1F\x80\x19\x91\x01\x16\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[`\x01`\x01`@\x1B\x03\x81\x11a\x19RW`\x05\x1B` \x01\x90V[\x90\x80`\x1F\x83\x01\x12\x15a\x19\x1EW\x815a\x1A\x08\x81a\x19\xDAV[\x92a\x1A\x16`@Q\x94\x85a\x19\xB9V[\x81\x84R` \x80\x85\x01\x92`\x05\x1B\x82\x01\x01\x92\x83\x11a\x19\x1EW` \x01\x90[\x82\x82\x10a\x1A>WPPP\x90V[\x815\x81R` \x91\x82\x01\x91\x01a\x1A1V[\x91\x90`\xC0\x83\x82\x03\x12a\x19\x1EW`@Qa\x1Af\x81a\x19\x83V[\x80\x93a\x1Aq\x81a\x19#V[\x82R` \x81\x015` \x83\x01R`@\x81\x015`@\x83\x01Ra\x1A\x93``\x82\x01a\x19#V[``\x83\x01R`\x80\x81\x015`\x80\x83\x01R`\xA0\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW\x01`\x80\x81\x84\x03\x12a\x19\x1EW`@Q\x92a\x1A\xCE\x84a\x19\x9EV[\x815`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82\x01\x81`\x1F\x82\x01\x12\x15a\x19\x1EW\x805\x90a\x1A\xF7\x82a\x19\xDAV[\x91a\x1B\x05`@Q\x93\x84a\x19\xB9V[\x80\x83R` \x80\x84\x01\x91`\x05\x1B\x83\x01\x01\x91\x84\x83\x11a\x19\x1EW` \x01\x90[\x82\x82\x10a\x1B\xD0WPPP\x84R` \x82\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82\x01\x90\x80`\x1F\x83\x01\x12\x15a\x19\x1EW\x815a\x1BY\x81a\x19\xDAV[\x92a\x1Bg`@Q\x94\x85a\x19\xB9V[\x81\x84R` \x80\x85\x01\x92`\x05\x1B\x82\x01\x01\x92\x83\x11a\x19\x1EW` \x01\x90[\x82\x82\x10a\x1B\xC0WPPP` \x84\x01R`@\x81\x015\x90`\x03\x82\x10\x15a\x19\x1EW``\x91`@\x85\x01R\x015\x90`\x04\x82\x10\x15a\x19\x1EW`\xA0\x91``\x84\x01R\x01RV[\x815\x81R` \x91\x82\x01\x91\x01a\x1B\x82V[` \x80\x91a\x1B\xDD\x84a\x19#V[\x81R\x01\x91\x01\x90a\x1B!V[5\x90`\x01`\x01`@\x1B\x03\x82\x16\x82\x03a\x19\x1EWV[` `\x03\x19\x82\x01\x12a\x19\x1EW`\x045\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW`\xA0\x82\x82\x03`\x03\x19\x01\x12a\x19\x1EW`@Q\x91`\xA0\x83\x01\x83\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@R\x80`\x04\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82`\x04a\x1Cg\x92\x84\x01\x01a\x19\xF1V[\x83R`$\x81\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x81\x01\x82`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015a\x1C\x97\x81a\x19\xDAV[\x91a\x1C\xA5`@Q\x93\x84a\x19\xB9V[\x81\x83R` `\x04\x81\x85\x01\x93`\x05\x1B\x83\x01\x01\x01\x91\x85\x83\x11a\x19\x1EW`$\x82\x01\x90[\x83\x82\x10a\x1F>WPPPP` \x84\x01R`D\x81\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x81\x01\x82`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015a\x1D\x03\x81a\x19\xDAV[\x91a\x1D\x11`@Q\x93\x84a\x19\xB9V[\x81\x83R` `\x04\x81\x85\x01\x93`\x07\x1B\x83\x01\x01\x01\x90\x85\x82\x11a\x19\x1EW`$\x01\x91[\x81\x83\x10a\x1E\xEAWPPP`@\x84\x01R`d\x81\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x81\x01\x82`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015a\x1Dm\x81a\x19\xDAV[\x91a\x1D{`@Q\x93\x84a\x19\xB9V[\x81\x83R` `\x04\x81\x85\x01\x93`\x07\x1B\x83\x01\x01\x01\x90\x85\x82\x11a\x19\x1EW`$\x01\x91[\x81\x83\x10a\x1EpWPPP``\x84\x01R`\x84\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW\x01\x81`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015\x90a\x1D\xD8\x82a\x19\xDAV[\x92a\x1D\xE6`@Q\x94\x85a\x19\xB9V[\x82\x84R` `\x04``\x82\x87\x01\x95\x02\x84\x01\x01\x01\x91\x81\x83\x11a\x19\x1EW`$\x01\x92[\x82\x84\x10a\x1E\x18WPPPP`\x80\x82\x01R\x90V[``\x84\x83\x03\x12a\x19\x1EW`@Q\x90a\x1E/\x82a\x197V[a\x1E8\x85a\x1B\xE8V[\x82Ra\x1EF` \x86\x01a\x1B\xE8V[` \x83\x01R`@\x85\x015\x90`\x02\x82\x10\x15a\x19\x1EW\x82` \x92`@``\x95\x01R\x81R\x01\x93\x01\x92a\x1E\x05V[\x82\x86\x03`\x80\x81\x12a\x19\x1EW`@\x80Q\x91a\x1E\x89\x83a\x197V[a\x1E\x92\x86a\x1B\xE8V[\x83R`\x1F\x19\x01\x12a\x19\x1EW`@Q\x91a\x1E\xAA\x83a\x19hV[` \x85\x015\x91`\x02\x83\x10\x15a\x19\x1EW\x83` \x93`\x80\x95Ra\x1E\xCD`@\x88\x01a\x1B\xE8V[\x84\x82\x01R\x83\x82\x01R``\x86\x015`@\x82\x01R\x81R\x01\x92\x01\x91a\x1D\x9AV[`\x80\x83\x87\x03\x12a\x19\x1EW` `\x80\x91`@Qa\x1F\x05\x81a\x19\x9EV[a\x1F\x0E\x86a\x19#V[\x81R\x82\x86\x015\x83\x82\x01Ra\x1F$`@\x87\x01a\x19#V[`@\x82\x01R``\x86\x015``\x82\x01R\x81R\x01\x92\x01\x91a\x1D0V[\x815`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW` \x91a\x1Fc\x89\x84`\x04\x81\x95\x89\x01\x01\x01a\x1ANV[\x81R\x01\x91\x01\x90a\x1C\xC5V[\x90`\x03\x82\x10\x15a\x1F{WRV[cNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[\x90`\x04\x82\x10\x15a\x1F{WRV[`\xA0\x90`\x01\x80\x83\x1B\x03\x81Q\x16\x83R` \x81\x01Q` \x84\x01R`@\x81\x01Q`@\x84\x01R`\x01\x80\x83\x1B\x03``\x82\x01Q\x16``\x84\x01R`\x80\x81\x01Q`\x80\x84\x01R\x01Q\x90`\xC0`\xA0\x82\x01Ra\x01@\x81\x01\x91\x80Q\x92`\x80`\xC0\x84\x01R\x83Q\x80\x91R` a\x01`\x84\x01\x94\x01\x90`\0[\x81\x81\x10a |WPPP` \x81\x81\x01Q\x83\x85\x03`\xBF\x19\x01`\xE0\x85\x01R\x80Q\x80\x86R\x94\x82\x01\x94\x91\x01\x90`\0[\x81\x81\x10a fWPPP\x90a\x01 ``\x83a Y`@a c\x96\x01Qa\x01\0\x86\x01\x90a\x1FnV[\x01Q\x91\x01\x90a\x1F\x91V[\x90V[\x82Q\x86R` \x95\x86\x01\x95\x90\x92\x01\x91`\x01\x01a 2V[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x86R` \x95\x86\x01\x95\x90\x92\x01\x91`\x01\x01a \x07V[\x91\x90\x91` a \xB3\x82Q`@\x86R`@\x86\x01\x90a\x1F\x9EV[\x91\x01Q\x92` \x81\x83\x03\x91\x01R\x82Q\x92\x83\x82R`\0[\x84\x81\x10a \xE9WPP\x82`\0` \x80\x94\x95\x84\x01\x01R`\x1F\x80\x19\x91\x01\x16\x01\x01\x90V[\x80` \x80\x92\x84\x01\x01Q\x82\x82\x86\x01\x01R\x01a \xC8V[` `\x03\x19\x82\x01\x12a\x19\x1EW`\x045\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW`@\x82\x82\x03`\x03\x19\x01\x12a\x19\x1EW`@Q\x91a!7\x83a\x19hV[\x80`\x04\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82`\x04a!Y\x92\x84\x01\x01a\x1ANV[\x83R`$\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW\x01\x81`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19RW`@Q\x92a!\xA7`\x1F\x84\x01`\x1F\x19\x16` \x01\x85a\x19\xB9V[\x82\x84R`$\x82\x84\x01\x01\x11a\x19\x1EW\x81`\0\x92`$` \x93\x01\x83\x86\x017\x83\x01\x01R` \x82\x01R\x90V[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a!\xEDWPPP\x90V[\x82Q\x84R` \x93\x84\x01\x93\x90\x92\x01\x91`\x01\x01a!\xE0V[\x90\x80` \x83Q\x91\x82\x81R\x01\x91` \x80\x83`\x05\x1B\x83\x01\x01\x94\x01\x92`\0\x91[\x83\x83\x10a\"/WPPPPP\x90V[\x90\x91\x92\x93\x94` \x80a\"M`\x01\x93`\x1F\x19\x86\x82\x03\x01\x87R\x89Qa\x1F\x9EV[\x97\x01\x93\x01\x93\x01\x91\x93\x92\x90a\" V[[\x80`\0R`\x08` R`@`\0 T\x15a cW`\0R`\x08` R`@`\0 Ta\"]V[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a\"\xA2WPPP\x90V[\x90\x91\x92` `\x80`\x01\x92``\x87Q\x85\x80`\xA0\x1B\x03\x81Q\x16\x83R\x84\x81\x01Q\x85\x84\x01R\x85\x80`\xA0\x1B\x03`@\x82\x01Q\x16`@\x84\x01R\x01Q``\x82\x01R\x01\x94\x01\x91\x01\x91\x90\x91a\"\x95V[\x90`\x02\x82\x10\x15a\x1F{WRV[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a#\x13WPPP\x90V[\x90\x91\x92` `\x80`\x01\x92`@\x87Q`\x01`\x01`@\x1B\x03\x81Q\x16\x83R`\x01`\x01`@\x1B\x03\x85\x80\x83\x01Qa#H\x82\x87\x01\x82Qa\"\xE8V[\x01Q\x16\x83\x83\x01R\x01Q``\x82\x01R\x01\x94\x01\x92\x91\x01a#\x06V[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a#\x7FWPPP\x90V[\x90\x91\x92` ```\x01\x92a#\xBA`@\x88Q`\x01`\x01`@\x1B\x03\x81Q\x16\x84R`\x01`\x01`@\x1B\x03\x86\x82\x01Q\x16\x86\x85\x01R\x01Q`@\x83\x01\x90a\"\xE8V[\x01\x94\x01\x92\x91\x01a#rV[\x80Q\x82\x10\x15a#\xD9W` \x91`\x05\x1B\x01\x01\x90V[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`@Q\x90a#\xFC\x82a\x19\x83V[\x81`\0\x81R`\0` \x82\x01R`\0`@\x82\x01R`\0``\x82\x01R`\0`\x80\x82\x01R`\xA0`@Q\x91a$,\x83a\x19\x9EV[``\x83R``` \x84\x01R`\0`@\x84\x01R`\0``\x84\x01R\x01RV[\x90`\x01\x82\x81\x1C\x92\x16\x80\x15a$yW[` \x83\x10\x14a$cWV[cNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[\x91`\x7F\x16\x91a$XV[``` `@Qa$\x93\x81a\x19hV[a$\x9Ba#\xEFV[\x81R\x01R`\0R`\x06` R`@`\0 `@Q\x90a$\xB9\x82a\x19hV[`@Q\x90a$\xC6\x82a\x19\x83V[\x80T`\x01`\x01`\xA0\x1B\x03\x90\x81\x16\x83R`\x01\x82\x01T` \x84\x01R`\x02\x82\x01T`@\x80\x85\x01\x91\x90\x91R`\x03\x83\x01T\x90\x91\x16``\x84\x01R`\x04\x82\x01T`\x80\x84\x01RQ\x91`\x05\x82\x01a%\x13\x84a\x19\x9EV[`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a&{WPPa%D\x92P\x03\x82a\x19\xB9V[\x83R`\x06\x82\x01`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a&bWPPa%{\x92P\x03\x82a\x19\xB9V[` \x84\x01R`\x07\x82\x01T`\xFF\x81\x16\x90`\x03\x82\x10\x15a\x1F{W`\xFF\x91`@\x86\x01R`\x08\x1C\x16\x92`\x04\x84\x10\x15a\x1F{W`\x08\x93``\x82\x01R`\xA0\x82\x01R\x83R\x01`@Q\x90\x81`\0\x82T\x92a%\xCC\x84a$IV[\x80\x84R\x93`\x01\x81\x16\x90\x81\x15a&@WP`\x01\x14a%\xF9W[Pa%\xF1\x92P\x03\x82a\x19\xB9V[` \x82\x01R\x90V[\x90P`\0\x92\x91\x92R` `\0 \x90`\0\x91[\x81\x83\x10a&$WPP\x90` a%\xF1\x92\x82\x01\x018a%\xE4V[` \x91\x93P\x80`\x01\x91T\x83\x85\x88\x01\x01R\x01\x91\x01\x90\x91\x83\x92a&\x0BV[\x90P` \x92Pa%\xF1\x94\x91P`\xFF\x19\x16\x82\x84\x01R\x15\x15`\x05\x1B\x82\x01\x018a%\xE4V[\x84T\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a%fV[\x84T`\x01`\x01`\xA0\x1B\x03\x16\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a%/V[\x81\x81\x10a&\xA8WPPV[`\0\x81U`\x01\x01a&\x9DV[\x91\x81\x81\x10a&\xC1WPPPV[a&\xD7\x92`\0R` `\0 \x91\x82\x01\x91\x01a&\x9DV[V[Q`\x04\x81\x10\x15a\x1F{W\x90V[\x80T\x90`\x01`@\x1B\x82\x10\x15a\x19RW`\x01\x82\x01\x80\x82U\x82\x10\x15a#\xD9W`\0R` `\0 \x01UV[\x92\x91\x90\x95\x94\x93\x95`\xA0\x84\x01\x90\x84R`\xA0` \x85\x01R\x81Q\x80\x91R` `\xC0\x85\x01\x92\x01\x90`\0[\x81\x81\x10a'\x94WPPP\x82\x81\x03`@\x84\x01R` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a'~WPPPa&\xD7\x92\x91a'w`\x80\x92\x96``\x83\x01\x90a\x1FnV[\x01\x90a\x1F\x91V[\x82Q\x84R` \x93\x84\x01\x93\x90\x92\x01\x91`\x01\x01a'WV[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x84R` \x93\x84\x01\x93\x90\x92\x01\x91`\x01\x01a'5V[\x80QQ\x91a'\xC0\x83a\x19\xDAV[\x92a'\xCE`@Q\x94\x85a\x19\xB9V[\x80\x84Ra'\xDD`\x1F\x19\x91a\x19\xDAV[\x01`\0[\x81\x81\x10a(\x9AWPP`\0[\x82Q\x80Q\x82\x10\x15a(\x93W\x81a(\x02\x91a#\xC5V[Q\x90a(\r\x82a$\x83V[\x91a(\x17\x83a(\xB1V[\x15a(\x7FW\x82QQ`\x01`\x01`\xA0\x1B\x03\x16\x15a(kWPC` \x83Q\x01Q\x10a(ZW`\x01\x91Qa(H\x82\x87a#\xC5V[Ra(S\x81\x86a#\xC5V[P\x01a'\xEDV[cm\x0F|\xF1`\xE0\x1B`\0R`\x04`\0\xFD[c\x06\x94\xB4\xCD`\xE0\x1B`\0R`\x04R`$`\0\xFD[c#\xC0\nW`\xE0\x1B`\0R`\x04R`$`\0\xFD[P\x90\x91PPV[` \x90a(\xA5a#\xEFV[\x82\x82\x88\x01\x01R\x01a'\xE1V[a(\xBB\x81Qa.\x9EV[\x80`\0R`\x07` R`\xFF`@`\0 T\x16`\x07\x81\x10\x15a\x1F{W`\x01\x03a)\x1EW`\0R`\x08` R`@`\0 T\x15a(\xF7W[P`\x01\x90V[a)\x02\x900\x90a+\x9FV[\x15a)\rW8a(\xF1V[c]\r5\xD9`\xE1\x1B`\0R`\x04`\0\xFD[c\x0EmP\xAF`\xE0\x1B`\0R`\x04R`$`\0\xFD[a):a#\xEFV[P`\0R`\x06` R`@`\0 `@Q\x90a)U\x82a\x19hV[`@Q\x90a)b\x82a\x19\x83V[\x80T`\x01`\x01`\xA0\x1B\x03\x90\x81\x16\x83R`\x01\x82\x01T` \x84\x01R`\x02\x82\x01T`@\x80\x85\x01\x91\x90\x91R`\x03\x83\x01T\x90\x91\x16``\x84\x01R`\x04\x82\x01T`\x80\x84\x01RQ\x91`\x05\x82\x01a)\xAF\x84a\x19\x9EV[`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a+\x18WPPa)\xE0\x92P\x03\x82a\x19\xB9V[\x83R`\x06\x82\x01`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a*\xFFWPPa*\x17\x92P\x03\x82a\x19\xB9V[` \x84\x01R`\x07\x82\x01T`\xFF\x81\x16\x90`\x03\x82\x10\x15a\x1F{W`\xFF\x91`@\x86\x01R`\x08\x1C\x16\x92`\x04\x84\x10\x15a\x1F{W`\x08\x93``\x82\x01R`\xA0\x82\x01R\x83R\x01`@Q\x90\x81`\0\x82T\x92a*h\x84a$IV[\x80\x84R\x93`\x01\x81\x16\x90\x81\x15a*\xDDWP`\x01\x14a*\x96W[Pa*\x8D\x92P\x03\x82a\x19\xB9V[` \x82\x01RQ\x90V[\x90P`\0\x92\x91\x92R` `\0 \x90`\0\x91[\x81\x83\x10a*\xC1WPP\x90` a*\x8D\x92\x82\x01\x018a*\x80V[` \x91\x93P\x80`\x01\x91T\x83\x85\x88\x01\x01R\x01\x91\x01\x90\x91\x83\x92a*\xA8V[\x90P` \x92Pa*\x8D\x94\x91P`\xFF\x19\x16\x82\x84\x01R\x15\x15`\x05\x1B\x82\x01\x018a*\x80V[\x84T\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a*\x02V[\x84T`\x01`\x01`\xA0\x1B\x03\x16\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a)\xCBV[Q`\x02\x81\x10\x15a\x1F{W\x90V[`\0T`\x01`\x01`\xA0\x1B\x03\x163\x03a+[WV[`d`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R` `$\x82\x01R\x7FOwnable: caller is not the owner`D\x82\x01R\xFD[` \x81Q\x91\x01\x91`A\x83QQ\x03a.YW`@\x90`\r` \x83Qa+\xC3\x85\x82a\x19\xB9V[\x82\x81R\x01l\x12\xDA\x18[\x18[\x9AR[\x9D\x19[\x9D`\x9A\x1B\x81R \x90`\x05` \x84Qa+\xEC\x86\x82a\x19\xB9V[\x82\x81R\x01d\x03\x12\xE3\x02\xE3`\xDC\x1B\x81R \x90\x83Q\x91` \x83\x01\x93\x7F\x91\xAB=\x17\xE3\xA5\n\x9D\x89\xE6?\xD3\x0B\x92\xBE\x7FS6\xB0;({\xB9Fxz\x83\xA9\xD6*'f\x85R\x85\x84\x01R``\x83\x01R`\x01\x80`\xA0\x1B\x03\x16`\x80\x82\x01R`\x80\x81Ra,M`\xA0\x82a\x19\xB9V[Q\x90 \x92`\x01\x80`\xA0\x1B\x03\x83Q\x16\x93` \x84\x01Q\x92\x80\x85\x01Q\x95`\x01\x80`\xA0\x1B\x03``\x87\x01Q\x16\x94`\x80\x87\x01Q\x97`\xA0\x88\x01Q\x98\x89Q\x85Q` \x81\x01\x81\x81\x93` \x81Q\x93\x91\x01\x92`\0[\x81\x81\x10a.7WPPa,\xB3\x92P\x03`\x1F\x19\x81\x01\x83R\x82a\x19\xB9V[Q\x90 \x97` \x8B\x01Q\x86Q` \x81\x01\x81\x81\x93` \x81Q\x93\x91\x01\x92`\0[\x81\x81\x10a.\x1EWPPa,\xEC\x92P\x03`\x1F\x19\x81\x01\x83R\x82a\x19\xB9V[Q\x90 \x98\x86\x8C\x01Q\x9B`\x03\x8D\x10\x15a\x1F{W``\x01Q\x99`\x04\x8B\x10\x15a\x1F{Wa-ba.\x04\x9Ba-Xa.\x0C\x9F\x8BQ\x94` \x86\x01\x96\x7F3\xF3\xE2w}1=\x0E\x16\x0F\xB4H\x07\xB5\x9Bx3\xDC,Cx\x81e@\x8E\xA9o\xBF&\x03(\xF8\x88R\x8D\x87\x01R``\x86\x01R`\x80\x85\x01\x90a\x1FnV[`\xA0\x83\x01\x90a\x1F\x91V[`\xA0\x81Ra-q`\xC0\x82a\x19\xB9V[Q\x90 \x92\x86Q\x94` \x86\x01\x96\x7Fn\xFB9\x0B4\x05\xF0\xE2\x17\x1E0\xD4w\xD2\xAD\xEAEG\x8A\xE7S\xC0\xDBG\x1E\xDF\xB88\xF7\xC6\xDFV\x88R\x88\x87\x01R``\x86\x01R`\x80\x85\x01R`\xA0\x84\x01R`\xC0\x83\x01R`\xE0\x82\x01R`\xE0\x81Ra-\xCDa\x01\0\x82a\x19\xB9V[Q\x90 \x90Q\x90` \x82\x01\x92a\x19\x01`\xF0\x1B\x84R`\"\x83\x01R`B\x82\x01R`B\x81Ra-\xF9`b\x82a\x19\xB9V[Q\x90 \x90Q\x90a.\xC1V[\x92\x90\x92a.\xF9V[Q`\x01`\x01`\xA0\x1B\x03\x91\x82\x16\x91\x16\x14\x90V[\x84Q\x83R` \x94\x85\x01\x94\x86\x94P\x90\x92\x01\x91`\x01\x01a,\xD0V[\x84Q`\x01`\x01`\xA0\x1B\x03\x16\x83R` \x94\x85\x01\x94\x86\x94P\x90\x92\x01\x91`\x01\x01a,\x97V[`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FInvalid signature length\0\0\0\0\0\0\0\0`D\x82\x01R`d\x90\xFD[`@Qa.\xBB\x81a\x16]` \x82\x01\x94` \x86R`@\x83\x01\x90a\x1F\x9EV[Q\x90 \x90V[\x90`A\x81Q\x14`\0\x14a.\xEFWa.\xEB\x91` \x82\x01Q\x90```@\x84\x01Q\x93\x01Q`\0\x1A\x90a/\xFDV[\x90\x91V[PP`\0\x90`\x02\x90V[`\x05\x81\x10\x15a\x1F{W\x80a/\nWPV[`\x01\x81\x03a/WW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FECDSA: invalid signature\0\0\0\0\0\0\0\0`D\x82\x01R`d\x90\xFD[`\x02\x81\x03a/\xA4W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1F`$\x82\x01R\x7FECDSA: invalid signature length\0`D\x82\x01R`d\x90\xFD[`\x03\x14a/\xADWV[`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\"`$\x82\x01R\x7FECDSA: invalid signature 's' val`D\x82\x01Raue`\xF0\x1B`d\x82\x01R`\x84\x90\xFD[\x7F\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF]WnsW\xA4P\x1D\xDF\xE9/Fh\x1B \xA0\x84\x11a0}W` \x93`\0\x93`\xFF`\x80\x94`@Q\x94\x85R\x16\x86\x84\x01R`@\x83\x01R``\x82\x01R\x82\x80R`\x01Z\xFA\x15a0qW`\0Q`\x01`\x01`\xA0\x1B\x03\x81\x16\x15a0hW\x90`\0\x90V[P`\0\x90`\x01\x90V[`@Q=`\0\x82>=\x90\xFD[PPPP`\0\x90`\x03\x90V\xFE\xA2dipfsX\"\x12 \x02\xC1\xD8Po\xDF\x14\x04\x01\xE9G\xF2\xB5\x0B\x9DM/%h9\x142\xAAF\x85\xE1\xD5\x0Czv\xC2\xADdsolcC\0\x08\x1C\x003";
    /// The bytecode of the contract.
    pub static INTENTBOOK_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R`\x046\x10\x15a\0\x12W`\0\x80\xFD[`\0\x805`\xE0\x1C\x80b\xDC\xE5\x13\x14a\x18\xE9W\x80c\x02\xCC%\r\x14a\x18\xAAW\x80c\x14\xE02\x08\x14a\x18\x81W\x80c*\xD7Z\xB1\x14a\x0EMW\x80c-\x035\xAB\x14a\x0E\x14W\x80c/\xF7\x1Ai\x14a\r\xCFW\x80c<\x9D\x93\x98\x14a\r\x9BW\x80c<\xE3\x0E\xBA\x14a\x08=W\x80cm\xC62\xF0\x14a\x07\xB7W\x80cqP\x18\xA6\x14a\x07]W\x80cv?2=\x14a\x06\xF4W\x80c|\xB2\xB7\x9C\x14a\x06\xAFW\x80c\x89\x82\xC7J\x14a\x06lW\x80c\x8D\xA5\xCB[\x14a\x06EW\x80c\x8F\xD5{\x92\x14a\x06\x04W\x80c\xAB\x97\xD5\x9D\x14a\x05\xDBW\x80c\xAEa\xC5\xAE\x14a\x05uW\x80c\xB4%{\x9A\x14a\x05<W\x80c\xCC\x90!\t\x14a\x05\x0EW\x80c\xCD\xCE\xF5\x87\x14a\x04\xEBW\x80c\xD0\x87\xD2\x88\x14a\x04\xC4W\x80c\xD5_\x96\r\x14a\x04\x1AW\x80c\xDC\x94\x80\x9A\x14a\x03yW\x80c\xECX\xF4\xB8\x14a\x035W\x80c\xF1<F\xAA\x14a\x02\xFDW\x80c\xF2\xFD\xE3\x8B\x14a\x027Wc\xF5hU\x9E\x14a\x01EW`\0\x80\xFD[4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045`\x01`\x01`@\x1B\x03\x81\x11a\x022Wa\x01u\x906\x90`\x04\x01a\x19\xF1V[\x90a\x01~a+GV[\x80\x91[\x80Q\x83\x10\x15a\x02.Wa\x01\x94\x83\x82a#\xC5V[Q\x92a\x01\x9Ea+GV[\x83\x83R`\x07` R`\xFF`@\x84 T\x16`\x07\x81\x10\x15a\x02\x1AW`\x01\x03a\x02\x06W\x83\x83\x94`\x01\x93\x94R`\x07` R`@\x85 `\x02`\xFF\x19\x82T\x16\x17\x90U\x7F\x87h\x16\xF4\xC1x]O\xE0\xA5\xFB,\x17>\x1A\x11\x89\xF0\x8D\xBFVd\xFF\x14\xA5P\x99=(\xF4ld\x85\x80\xA2\x01\x91\x90a\x01\x81V[c\x1EO\x9A\x8F`\xE0\x1B\x83R`\x04\x84\x90R`$\x83\xFD[cNH{q`\xE0\x1B\x84R`!`\x04R`$\x84\xFD[P\x80\xF3[P[\x80\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x02Qa\x19\x08V[a\x02Ya+GV[`\x01`\x01`\xA0\x1B\x03\x16\x80\x15a\x02\xA9W\x81T`\x01`\x01`\xA0\x1B\x03\x19\x81\x16\x82\x17\x83U`\x01`\x01`\xA0\x1B\x03\x16\x7F\x8B\xE0\x07\x9CS\x16Y\x14\x13D\xCD\x1F\xD0\xA4\xF2\x84\x19I\x7F\x97\"\xA3\xDA\xAF\xE3\xB4\x18okdW\xE0\x83\x80\xA3\x80\xF3[`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FOwnable: new owner is the zero a`D\x82\x01Reddress`\xD0\x1B`d\x82\x01R`\x84\x90\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x031a\x03\x1D`\x045a)2V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a\x1F\x9EV[\x03\x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x03Oa\x19\x08V[a\x03Wa+GV[`\x01`\x01`\xA0\x1B\x03\x16\x81R`\x03` R`@\x81 \x80T`\xFF\x19\x16`\x01\x17\x90U\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045a\x03\x96a+GV[\x80\x82R`\x07` R`\xFF`@\x83 T\x16`\x07\x81\x10\x15a\x04\x06W`\x01\x03a\x03\xF4W\x80\x82R`\x07` R`@\x82 \x80T`\xFF\x19\x16`\x02\x17\x90U\x7F\x87h\x16\xF4\xC1x]O\xE0\xA5\xFB,\x17>\x1A\x11\x89\xF0\x8D\xBFVd\xFF\x14\xA5P\x99=(\xF4ld\x82\x80\xA2\x80\xF3[c\x1EO\x9A\x8F`\xE0\x1B\x82R`\x04R`$\x90\xFD[cNH{q`\xE0\x1B\x83R`!`\x04R`$\x83\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045\x80\x82R`\x07` R`\xFF`@\x83 T\x16`\x07\x81\x10\x15a\x04\x06W`\x01\x03a\x04\xB5W`\x01`\x01`\xA0\x1B\x03a\x04`\x82a)2V[Q\x163\x03a\x04\xA6W\x80\x82R`\x07` R`@\x82 \x80T`\xFF\x19\x16`\x06\x17\x90U\x7F\xC0\x8E\xB6M\xB1j9\xD2\x84\x89`\xAF\x04\xE3\xF1o\xB4\x04\xD9\xD46\xA9\xF0\xE9\xD7\xD0\xD4\x85G\x15\xC9\xDC\x82\x80\xA2\x80\xF3[ck\xC0\xA3\xC9`\xE0\x1B\x82R`\x04\x82\xFD[cu\xA7\xC9\x1D`\xE1\x1B\x82R`\x04\x82\xFD[P4a\x024W\x80`\x03\x196\x01\x12a\x024W`@` \x913\x81R`\x02\x83R T`@Q\x90\x81R\xF3[P4a\x024W` a\x05\x04a\x04\xFF6a \xFEV[a(\xB1V[`@Q\x90\x15\x15\x81R\xF3[P4a\x024Wa\x031a\x05(a\x05#6a\x1B\xFCV[a'\xB3V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a\"\x03V[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045\x81R`\x07` R`\xFF`@\x82 T\x16`@Q\x90`\x07\x81\x10\x15a\x04\x06W` \x92P\x81R\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x05\x8Fa\x19\x08V[a\x05\x97a+GV[`\x01`\x01`\xA0\x1B\x03\x16\x80\x82R`\x04` R`@\x82 \x80T`\xFF\x19\x16\x90U\x7F\xB0\xC9q|\x14/\x93\xDB\xBD\x96\xF8\x87c\xE6\x91Lq:\x8D+\x1F\xD9z\xFE\x1AD\x07\xCB\x94\x14\xB3;\x82\x80\xA2\x80\xF3[P4a\x024W\x80`\x03\x196\x01\x12a\x024W`\tT`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x06\x1Ea\x19\x08V[a\x06&a+GV[`\x01`\x01`\xA0\x1B\x03\x16\x81R`\x03` R`@\x81 \x80T`\xFF\x19\x16\x90U\x80\xF3[P4a\x024W\x80`\x03\x196\x01\x12a\x024WT`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x045\x90`\x01`\x01`@\x1B\x03\x82\x11a\x024W` a\x06\xA7a\x06\xA26`\x04\x86\x01a\x1ANV[a.\x9EV[`@Q\x90\x81R\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x06\xC9a\x19\x08V[a\x06\xD1a+GV[`\x01\x80`\xA0\x1B\x03\x16k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\xA0\x1B`\tT\x16\x17`\tU\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x07\x0Ea\x19\x08V[a\x07\x16a+GV[`\x01`\x01`\xA0\x1B\x03\x16\x80\x82R`\x04` R`@\x82 \x80T`\xFF\x19\x16`\x01\x17\x90U\x7F\xBEv\x91\x0E\x8B,(\x1B\x08\x04q\x13\x94\xE0\x90\xE9&N\xD0`F\xF0\x06\x7F \xB2\xFD\xEB\x93\xD9\x11\x0E\x82\x80\xA2\x80\xF3[P4a\x024W\x80`\x03\x196\x01\x12a\x024Wa\x07va+GV[\x80T`\x01`\x01`\xA0\x1B\x03\x19\x81\x16\x82U\x81\x90`\x01`\x01`\xA0\x1B\x03\x16\x7F\x8B\xE0\x07\x9CS\x16Y\x14\x13D\xCD\x1F\xD0\xA4\xF2\x84\x19I\x7F\x97\"\xA3\xDA\xAF\xE3\xB4\x18okdW\xE0\x82\x80\xA3\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W`\x01`\x01`\xA0\x1B\x03a\x07\xD9a\x19\x08V[\x16\x81R`\x05` R`@\x81 `@Q\x91\x82` \x83T\x91\x82\x81R\x01\x92\x82R` \x82 \x91[\x81\x81\x10a\x08'Wa\x031\x85a\x08\x13\x81\x87\x03\x82a\x19\xB9V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a!\xCFV[\x82T\x84R` \x90\x93\x01\x92`\x01\x92\x83\x01\x92\x01a\x07\xFCV[P4a\x024Wa\x08L6a \xFEV[\x80Q\x903\x83R`\x04` R`\xFF`@\x84 T\x16\x15a\r\x8CW\x80QQ`\x01`\x01`\xA0\x1B\x03\x16\x83R`\x02` R`@\x80\x84 T\x90\x83\x01Q\x11\x15a\r}W` \x82\x01QC\x11a\rnWa\x08\x9C0\x82a+\x9FV[\x15a\r_Wa\x08\xAA\x82a.\x9EV[\x91\x82\x84R`\x07` R`\xFF`@\x85 T\x16`\x07\x81\x10\x15a\rKWa\r7W`\tT\x81Q``\x83\x01\x80Q`\x80\x85\x01\x80Q\x90\x96\x92\x95\x94\x92\x93\x89\x93`\x01`\x01`\xA0\x1B\x03\x93\x84\x16\x93\x91\x82\x16\x91\x16\x80;\x15a\r3W\x84\x92`@Q\x94\x85\x93c)iQ\x11`\xE2\x1B\x85R`\x04\x85\x01R\x8B`$\x85\x01R`D\x84\x01R`d\x83\x01R`\xA0`\x84\x83\x01R\x81\x83\x81a\t8`\xA4\x82\x01\x8Aa \x9BV[\x03\x92Z\xF1\x80\x15a\r(Wa\r\x0FW[PP\x80Q`@`\x01\x80`\xA0\x1B\x03\x82Q\x16\x91\x01Q\x90\x80\x88R`\x02` R`@\x88 T\x82\x11a\x0C\xFCW[PP\x84\x86R`\x06` \x90\x81R`@\x80\x88 \x83Q\x80Q\x82T`\x01`\x01`\xA0\x1B\x03\x19\x90\x81\x16`\x01`\x01`\xA0\x1B\x03\x92\x83\x16\x17\x84U\x94\x82\x01Q`\x01\x84\x01U\x92\x81\x01Q`\x02\x83\x01U``\x81\x01Q`\x03\x83\x01\x80T\x90\x95\x16\x93\x16\x92\x90\x92\x17\x90\x92U`\x80\x81\x01Q`\x04\x83\x01U`\xA0\x01Q\x80Q\x80Q\x90`\x05\x84\x01\x90`\x01`\x01`@\x1B\x03\x83\x11a\x0C\xCBW`\x01`@\x1B\x83\x11a\x0C\xCBW` \x90a\n\x0C\x84\x84T\x81\x86U\x85a&\xB4V[\x01\x90\x8AR` \x8A \x8A[\x83\x81\x10a\x0C\xDFWPPPP`\x06\x82\x01` \x82\x01Q\x90\x81Q\x91`\x01`\x01`@\x1B\x03\x83\x11a\x0C\xCBW`\x01`@\x1B\x83\x11a\x0C\xCBW` \x90a\nY\x84\x84T\x81\x86U\x85a&\xB4V[\x01\x90\x8AR` \x8A \x8A[\x83\x81\x10a\x0C\xB7WPPPP`\x07\x82\x01\x90`@\x81\x01Q\x90`\x03\x82\x10\x15a\x0C\xA3W``\x83T\x91\x01Q`\x04\x81\x10\x15a\x0C\x8FW\x91`\x08\x93\x91`\xFFa\xFF\0` \x97\x95\x87\x1B\x16\x92\x16\x90a\xFF\xFF\x19\x16\x17\x17\x90U\x01\x91\x01Q\x80Q\x90`\x01`\x01`@\x1B\x03\x82\x11a\x0C{W\x81\x90a\n\xD0\x84Ta$IV[`\x1F\x81\x11a\x0C@W[P` \x90`\x1F\x83\x11`\x01\x14a\x0B\xDDW\x89\x92a\x0B\xD2W[PP\x81`\x01\x1B\x91`\0\x19\x90`\x03\x1B\x1C\x19\x16\x17\x90U[\x83\x85R`\x07` R`@\x85 `\x01`\xFF\x19\x82T\x16\x17\x90U`\x01\x80`\xA0\x1B\x03\x81Q\x16\x85R`\x05` Ra\x0B9\x84`@\x87 a&\xE6V[`\xA0`\x01\x80\x82\x1B\x03\x82Q\x16\x92`\x01\x80\x83\x1B\x03\x90Q\x16\x93Q\x91\x01\x94\x85Q\x90\x81Q\x96`@` \x84\x01Q\x93\x01Q\x91`\x03\x83\x10\x15a\x0B\xBEWP\x92a\x0B\xB3\x7F\xC9\xBB\xB5=&\xEA\x14$\x11\xFA\xAD\x9E\xC6\x12\x82\xA8\xC0;\x83H\x9F\xF7\xB4\xA6F\xD2)r<(O+\x93` \x99\x93a\x0B\xA6``\x8B\x98Q\x01a&\xD9V[\x91`@Q\x95\x86\x95\x86a'\x0FV[\x03\x90\xA4`@Q\x90\x81R\xF3[cNH{q`\xE0\x1B\x81R`!`\x04R`$\x90\xFD[\x01Q\x90P8\x80a\n\xEFV[\x84\x8AR\x81\x8A \x92P`\x1F\x19\x84\x16\x8A[\x81\x81\x10a\x0C(WP\x90\x84`\x01\x95\x94\x93\x92\x10a\x0C\x0FW[PPP\x81\x1B\x01\x90Ua\x0B\x04V[\x01Q`\0\x19`\xF8\x84`\x03\x1B\x16\x1C\x19\x16\x90U8\x80\x80a\x0C\x02V[\x92\x93` `\x01\x81\x92\x87\x86\x01Q\x81U\x01\x95\x01\x93\x01a\x0B\xECV[a\x0Ck\x90\x85\x8BR` \x8B `\x1F\x85\x01`\x05\x1C\x81\x01\x91` \x86\x10a\x0CqW[`\x1F\x01`\x05\x1C\x01\x90a&\x9DV[8a\n\xD9V[\x90\x91P\x81\x90a\x0C^V[cNH{q`\xE0\x1B\x88R`A`\x04R`$\x88\xFD[cNH{q`\xE0\x1B\x8BR`!`\x04R`$\x8B\xFD[cNH{q`\xE0\x1B\x8AR`!`\x04R`$\x8A\xFD[`\x01\x90` \x84Q\x94\x01\x93\x81\x84\x01U\x01a\ncV[cNH{q`\xE0\x1B\x8BR`A`\x04R`$\x8B\xFD[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x81\x83\x01U` \x90\x92\x01\x91`\x01\x01a\n\x16V[\x87R`\x02` R`@\x87 U8\x80a\toV[\x81a\r\x19\x91a\x19\xB9V[a\r$W\x858a\tGV[\x85\x80\xFD[`@Q=\x84\x82>=\x90\xFD[\x84\x80\xFD[c\xF2\xCB\xD3Q`\xE0\x1B\x84R`\x04\x83\x90R`$\x84\xFD[cNH{q`\xE0\x1B\x85R`!`\x04R`$\x85\xFD[c]\r5\xD9`\xE1\x1B\x83R`\x04\x83\xFD[cm\x0F|\xF1`\xE0\x1B\x83R`\x04\x83\xFD[c\n\xA0\xFAe`\xE3\x1B\x83R`\x04\x83\xFD[c\x1CZaC`\xE1\x1B\x83R`\x04\x83\xFD[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\x031a\r\xBB`\x045a$\x83V[`@Q\x91\x82\x91` \x83R` \x83\x01\x90a \x9BV[P4a\x024W` 6`\x03\x19\x01\x12a\x024Wa\r\xE9a\x19\x08V[a\r\xF1a+GV[`\x01\x80`\xA0\x1B\x03\x16k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\xA0\x1B`\nT\x16\x17`\nU\x80\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W` \x90`@\x90`\x01`\x01`\xA0\x1B\x03a\x0E<a\x19\x08V[\x16\x81R`\x02\x83R T`@Q\x90\x81R\xF3[P4a\x024Wa\x0E\\6a\x1B\xFCV[a\x0Ee\x81a'\xB3V[\x90\x80Q\x90a\x0Eqa+GV[\x83[\x82Q\x81\x10\x15a\x0F\x1AWa\x0E\x86\x81\x84a#\xC5V[Qa\x0E\x8Fa+GV[\x80\x86R`\x07` R`\xFF`@\x87 T\x16`\x07\x81\x10\x15a\x0F\x06W`\x01\x03a\x0E\xF4W\x80\x86R`\x07` R`@\x86 \x80T`\xFF\x19\x16`\x02\x17\x90U`\x01\x91\x90\x7F\x87h\x16\xF4\xC1x]O\xE0\xA5\xFB,\x17>\x1A\x11\x89\xF0\x8D\xBFVd\xFF\x14\xA5P\x99=(\xF4ld\x87\x80\xA2\x01a\x0EsV[c\x1EO\x9A\x8F`\xE0\x1B\x86R`\x04R`$\x85\xFD[cNH{q`\xE0\x1B\x87R`!`\x04R`$\x87\xFD[P\x83\x83` \x83\x01Q\x92`@\x81\x01Q\x92`\x80``\x83\x01Q\x92\x01Q`\x01\x80`\xA0\x1B\x03`\x0BT\x16\x80;\x15a\x18^W`@Qc\x02\x05\xDCY`\xE0\x1B\x81R`\xA0`\x04\x82\x01R\x83\x81\x80a\x0F\xBEa\x0F\xACa\x0F\x9Aa\x0F\x88\x8Ea\x0Fv`\xA4\x87\x01\x8Fa\"\x03V[\x86\x81\x03`\x03\x19\x01`$\x88\x01R\x90a\"\x03V[\x84\x81\x03`\x03\x19\x01`D\x86\x01R\x8Da\"\x84V[\x83\x81\x03`\x03\x19\x01`d\x85\x01R\x8Aa\"\xF5V[\x82\x81\x03`\x03\x19\x01`\x84\x84\x01R\x87a#aV[\x03\x81\x85Z\xFA\x80\x15a\x18vWa\x18bW[P\x80;\x15a\x18^W`@Qc\xF0\x8Ft{`\xE0\x1B\x81R`\x80`\x04\x82\x01R\x90\x83\x90\x82\x90\x81\x80a\x10>a\x10,a\x10\x1A\x8Ea\x10\x08`\x84\x86\x01\x8Fa\"\x03V[\x85\x81\x03`\x03\x19\x01`$\x87\x01R\x90a\"\x03V[\x83\x81\x03`\x03\x19\x01`D\x85\x01R\x8Da\"\x84V[\x82\x81\x03`\x03\x19\x01`d\x84\x01R\x88a#aV[\x03\x91Z\xFA\x80\x15a\x18SW\x90\x83\x91a\x18>W[PP\x83Q\x94a\x10^\x86a\x19\xDAV[\x95a\x10l`@Q\x97\x88a\x19\xB9V[\x80\x87Ra\x10{`\x1F\x19\x91a\x19\xDAV[\x016` \x88\x017\x82[\x85Q\x81\x10\x15a\x10\xBCW\x80a\x10\xABa\x10\xA6a\x10\xA0`\x01\x94\x8Aa#\xC5V[Qa.\x9EV[a\"\\V[a\x10\xB5\x82\x8Aa#\xC5V[R\x01a\x10\x84V[P\x91\x94\x95\x90\x92\x95\x82Qa\x16vW[P\x84[\x87Q\x81\x10\x15a\x11\0W\x80a\x10\xE3`\x01\x92\x8Aa#\xC5V[Q\x87R`\x07` R`@\x87 \x80T`\xFF\x19\x16`\x03\x17\x90U\x01a\x10\xCDV[P\x91\x94\x90\x92\x95\x84[\x87Q\x81\x10\x15a\x11KW\x80a\x11!a\x10\xA0`\x01\x93\x8Ba#\xC5V[\x7F1\xB5\xEB\xB8\x81=\xFC\0\x9A\xD4\x17F,b\x9D\xF2\x16H\x1A\x8E]\xA7k\xDAT\xD5b\x93H\x0F\xA2\x91\x88\x80\xA2\x01a\x11\x08V[P\x90\x91\x92\x94\x84`@\x80Qa\x11^\x81a\x197V[\x82\x81R\x81Qa\x11l\x81a\x19hV[\x83\x81R\x83` \x82\x01R` \x82\x01R\x01R\x84[\x83Q\x81\x10\x15a\x15\xE3Wa\x11\x91\x81\x85a#\xC5V[Q` \x81\x01\x90a\x11\xA1\x82Qa+:V[`\x02\x81\x10\x15a\x15\xCFW\x15a\x11\xBAW[PP`\x01\x01a\x11~V[`\x01`\x01`@\x1B\x03` a\x11\xD4\x82a\x11\xE0\x94Q\x16\x8Da#\xC5V[Q\x93Q\x01Q\x16\x87a#\xC5V[Q\x80Q\x82Q\x91\x92\x91`\x01`\x01`\xA0\x1B\x03\x91\x82\x16\x91\x16\x03a\x15\xC0W` \x90`@Qa\x12\n\x83\x82a\x19\xB9V[\x89\x81R`@Qa\x12\x19\x81a\x19hV[\x84\x81R\x83\x81\x01\x91\x82Ra\x124a\x12.\x86a.\x9EV[\x93a.\x9EV[\x83\x8CR`\x08\x85R`@\x8C U`\x01\x80`\xA0\x1B\x03\x85Q\x16\x8BR`\x05\x84Ra\x12]\x83`@\x8D a&\xE6V[\x82\x8BR`\x06\x84R`@\x80\x8C \x91Q\x80Q\x83T`\x01`\x01`\xA0\x1B\x03\x19\x90\x81\x16`\x01`\x01`\xA0\x1B\x03\x92\x83\x16\x17\x85U\x82\x88\x01Q`\x01\x86\x01U\x92\x82\x01Q`\x02\x85\x01U``\x82\x01Q`\x03\x85\x01\x80T\x90\x94\x16\x91\x16\x17\x90\x91U`\x80\x81\x01Q`\x04\x83\x01U`\xA0\x01Q\x80Q\x80Q\x90`\x05\x84\x01\x90`\x01`\x01`@\x1B\x03\x83\x11a\x15\x91W`\x01`@\x1B\x83\x11a\x15\x91W\x90\x87\x8F\x92a\x12\xF3\x85\x84T\x81\x86U\x85a&\xB4V[\x01\x91R\x8D\x87\x81 \x90[\x83\x81\x10a\x15\xA5WPPPP`\x06\x82\x01\x85\x82\x01Q\x90\x81Q\x91`\x01`\x01`@\x1B\x03\x83\x11a\x15\x91W`\x01`@\x1B\x83\x11a\x15\x91W\x90\x87\x8F\x92a\x13?\x85\x84T\x81\x86U\x85a&\xB4V[\x01\x91R\x8D\x87\x81 \x90[\x83\x81\x10a\x15\x7FWPPPP`\x07\x82\x01\x90`@\x81\x01Q\x90`\x03\x82\x10\x15a\x14\x93W``\x83T\x91\x01Q`\x04\x81\x10\x15a\x15kW\x90`\xFF\x8F`\x08\x96\x95\x94\x93a\xFF\0\x91P\x87\x1B\x16\x92\x16\x90a\xFF\xFF\x19\x16\x17\x17\x90U\x01\x90Q\x80Q\x90`\x01`\x01`@\x1B\x03\x82\x11a\x15WW\x81\x90\x8Ca\x13\xB6\x85Ta$IV[\x87`\x1F\x82\x11a\x15)W[PPP\x85\x90\x8D`\x1F\x84\x11`\x01\x14a\x14\xC6W\x92a\x14\xBBW[PP\x81`\x01\x1B\x91`\0\x19\x90`\x03\x1B\x1C\x19\x16\x17\x90U[\x80\x89R`\x07\x82R`@\x89 `\x01`\xFF\x19\x82T\x16\x17\x90U`\x01T`\0\x19\x81\x14a\x14\xA7W`\x01\x01`\x01U`\x01\x80`\xA0\x1B\x03\x83Q\x16\x91`\x01\x80`\xA0\x1B\x03``\x85\x01Q\x16\x93`\xA0`\x80\x82\x01Q\x91\x01\x80Q\x90`@\x82Q\x94\x83\x01Q\x92\x01Q\x90`\x03\x82\x10\x15a\x14\x93W`\x01\x98\x97\x96\x95\x94\x92\x7F\xC9\xBB\xB5=&\xEA\x14$\x11\xFA\xAD\x9E\xC6\x12\x82\xA8\xC0;\x83H\x9F\xF7\xB4\xA6F\xD2)r<(O+\x94\x92a\x0B\xA6``a\x14\x89\x94Q\x01a&\xD9V[\x03\x90\xA4\x90\x89a\x11\xB0V[cNH{q`\xE0\x1B\x8ER`!`\x04R`$\x8E\xFD[cNH{q`\xE0\x1B\x8AR`\x11`\x04R`$\x8A\xFD[\x01Q\x90P\x8E\x80a\x13\xD7V[\x85\x81R\x87\x81 \x93P`\x1F\x19\x85\x16\x90[\x88\x82\x82\x10a\x15\x13WPP\x90\x84`\x01\x95\x94\x93\x92\x10a\x14\xFAW[PPP\x81\x1B\x01\x90Ua\x13\xECV[\x01Q`\0\x19`\xF8\x84`\x03\x1B\x16\x1C\x19\x16\x90U\x8E\x80\x80a\x14\xEDV[`\x01\x85\x96\x82\x93\x96\x86\x01Q\x81U\x01\x95\x01\x93\x01a\x14\xD5V[\x82\x87a\x15O\x94R `\x1F\x85\x01`\x05\x1C\x81\x01\x91\x89\x86\x10a\x0CqW`\x1F\x01`\x05\x1C\x01\x90a&\x9DV[\x8C8\x87a\x13\xC0V[cNH{q`\xE0\x1B\x8CR`A`\x04R`$\x8C\xFD[cNH{q`\xE0\x1B\x8FR`!`\x04R`$\x8F\xFD[\x82Q\x82\x82\x01U\x91\x88\x01\x91`\x01\x01a\x13HV[cNH{q`\xE0\x1B\x8FR`A`\x04R`$\x8F\xFD[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x82\x82\x01U\x91\x88\x01\x91`\x01\x01a\x12\xFCV[cEK\x12\xD9`\xE0\x1B\x88R`\x04\x88\xFD[cNH{q`\xE0\x1B\x89R`!`\x04R`$\x89\xFD[Pa\x16\x15\x91a\x16]a\x16k\x92a\x16K`\xA0\x96a\x169\x8Ba\x16'` \x9B`@Q\x9A\x8B\x99\x8E\x8B\x01\x9D\x8ER`\xC0\x8B\x01\x90a!\xCFV[\x89\x81\x03`\x1F\x19\x01`@\x8B\x01R\x90a\"\x03V[\x87\x81\x03`\x1F\x19\x01``\x89\x01R\x90a\"\x84V[\x85\x81\x03`\x1F\x19\x01`\x80\x87\x01R\x90a\"\xF5V[\x83\x81\x03`\x1F\x19\x01`\xA0\x85\x01R\x90a#aV[\x03`\x1F\x19\x81\x01\x83R\x82a\x19\xB9V[Q\x90 `@Q\x90\x81R\xF3[\x93\x91\x90\x95`\x01\x80`\xA0\x99\x97\x99\x1B\x03`\nT\x16\x95`\x01\x80`\xA0\x1B\x03`\tT\x16\x94\x89[\x83Q\x81\x10\x15a\x18-Wa\x16\xAA\x81\x85a#\xC5V[Q` \x81\x01\x90a\x16\xBA\x82Qa+:V[`\x02\x81\x10\x15a\x14\x93W\x8B\x8E\x93\x89\x8B\x94`\x01\x8F\x95\x14a\x16\xE2W[PPPPPPP`\x01\x01a\x16\x97V[a\x17\x10` \x93a\x17\t\x85\x94`\x01`\x01`@\x1B\x03\x80a\x17!\x96Q\x16\x97\x88\x94Q\x01Q\x16\x90a#\xC5V[Q\x97a#\xC5V[Q\x92a\x17\x1B\x84a.\x9EV[\x95a#\xC5V[Q\x94`\x84`\x01\x80`\xA0\x1B\x03`@\x83\x01Q\x16\x88\x84`\x01\x80`\xA0\x1B\x03\x85Q\x16\x94\x01\x96\x87Q\x98`@Q\x99\x8A\x96\x87\x95c\x0C\xE0\x07\xE3`\xE2\x1B\x87R`\x04\x87\x01R`$\x86\x01R`D\x85\x01R`d\x84\x01RZ\xF1\x92\x83\x15a\x18\"W\x85\x93a\x17\xEFW[P``\x01Q\x90Q\x91`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x90\x8B;\x15a\r3W`@Q\x93c\xCA\r\x857`\xE0\x1B\x85R`\x04\x85\x01R`$\x84\x01R`D\x83\x01R`d\x82\x01R\x81\x81`\x84\x81\x83\x8DZ\xF1\x80\x15a\r(Wa\x17\xD6W[\x89\x8B\x82\x89\x8B\x94a\x16\xD3V[\x81a\x17\xE0\x91a\x19\xB9V[a\x17\xEBW\x8A\x8Ca\x17\xCBV[\x8A\x80\xFD[\x90\x92P` \x81=\x82\x11a\x18\x1AW[\x81a\x18\n` \x93\x83a\x19\xB9V[\x81\x01\x03\x12a\r3WQ\x918a\x17zV[=\x91Pa\x17\xFDV[`@Q=\x87\x82>=\x90\xFD[P\x94P\x97\x95P\x95\x90\x91\x93P\x87a\x10\xCAV[\x81a\x18H\x91a\x19\xB9V[a\x022W\x81\x88a\x10PV[`@Q=\x85\x82>=\x90\xFD[\x82\x80\xFD[\x83a\x18o\x91\x94\x92\x94a\x19\xB9V[\x91\x88a\x0F\xCEV[`@Q=\x86\x82>=\x90\xFD[P4a\x024W\x80`\x03\x196\x01\x12a\x024W`\nT`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x90\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W` \x90`\xFF\x90`@\x90`\x01`\x01`\xA0\x1B\x03a\x18\xD5a\x19\x08V[\x16\x81R`\x03\x84R T\x16`@Q\x90\x15\x15\x81R\xF3[P4a\x024W` 6`\x03\x19\x01\x12a\x024W` a\x06\xA7`\x045a\"\\V[`\x045\x90`\x01`\x01`\xA0\x1B\x03\x82\x16\x82\x03a\x19\x1EWV[`\0\x80\xFD[5\x90`\x01`\x01`\xA0\x1B\x03\x82\x16\x82\x03a\x19\x1EWV[``\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[`\xC0\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[`\x80\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[\x90`\x1F\x80\x19\x91\x01\x16\x81\x01\x90\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@RV[`\x01`\x01`@\x1B\x03\x81\x11a\x19RW`\x05\x1B` \x01\x90V[\x90\x80`\x1F\x83\x01\x12\x15a\x19\x1EW\x815a\x1A\x08\x81a\x19\xDAV[\x92a\x1A\x16`@Q\x94\x85a\x19\xB9V[\x81\x84R` \x80\x85\x01\x92`\x05\x1B\x82\x01\x01\x92\x83\x11a\x19\x1EW` \x01\x90[\x82\x82\x10a\x1A>WPPP\x90V[\x815\x81R` \x91\x82\x01\x91\x01a\x1A1V[\x91\x90`\xC0\x83\x82\x03\x12a\x19\x1EW`@Qa\x1Af\x81a\x19\x83V[\x80\x93a\x1Aq\x81a\x19#V[\x82R` \x81\x015` \x83\x01R`@\x81\x015`@\x83\x01Ra\x1A\x93``\x82\x01a\x19#V[``\x83\x01R`\x80\x81\x015`\x80\x83\x01R`\xA0\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW\x01`\x80\x81\x84\x03\x12a\x19\x1EW`@Q\x92a\x1A\xCE\x84a\x19\x9EV[\x815`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82\x01\x81`\x1F\x82\x01\x12\x15a\x19\x1EW\x805\x90a\x1A\xF7\x82a\x19\xDAV[\x91a\x1B\x05`@Q\x93\x84a\x19\xB9V[\x80\x83R` \x80\x84\x01\x91`\x05\x1B\x83\x01\x01\x91\x84\x83\x11a\x19\x1EW` \x01\x90[\x82\x82\x10a\x1B\xD0WPPP\x84R` \x82\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82\x01\x90\x80`\x1F\x83\x01\x12\x15a\x19\x1EW\x815a\x1BY\x81a\x19\xDAV[\x92a\x1Bg`@Q\x94\x85a\x19\xB9V[\x81\x84R` \x80\x85\x01\x92`\x05\x1B\x82\x01\x01\x92\x83\x11a\x19\x1EW` \x01\x90[\x82\x82\x10a\x1B\xC0WPPP` \x84\x01R`@\x81\x015\x90`\x03\x82\x10\x15a\x19\x1EW``\x91`@\x85\x01R\x015\x90`\x04\x82\x10\x15a\x19\x1EW`\xA0\x91``\x84\x01R\x01RV[\x815\x81R` \x91\x82\x01\x91\x01a\x1B\x82V[` \x80\x91a\x1B\xDD\x84a\x19#V[\x81R\x01\x91\x01\x90a\x1B!V[5\x90`\x01`\x01`@\x1B\x03\x82\x16\x82\x03a\x19\x1EWV[` `\x03\x19\x82\x01\x12a\x19\x1EW`\x045\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW`\xA0\x82\x82\x03`\x03\x19\x01\x12a\x19\x1EW`@Q\x91`\xA0\x83\x01\x83\x81\x10`\x01`\x01`@\x1B\x03\x82\x11\x17a\x19RW`@R\x80`\x04\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82`\x04a\x1Cg\x92\x84\x01\x01a\x19\xF1V[\x83R`$\x81\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x81\x01\x82`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015a\x1C\x97\x81a\x19\xDAV[\x91a\x1C\xA5`@Q\x93\x84a\x19\xB9V[\x81\x83R` `\x04\x81\x85\x01\x93`\x05\x1B\x83\x01\x01\x01\x91\x85\x83\x11a\x19\x1EW`$\x82\x01\x90[\x83\x82\x10a\x1F>WPPPP` \x84\x01R`D\x81\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x81\x01\x82`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015a\x1D\x03\x81a\x19\xDAV[\x91a\x1D\x11`@Q\x93\x84a\x19\xB9V[\x81\x83R` `\x04\x81\x85\x01\x93`\x07\x1B\x83\x01\x01\x01\x90\x85\x82\x11a\x19\x1EW`$\x01\x91[\x81\x83\x10a\x1E\xEAWPPP`@\x84\x01R`d\x81\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x81\x01\x82`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015a\x1Dm\x81a\x19\xDAV[\x91a\x1D{`@Q\x93\x84a\x19\xB9V[\x81\x83R` `\x04\x81\x85\x01\x93`\x07\x1B\x83\x01\x01\x01\x90\x85\x82\x11a\x19\x1EW`$\x01\x91[\x81\x83\x10a\x1EpWPPP``\x84\x01R`\x84\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW\x01\x81`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015\x90a\x1D\xD8\x82a\x19\xDAV[\x92a\x1D\xE6`@Q\x94\x85a\x19\xB9V[\x82\x84R` `\x04``\x82\x87\x01\x95\x02\x84\x01\x01\x01\x91\x81\x83\x11a\x19\x1EW`$\x01\x92[\x82\x84\x10a\x1E\x18WPPPP`\x80\x82\x01R\x90V[``\x84\x83\x03\x12a\x19\x1EW`@Q\x90a\x1E/\x82a\x197V[a\x1E8\x85a\x1B\xE8V[\x82Ra\x1EF` \x86\x01a\x1B\xE8V[` \x83\x01R`@\x85\x015\x90`\x02\x82\x10\x15a\x19\x1EW\x82` \x92`@``\x95\x01R\x81R\x01\x93\x01\x92a\x1E\x05V[\x82\x86\x03`\x80\x81\x12a\x19\x1EW`@\x80Q\x91a\x1E\x89\x83a\x197V[a\x1E\x92\x86a\x1B\xE8V[\x83R`\x1F\x19\x01\x12a\x19\x1EW`@Q\x91a\x1E\xAA\x83a\x19hV[` \x85\x015\x91`\x02\x83\x10\x15a\x19\x1EW\x83` \x93`\x80\x95Ra\x1E\xCD`@\x88\x01a\x1B\xE8V[\x84\x82\x01R\x83\x82\x01R``\x86\x015`@\x82\x01R\x81R\x01\x92\x01\x91a\x1D\x9AV[`\x80\x83\x87\x03\x12a\x19\x1EW` `\x80\x91`@Qa\x1F\x05\x81a\x19\x9EV[a\x1F\x0E\x86a\x19#V[\x81R\x82\x86\x015\x83\x82\x01Ra\x1F$`@\x87\x01a\x19#V[`@\x82\x01R``\x86\x015``\x82\x01R\x81R\x01\x92\x01\x91a\x1D0V[\x815`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW` \x91a\x1Fc\x89\x84`\x04\x81\x95\x89\x01\x01\x01a\x1ANV[\x81R\x01\x91\x01\x90a\x1C\xC5V[\x90`\x03\x82\x10\x15a\x1F{WRV[cNH{q`\xE0\x1B`\0R`!`\x04R`$`\0\xFD[\x90`\x04\x82\x10\x15a\x1F{WRV[`\xA0\x90`\x01\x80\x83\x1B\x03\x81Q\x16\x83R` \x81\x01Q` \x84\x01R`@\x81\x01Q`@\x84\x01R`\x01\x80\x83\x1B\x03``\x82\x01Q\x16``\x84\x01R`\x80\x81\x01Q`\x80\x84\x01R\x01Q\x90`\xC0`\xA0\x82\x01Ra\x01@\x81\x01\x91\x80Q\x92`\x80`\xC0\x84\x01R\x83Q\x80\x91R` a\x01`\x84\x01\x94\x01\x90`\0[\x81\x81\x10a |WPPP` \x81\x81\x01Q\x83\x85\x03`\xBF\x19\x01`\xE0\x85\x01R\x80Q\x80\x86R\x94\x82\x01\x94\x91\x01\x90`\0[\x81\x81\x10a fWPPP\x90a\x01 ``\x83a Y`@a c\x96\x01Qa\x01\0\x86\x01\x90a\x1FnV[\x01Q\x91\x01\x90a\x1F\x91V[\x90V[\x82Q\x86R` \x95\x86\x01\x95\x90\x92\x01\x91`\x01\x01a 2V[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x86R` \x95\x86\x01\x95\x90\x92\x01\x91`\x01\x01a \x07V[\x91\x90\x91` a \xB3\x82Q`@\x86R`@\x86\x01\x90a\x1F\x9EV[\x91\x01Q\x92` \x81\x83\x03\x91\x01R\x82Q\x92\x83\x82R`\0[\x84\x81\x10a \xE9WPP\x82`\0` \x80\x94\x95\x84\x01\x01R`\x1F\x80\x19\x91\x01\x16\x01\x01\x90V[\x80` \x80\x92\x84\x01\x01Q\x82\x82\x86\x01\x01R\x01a \xC8V[` `\x03\x19\x82\x01\x12a\x19\x1EW`\x045\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW`@\x82\x82\x03`\x03\x19\x01\x12a\x19\x1EW`@Q\x91a!7\x83a\x19hV[\x80`\x04\x015`\x01`\x01`@\x1B\x03\x81\x11a\x19\x1EW\x82`\x04a!Y\x92\x84\x01\x01a\x1ANV[\x83R`$\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19\x1EW\x01\x81`#\x82\x01\x12\x15a\x19\x1EW`\x04\x81\x015\x90`\x01`\x01`@\x1B\x03\x82\x11a\x19RW`@Q\x92a!\xA7`\x1F\x84\x01`\x1F\x19\x16` \x01\x85a\x19\xB9V[\x82\x84R`$\x82\x84\x01\x01\x11a\x19\x1EW\x81`\0\x92`$` \x93\x01\x83\x86\x017\x83\x01\x01R` \x82\x01R\x90V[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a!\xEDWPPP\x90V[\x82Q\x84R` \x93\x84\x01\x93\x90\x92\x01\x91`\x01\x01a!\xE0V[\x90\x80` \x83Q\x91\x82\x81R\x01\x91` \x80\x83`\x05\x1B\x83\x01\x01\x94\x01\x92`\0\x91[\x83\x83\x10a\"/WPPPPP\x90V[\x90\x91\x92\x93\x94` \x80a\"M`\x01\x93`\x1F\x19\x86\x82\x03\x01\x87R\x89Qa\x1F\x9EV[\x97\x01\x93\x01\x93\x01\x91\x93\x92\x90a\" V[[\x80`\0R`\x08` R`@`\0 T\x15a cW`\0R`\x08` R`@`\0 Ta\"]V[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a\"\xA2WPPP\x90V[\x90\x91\x92` `\x80`\x01\x92``\x87Q\x85\x80`\xA0\x1B\x03\x81Q\x16\x83R\x84\x81\x01Q\x85\x84\x01R\x85\x80`\xA0\x1B\x03`@\x82\x01Q\x16`@\x84\x01R\x01Q``\x82\x01R\x01\x94\x01\x91\x01\x91\x90\x91a\"\x95V[\x90`\x02\x82\x10\x15a\x1F{WRV[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a#\x13WPPP\x90V[\x90\x91\x92` `\x80`\x01\x92`@\x87Q`\x01`\x01`@\x1B\x03\x81Q\x16\x83R`\x01`\x01`@\x1B\x03\x85\x80\x83\x01Qa#H\x82\x87\x01\x82Qa\"\xE8V[\x01Q\x16\x83\x83\x01R\x01Q``\x82\x01R\x01\x94\x01\x92\x91\x01a#\x06V[\x90` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a#\x7FWPPP\x90V[\x90\x91\x92` ```\x01\x92a#\xBA`@\x88Q`\x01`\x01`@\x1B\x03\x81Q\x16\x84R`\x01`\x01`@\x1B\x03\x86\x82\x01Q\x16\x86\x85\x01R\x01Q`@\x83\x01\x90a\"\xE8V[\x01\x94\x01\x92\x91\x01a#rV[\x80Q\x82\x10\x15a#\xD9W` \x91`\x05\x1B\x01\x01\x90V[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`@Q\x90a#\xFC\x82a\x19\x83V[\x81`\0\x81R`\0` \x82\x01R`\0`@\x82\x01R`\0``\x82\x01R`\0`\x80\x82\x01R`\xA0`@Q\x91a$,\x83a\x19\x9EV[``\x83R``` \x84\x01R`\0`@\x84\x01R`\0``\x84\x01R\x01RV[\x90`\x01\x82\x81\x1C\x92\x16\x80\x15a$yW[` \x83\x10\x14a$cWV[cNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[\x91`\x7F\x16\x91a$XV[``` `@Qa$\x93\x81a\x19hV[a$\x9Ba#\xEFV[\x81R\x01R`\0R`\x06` R`@`\0 `@Q\x90a$\xB9\x82a\x19hV[`@Q\x90a$\xC6\x82a\x19\x83V[\x80T`\x01`\x01`\xA0\x1B\x03\x90\x81\x16\x83R`\x01\x82\x01T` \x84\x01R`\x02\x82\x01T`@\x80\x85\x01\x91\x90\x91R`\x03\x83\x01T\x90\x91\x16``\x84\x01R`\x04\x82\x01T`\x80\x84\x01RQ\x91`\x05\x82\x01a%\x13\x84a\x19\x9EV[`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a&{WPPa%D\x92P\x03\x82a\x19\xB9V[\x83R`\x06\x82\x01`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a&bWPPa%{\x92P\x03\x82a\x19\xB9V[` \x84\x01R`\x07\x82\x01T`\xFF\x81\x16\x90`\x03\x82\x10\x15a\x1F{W`\xFF\x91`@\x86\x01R`\x08\x1C\x16\x92`\x04\x84\x10\x15a\x1F{W`\x08\x93``\x82\x01R`\xA0\x82\x01R\x83R\x01`@Q\x90\x81`\0\x82T\x92a%\xCC\x84a$IV[\x80\x84R\x93`\x01\x81\x16\x90\x81\x15a&@WP`\x01\x14a%\xF9W[Pa%\xF1\x92P\x03\x82a\x19\xB9V[` \x82\x01R\x90V[\x90P`\0\x92\x91\x92R` `\0 \x90`\0\x91[\x81\x83\x10a&$WPP\x90` a%\xF1\x92\x82\x01\x018a%\xE4V[` \x91\x93P\x80`\x01\x91T\x83\x85\x88\x01\x01R\x01\x91\x01\x90\x91\x83\x92a&\x0BV[\x90P` \x92Pa%\xF1\x94\x91P`\xFF\x19\x16\x82\x84\x01R\x15\x15`\x05\x1B\x82\x01\x018a%\xE4V[\x84T\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a%fV[\x84T`\x01`\x01`\xA0\x1B\x03\x16\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a%/V[\x81\x81\x10a&\xA8WPPV[`\0\x81U`\x01\x01a&\x9DV[\x91\x81\x81\x10a&\xC1WPPPV[a&\xD7\x92`\0R` `\0 \x91\x82\x01\x91\x01a&\x9DV[V[Q`\x04\x81\x10\x15a\x1F{W\x90V[\x80T\x90`\x01`@\x1B\x82\x10\x15a\x19RW`\x01\x82\x01\x80\x82U\x82\x10\x15a#\xD9W`\0R` `\0 \x01UV[\x92\x91\x90\x95\x94\x93\x95`\xA0\x84\x01\x90\x84R`\xA0` \x85\x01R\x81Q\x80\x91R` `\xC0\x85\x01\x92\x01\x90`\0[\x81\x81\x10a'\x94WPPP\x82\x81\x03`@\x84\x01R` \x80\x83Q\x92\x83\x81R\x01\x92\x01\x90`\0[\x81\x81\x10a'~WPPPa&\xD7\x92\x91a'w`\x80\x92\x96``\x83\x01\x90a\x1FnV[\x01\x90a\x1F\x91V[\x82Q\x84R` \x93\x84\x01\x93\x90\x92\x01\x91`\x01\x01a'WV[\x82Q`\x01`\x01`\xA0\x1B\x03\x16\x84R` \x93\x84\x01\x93\x90\x92\x01\x91`\x01\x01a'5V[\x80QQ\x91a'\xC0\x83a\x19\xDAV[\x92a'\xCE`@Q\x94\x85a\x19\xB9V[\x80\x84Ra'\xDD`\x1F\x19\x91a\x19\xDAV[\x01`\0[\x81\x81\x10a(\x9AWPP`\0[\x82Q\x80Q\x82\x10\x15a(\x93W\x81a(\x02\x91a#\xC5V[Q\x90a(\r\x82a$\x83V[\x91a(\x17\x83a(\xB1V[\x15a(\x7FW\x82QQ`\x01`\x01`\xA0\x1B\x03\x16\x15a(kWPC` \x83Q\x01Q\x10a(ZW`\x01\x91Qa(H\x82\x87a#\xC5V[Ra(S\x81\x86a#\xC5V[P\x01a'\xEDV[cm\x0F|\xF1`\xE0\x1B`\0R`\x04`\0\xFD[c\x06\x94\xB4\xCD`\xE0\x1B`\0R`\x04R`$`\0\xFD[c#\xC0\nW`\xE0\x1B`\0R`\x04R`$`\0\xFD[P\x90\x91PPV[` \x90a(\xA5a#\xEFV[\x82\x82\x88\x01\x01R\x01a'\xE1V[a(\xBB\x81Qa.\x9EV[\x80`\0R`\x07` R`\xFF`@`\0 T\x16`\x07\x81\x10\x15a\x1F{W`\x01\x03a)\x1EW`\0R`\x08` R`@`\0 T\x15a(\xF7W[P`\x01\x90V[a)\x02\x900\x90a+\x9FV[\x15a)\rW8a(\xF1V[c]\r5\xD9`\xE1\x1B`\0R`\x04`\0\xFD[c\x0EmP\xAF`\xE0\x1B`\0R`\x04R`$`\0\xFD[a):a#\xEFV[P`\0R`\x06` R`@`\0 `@Q\x90a)U\x82a\x19hV[`@Q\x90a)b\x82a\x19\x83V[\x80T`\x01`\x01`\xA0\x1B\x03\x90\x81\x16\x83R`\x01\x82\x01T` \x84\x01R`\x02\x82\x01T`@\x80\x85\x01\x91\x90\x91R`\x03\x83\x01T\x90\x91\x16``\x84\x01R`\x04\x82\x01T`\x80\x84\x01RQ\x91`\x05\x82\x01a)\xAF\x84a\x19\x9EV[`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a+\x18WPPa)\xE0\x92P\x03\x82a\x19\xB9V[\x83R`\x06\x82\x01`@Q\x80\x82` \x82\x94T\x93\x84\x81R\x01\x90`\0R` `\0 \x92`\0[\x81\x81\x10a*\xFFWPPa*\x17\x92P\x03\x82a\x19\xB9V[` \x84\x01R`\x07\x82\x01T`\xFF\x81\x16\x90`\x03\x82\x10\x15a\x1F{W`\xFF\x91`@\x86\x01R`\x08\x1C\x16\x92`\x04\x84\x10\x15a\x1F{W`\x08\x93``\x82\x01R`\xA0\x82\x01R\x83R\x01`@Q\x90\x81`\0\x82T\x92a*h\x84a$IV[\x80\x84R\x93`\x01\x81\x16\x90\x81\x15a*\xDDWP`\x01\x14a*\x96W[Pa*\x8D\x92P\x03\x82a\x19\xB9V[` \x82\x01RQ\x90V[\x90P`\0\x92\x91\x92R` `\0 \x90`\0\x91[\x81\x83\x10a*\xC1WPP\x90` a*\x8D\x92\x82\x01\x018a*\x80V[` \x91\x93P\x80`\x01\x91T\x83\x85\x88\x01\x01R\x01\x91\x01\x90\x91\x83\x92a*\xA8V[\x90P` \x92Pa*\x8D\x94\x91P`\xFF\x19\x16\x82\x84\x01R\x15\x15`\x05\x1B\x82\x01\x018a*\x80V[\x84T\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a*\x02V[\x84T`\x01`\x01`\xA0\x1B\x03\x16\x83R`\x01\x94\x85\x01\x94\x86\x94P` \x90\x93\x01\x92\x01a)\xCBV[Q`\x02\x81\x10\x15a\x1F{W\x90V[`\0T`\x01`\x01`\xA0\x1B\x03\x163\x03a+[WV[`d`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R` `$\x82\x01R\x7FOwnable: caller is not the owner`D\x82\x01R\xFD[` \x81Q\x91\x01\x91`A\x83QQ\x03a.YW`@\x90`\r` \x83Qa+\xC3\x85\x82a\x19\xB9V[\x82\x81R\x01l\x12\xDA\x18[\x18[\x9AR[\x9D\x19[\x9D`\x9A\x1B\x81R \x90`\x05` \x84Qa+\xEC\x86\x82a\x19\xB9V[\x82\x81R\x01d\x03\x12\xE3\x02\xE3`\xDC\x1B\x81R \x90\x83Q\x91` \x83\x01\x93\x7F\x91\xAB=\x17\xE3\xA5\n\x9D\x89\xE6?\xD3\x0B\x92\xBE\x7FS6\xB0;({\xB9Fxz\x83\xA9\xD6*'f\x85R\x85\x84\x01R``\x83\x01R`\x01\x80`\xA0\x1B\x03\x16`\x80\x82\x01R`\x80\x81Ra,M`\xA0\x82a\x19\xB9V[Q\x90 \x92`\x01\x80`\xA0\x1B\x03\x83Q\x16\x93` \x84\x01Q\x92\x80\x85\x01Q\x95`\x01\x80`\xA0\x1B\x03``\x87\x01Q\x16\x94`\x80\x87\x01Q\x97`\xA0\x88\x01Q\x98\x89Q\x85Q` \x81\x01\x81\x81\x93` \x81Q\x93\x91\x01\x92`\0[\x81\x81\x10a.7WPPa,\xB3\x92P\x03`\x1F\x19\x81\x01\x83R\x82a\x19\xB9V[Q\x90 \x97` \x8B\x01Q\x86Q` \x81\x01\x81\x81\x93` \x81Q\x93\x91\x01\x92`\0[\x81\x81\x10a.\x1EWPPa,\xEC\x92P\x03`\x1F\x19\x81\x01\x83R\x82a\x19\xB9V[Q\x90 \x98\x86\x8C\x01Q\x9B`\x03\x8D\x10\x15a\x1F{W``\x01Q\x99`\x04\x8B\x10\x15a\x1F{Wa-ba.\x04\x9Ba-Xa.\x0C\x9F\x8BQ\x94` \x86\x01\x96\x7F3\xF3\xE2w}1=\x0E\x16\x0F\xB4H\x07\xB5\x9Bx3\xDC,Cx\x81e@\x8E\xA9o\xBF&\x03(\xF8\x88R\x8D\x87\x01R``\x86\x01R`\x80\x85\x01\x90a\x1FnV[`\xA0\x83\x01\x90a\x1F\x91V[`\xA0\x81Ra-q`\xC0\x82a\x19\xB9V[Q\x90 \x92\x86Q\x94` \x86\x01\x96\x7Fn\xFB9\x0B4\x05\xF0\xE2\x17\x1E0\xD4w\xD2\xAD\xEAEG\x8A\xE7S\xC0\xDBG\x1E\xDF\xB88\xF7\xC6\xDFV\x88R\x88\x87\x01R``\x86\x01R`\x80\x85\x01R`\xA0\x84\x01R`\xC0\x83\x01R`\xE0\x82\x01R`\xE0\x81Ra-\xCDa\x01\0\x82a\x19\xB9V[Q\x90 \x90Q\x90` \x82\x01\x92a\x19\x01`\xF0\x1B\x84R`\"\x83\x01R`B\x82\x01R`B\x81Ra-\xF9`b\x82a\x19\xB9V[Q\x90 \x90Q\x90a.\xC1V[\x92\x90\x92a.\xF9V[Q`\x01`\x01`\xA0\x1B\x03\x91\x82\x16\x91\x16\x14\x90V[\x84Q\x83R` \x94\x85\x01\x94\x86\x94P\x90\x92\x01\x91`\x01\x01a,\xD0V[\x84Q`\x01`\x01`\xA0\x1B\x03\x16\x83R` \x94\x85\x01\x94\x86\x94P\x90\x92\x01\x91`\x01\x01a,\x97V[`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FInvalid signature length\0\0\0\0\0\0\0\0`D\x82\x01R`d\x90\xFD[`@Qa.\xBB\x81a\x16]` \x82\x01\x94` \x86R`@\x83\x01\x90a\x1F\x9EV[Q\x90 \x90V[\x90`A\x81Q\x14`\0\x14a.\xEFWa.\xEB\x91` \x82\x01Q\x90```@\x84\x01Q\x93\x01Q`\0\x1A\x90a/\xFDV[\x90\x91V[PP`\0\x90`\x02\x90V[`\x05\x81\x10\x15a\x1F{W\x80a/\nWPV[`\x01\x81\x03a/WW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x18`$\x82\x01R\x7FECDSA: invalid signature\0\0\0\0\0\0\0\0`D\x82\x01R`d\x90\xFD[`\x02\x81\x03a/\xA4W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1F`$\x82\x01R\x7FECDSA: invalid signature length\0`D\x82\x01R`d\x90\xFD[`\x03\x14a/\xADWV[`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\"`$\x82\x01R\x7FECDSA: invalid signature 's' val`D\x82\x01Raue`\xF0\x1B`d\x82\x01R`\x84\x90\xFD[\x7F\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF]WnsW\xA4P\x1D\xDF\xE9/Fh\x1B \xA0\x84\x11a0}W` \x93`\0\x93`\xFF`\x80\x94`@Q\x94\x85R\x16\x86\x84\x01R`@\x83\x01R``\x82\x01R\x82\x80R`\x01Z\xFA\x15a0qW`\0Q`\x01`\x01`\xA0\x1B\x03\x81\x16\x15a0hW\x90`\0\x90V[P`\0\x90`\x01\x90V[`@Q=`\0\x82>=\x90\xFD[PPPP`\0\x90`\x03\x90V\xFE\xA2dipfsX\"\x12 \x02\xC1\xD8Po\xDF\x14\x04\x01\xE9G\xF2\xB5\x0B\x9DM/%h9\x142\xAAF\x85\xE1\xD5\x0Czv\xC2\xADdsolcC\0\x08\x1C\x003";
    /// The deployed bytecode of the contract.
    pub static INTENTBOOK_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct intentBook<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for intentBook<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for intentBook<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for intentBook<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for intentBook<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(intentBook))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> intentBook<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                INTENTBOOK_ABI.clone(),
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
                INTENTBOOK_ABI.clone(),
                INTENTBOOK_BYTECODE.clone(),
                client,
            );
            let deployer = factory.deploy(constructor_args)?;
            let deployer = ::ethers::contract::ContractDeployer::new(deployer);
            Ok(deployer)
        }
        ///Calls the contract's `addPublisher` (0x763f323d) function
        pub fn add_publisher(
            &self,
            new_publisher: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([118, 63, 50, 61], new_publisher)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `addSolver` (0xec58f4b8) function
        pub fn add_solver(
            &self,
            new_solver: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([236, 88, 244, 184], new_solver)
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
        ///Calls the contract's `checkIntentValidToSpend` (0xcdcef587) function
        pub fn check_intent_valid_to_spend(
            &self,
            signed_intent: SignedIntent,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([205, 206, 245, 135], (signed_intent,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getIntent` (0xf13c46aa) function
        pub fn get_intent(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, Intent> {
            self.0
                .method_hash([241, 60, 70, 170], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getIntentChainRoot` (0x00dce513) function
        pub fn get_intent_chain_root(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([0, 220, 229, 19], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getIntentId` (0x8982c74a) function
        pub fn get_intent_id(
            &self,
            intent: Intent,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([137, 130, 199, 74], (intent,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getIntentIdsByAuthor` (0x6dc632f0) function
        pub fn get_intent_ids_by_author(
            &self,
            author: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::vec::Vec<[u8; 32]>> {
            self.0
                .method_hash([109, 198, 50, 240], author)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getIntentState` (0xb4257b9a) function
        pub fn get_intent_state(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, u8> {
            self.0
                .method_hash([180, 37, 123, 154], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getNonce` (0x2d0335ab) function
        pub fn get_nonce_with_user(
            &self,
            user: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([45, 3, 53, 171], user)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getNonce` (0xd087d288) function
        pub fn get_nonce(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([208, 135, 210, 136], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getReceiptManager` (0x14e03208) function
        pub fn get_receipt_manager(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([20, 224, 50, 8], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getSignedIntent` (0x3c9d9398) function
        pub fn get_signed_intent(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, SignedIntent> {
            self.0
                .method_hash([60, 157, 147, 152], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getTokenManager` (0xab97d59d) function
        pub fn get_token_manager(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([171, 151, 213, 157], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isSolver` (0x02cc250d) function
        pub fn is_solver(
            &self,
            solver: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([2, 204, 37, 13], solver)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `lockIntent` (0xdc94809a) function
        pub fn lock_intent(
            &self,
            intent_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([220, 148, 128, 154], intent_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `lockIntents` (0xf568559e) function
        pub fn lock_intents(
            &self,
            intent_ids: ::std::vec::Vec<[u8; 32]>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([245, 104, 85, 158], intent_ids)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `owner` (0x8da5cb5b) function
        pub fn owner(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([141, 165, 203, 91], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `publishIntent` (0x3ce30eba) function
        pub fn publish_intent(
            &self,
            signed_intent: SignedIntent,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([60, 227, 14, 186], (signed_intent,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `removePublisher` (0xae61c5ae) function
        pub fn remove_publisher(
            &self,
            publisher: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([174, 97, 197, 174], publisher)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `removeSolver` (0x8fd57b92) function
        pub fn remove_solver(
            &self,
            new_solver: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([143, 213, 123, 146], new_solver)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `renounceOwnership` (0x715018a6) function
        pub fn renounce_ownership(&self) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([113, 80, 24, 166], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setReceiptManager` (0x2ff71a69) function
        pub fn set_receipt_manager(
            &self,
            receipt_manager: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([47, 247, 26, 105], receipt_manager)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setTokenManager` (0x7cb2b79c) function
        pub fn set_token_manager(
            &self,
            token_manager: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([124, 178, 183, 156], token_manager)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `solve` (0x2ad75ab1) function
        pub fn solve(
            &self,
            solution: Solution,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([42, 215, 90, 177], (solution,))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `transferOwnership` (0xf2fde38b) function
        pub fn transfer_ownership(
            &self,
            new_owner: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([242, 253, 227, 139], new_owner)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `validateSolutionInputs` (0xcc902109) function
        pub fn validate_solution_inputs(
            &self,
            solution: Solution,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::vec::Vec<Intent>> {
            self.0
                .method_hash([204, 144, 33, 9], (solution,))
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
        ///Gets the contract's `IntentLocked` event
        pub fn intent_locked_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentLockedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentPublisherAdded` event
        pub fn intent_publisher_added_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentPublisherAddedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentPublisherRevoked` event
        pub fn intent_publisher_revoked_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentPublisherRevokedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `IntentSolved` event
        pub fn intent_solved_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, IntentSolvedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `OwnershipTransferred` event
        pub fn ownership_transferred_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, OwnershipTransferredFilter>
        {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, intentBookEvents> {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>> for intentBook<M> {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    ///Custom Error type `IntentBook__CannotCancelNonOpenIntent` with signature `IntentBook__CannotCancelNonOpenIntent()` and selector `0xeb4f923a`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__CannotCancelNonOpenIntent",
        abi = "IntentBook__CannotCancelNonOpenIntent()"
    )]
    pub struct IntentBook__CannotCancelNonOpenIntent;
    ///Custom Error type `IntentBook__CannotLockIntentThatIsNotOpen` with signature `IntentBook__CannotLockIntentThatIsNotOpen(bytes32)` and selector `0x1e4f9a8f`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__CannotLockIntentThatIsNotOpen",
        abi = "IntentBook__CannotLockIntentThatIsNotOpen(bytes32)"
    )]
    pub struct IntentBook__CannotLockIntentThatIsNotOpen {
        pub intent_id: [u8; 32],
    }
    ///Custom Error type `IntentBook__CannotSpendIntentThatIsNotOpen` with signature `IntentBook__CannotSpendIntentThatIsNotOpen(bytes32)` and selector `0x0e6d50af`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__CannotSpendIntentThatIsNotOpen",
        abi = "IntentBook__CannotSpendIntentThatIsNotOpen(bytes32)"
    )]
    pub struct IntentBook__CannotSpendIntentThatIsNotOpen {
        pub intent_id: [u8; 32],
    }
    ///Custom Error type `IntentBook__IntentAlreadyExists` with signature `IntentBook__IntentAlreadyExists(bytes32)` and selector `0xf2cbd351`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__IntentAlreadyExists",
        abi = "IntentBook__IntentAlreadyExists(bytes32)"
    )]
    pub struct IntentBook__IntentAlreadyExists {
        pub intent_id: [u8; 32],
    }
    ///Custom Error type `IntentBook__IntentExpired` with signature `IntentBook__IntentExpired()` and selector `0x6d0f7cf1`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__IntentExpired",
        abi = "IntentBook__IntentExpired()"
    )]
    pub struct IntentBook__IntentExpired;
    ///Custom Error type `IntentBook__IntentNotFound` with signature `IntentBook__IntentNotFound(bytes32)` and selector `0x0694b4cd`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__IntentNotFound",
        abi = "IntentBook__IntentNotFound(bytes32)"
    )]
    pub struct IntentBook__IntentNotFound {
        pub intent_id: [u8; 32],
    }
    ///Custom Error type `IntentBook__IntentNotSpendable` with signature `IntentBook__IntentNotSpendable(bytes32)` and selector `0x23c00a57`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__IntentNotSpendable",
        abi = "IntentBook__IntentNotSpendable(bytes32)"
    )]
    pub struct IntentBook__IntentNotSpendable {
        pub intent_id: [u8; 32],
    }
    ///Custom Error type `IntentBook__InvalidIntentAuthor` with signature `IntentBook__InvalidIntentAuthor()` and selector `0x454b12d9`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__InvalidIntentAuthor",
        abi = "IntentBook__InvalidIntentAuthor()"
    )]
    pub struct IntentBook__InvalidIntentAuthor;
    ///Custom Error type `IntentBook__InvalidIntentNonce` with signature `IntentBook__InvalidIntentNonce()` and selector `0x5507d328`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__InvalidIntentNonce",
        abi = "IntentBook__InvalidIntentNonce()"
    )]
    pub struct IntentBook__InvalidIntentNonce;
    ///Custom Error type `IntentBook__InvalidSignature` with signature `IntentBook__InvalidSignature()` and selector `0xba1a6bb2`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__InvalidSignature",
        abi = "IntentBook__InvalidSignature()"
    )]
    pub struct IntentBook__InvalidSignature;
    ///Custom Error type `IntentBook__UnauthorizedCancellationAttempt` with signature `IntentBook__UnauthorizedCancellationAttempt()` and selector `0x6bc0a3c9`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__UnauthorizedCancellationAttempt",
        abi = "IntentBook__UnauthorizedCancellationAttempt()"
    )]
    pub struct IntentBook__UnauthorizedCancellationAttempt;
    ///Custom Error type `IntentBook__UnauthorizedIntentPublisher` with signature `IntentBook__UnauthorizedIntentPublisher()` and selector `0x38b4c286`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(
        name = "IntentBook__UnauthorizedIntentPublisher",
        abi = "IntentBook__UnauthorizedIntentPublisher()"
    )]
    pub struct IntentBook__UnauthorizedIntentPublisher;
    ///Container type for all of the contract's custom errors
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum intentBookErrors {
        IntentBook__CannotCancelNonOpenIntent(IntentBook__CannotCancelNonOpenIntent),
        IntentBook__CannotLockIntentThatIsNotOpen(IntentBook__CannotLockIntentThatIsNotOpen),
        IntentBook__CannotSpendIntentThatIsNotOpen(IntentBook__CannotSpendIntentThatIsNotOpen),
        IntentBook__IntentAlreadyExists(IntentBook__IntentAlreadyExists),
        IntentBook__IntentExpired(IntentBook__IntentExpired),
        IntentBook__IntentNotFound(IntentBook__IntentNotFound),
        IntentBook__IntentNotSpendable(IntentBook__IntentNotSpendable),
        IntentBook__InvalidIntentAuthor(IntentBook__InvalidIntentAuthor),
        IntentBook__InvalidIntentNonce(IntentBook__InvalidIntentNonce),
        IntentBook__InvalidSignature(IntentBook__InvalidSignature),
        IntentBook__UnauthorizedCancellationAttempt(IntentBook__UnauthorizedCancellationAttempt),
        IntentBook__UnauthorizedIntentPublisher(IntentBook__UnauthorizedIntentPublisher),
        /// The standard solidity revert string, with selector
        /// Error(string) -- 0x08c379a0
        RevertString(::std::string::String),
    }
    impl ::ethers::core::abi::AbiDecode for intentBookErrors {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) =
                <::std::string::String as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::RevertString(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__CannotCancelNonOpenIntent as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                )
            {
                return Ok(Self::IntentBook__CannotCancelNonOpenIntent(decoded));
            }
            if let Ok(decoded) = <IntentBook__CannotLockIntentThatIsNotOpen as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::IntentBook__CannotLockIntentThatIsNotOpen(decoded));
            }
            if let Ok(decoded) = <IntentBook__CannotSpendIntentThatIsNotOpen as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::IntentBook__CannotSpendIntentThatIsNotOpen(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__IntentAlreadyExists as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__IntentAlreadyExists(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__IntentExpired as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__IntentExpired(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__IntentNotFound as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__IntentNotFound(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__IntentNotSpendable as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__IntentNotSpendable(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__InvalidIntentAuthor as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__InvalidIntentAuthor(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__InvalidIntentNonce as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__InvalidIntentNonce(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__InvalidSignature as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentBook__InvalidSignature(decoded));
            }
            if let Ok(decoded) = <IntentBook__UnauthorizedCancellationAttempt as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::IntentBook__UnauthorizedCancellationAttempt(decoded));
            }
            if let Ok(decoded) =
                <IntentBook__UnauthorizedIntentPublisher as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                )
            {
                return Ok(Self::IntentBook__UnauthorizedIntentPublisher(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for intentBookErrors {
        fn encode(self) -> ::std::vec::Vec<u8> {
            match self {
                Self::IntentBook__CannotCancelNonOpenIntent(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__CannotLockIntentThatIsNotOpen(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__CannotSpendIntentThatIsNotOpen(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__IntentAlreadyExists(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__IntentExpired(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__IntentNotFound(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__IntentNotSpendable(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__InvalidIntentAuthor(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__InvalidIntentNonce(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__InvalidSignature(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__UnauthorizedCancellationAttempt(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IntentBook__UnauthorizedIntentPublisher(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RevertString(s) => ::ethers::core::abi::AbiEncode::encode(s),
            }
        }
    }
    impl ::ethers::contract::ContractRevert for intentBookErrors {
        fn valid_selector(selector: [u8; 4]) -> bool {
            match selector {
                [0x08, 0xc3, 0x79, 0xa0] => true,
                _ if selector
                    == <IntentBook__CannotCancelNonOpenIntent as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__CannotLockIntentThatIsNotOpen as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__CannotSpendIntentThatIsNotOpen as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__IntentAlreadyExists as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__IntentExpired as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__IntentNotFound as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__IntentNotSpendable as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__InvalidIntentAuthor as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__InvalidIntentNonce as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__InvalidSignature as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__UnauthorizedCancellationAttempt as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <IntentBook__UnauthorizedIntentPublisher as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ => false,
            }
        }
    }
    impl ::core::fmt::Display for intentBookErrors {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::IntentBook__CannotCancelNonOpenIntent(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__CannotLockIntentThatIsNotOpen(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__CannotSpendIntentThatIsNotOpen(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__IntentAlreadyExists(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__IntentExpired(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentBook__IntentNotFound(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentBook__IntentNotSpendable(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__InvalidIntentAuthor(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__InvalidIntentNonce(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__InvalidSignature(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__UnauthorizedCancellationAttempt(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentBook__UnauthorizedIntentPublisher(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::RevertString(s) => ::core::fmt::Display::fmt(s, f),
            }
        }
    }
    impl ::core::convert::From<::std::string::String> for intentBookErrors {
        fn from(value: String) -> Self {
            Self::RevertString(value)
        }
    }
    impl ::core::convert::From<IntentBook__CannotCancelNonOpenIntent> for intentBookErrors {
        fn from(value: IntentBook__CannotCancelNonOpenIntent) -> Self {
            Self::IntentBook__CannotCancelNonOpenIntent(value)
        }
    }
    impl ::core::convert::From<IntentBook__CannotLockIntentThatIsNotOpen> for intentBookErrors {
        fn from(value: IntentBook__CannotLockIntentThatIsNotOpen) -> Self {
            Self::IntentBook__CannotLockIntentThatIsNotOpen(value)
        }
    }
    impl ::core::convert::From<IntentBook__CannotSpendIntentThatIsNotOpen> for intentBookErrors {
        fn from(value: IntentBook__CannotSpendIntentThatIsNotOpen) -> Self {
            Self::IntentBook__CannotSpendIntentThatIsNotOpen(value)
        }
    }
    impl ::core::convert::From<IntentBook__IntentAlreadyExists> for intentBookErrors {
        fn from(value: IntentBook__IntentAlreadyExists) -> Self {
            Self::IntentBook__IntentAlreadyExists(value)
        }
    }
    impl ::core::convert::From<IntentBook__IntentExpired> for intentBookErrors {
        fn from(value: IntentBook__IntentExpired) -> Self {
            Self::IntentBook__IntentExpired(value)
        }
    }
    impl ::core::convert::From<IntentBook__IntentNotFound> for intentBookErrors {
        fn from(value: IntentBook__IntentNotFound) -> Self {
            Self::IntentBook__IntentNotFound(value)
        }
    }
    impl ::core::convert::From<IntentBook__IntentNotSpendable> for intentBookErrors {
        fn from(value: IntentBook__IntentNotSpendable) -> Self {
            Self::IntentBook__IntentNotSpendable(value)
        }
    }
    impl ::core::convert::From<IntentBook__InvalidIntentAuthor> for intentBookErrors {
        fn from(value: IntentBook__InvalidIntentAuthor) -> Self {
            Self::IntentBook__InvalidIntentAuthor(value)
        }
    }
    impl ::core::convert::From<IntentBook__InvalidIntentNonce> for intentBookErrors {
        fn from(value: IntentBook__InvalidIntentNonce) -> Self {
            Self::IntentBook__InvalidIntentNonce(value)
        }
    }
    impl ::core::convert::From<IntentBook__InvalidSignature> for intentBookErrors {
        fn from(value: IntentBook__InvalidSignature) -> Self {
            Self::IntentBook__InvalidSignature(value)
        }
    }
    impl ::core::convert::From<IntentBook__UnauthorizedCancellationAttempt> for intentBookErrors {
        fn from(value: IntentBook__UnauthorizedCancellationAttempt) -> Self {
            Self::IntentBook__UnauthorizedCancellationAttempt(value)
        }
    }
    impl ::core::convert::From<IntentBook__UnauthorizedIntentPublisher> for intentBookErrors {
        fn from(value: IntentBook__UnauthorizedIntentPublisher) -> Self {
            Self::IntentBook__UnauthorizedIntentPublisher(value)
        }
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
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
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(
        name = "IntentCreated",
        abi = "IntentCreated(bytes32,address,address,uint256,address[],uint256[],uint8,uint8)"
    )]
    pub struct IntentCreatedFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
        #[ethevent(indexed)]
        pub author: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub src_m_token: ::ethers::core::types::Address,
        pub src_amount: ::ethers::core::types::U256,
        pub m_tokens: ::std::vec::Vec<::ethers::core::types::Address>,
        pub m_amounts: ::std::vec::Vec<::ethers::core::types::U256>,
        pub outcome_asset_structure: u8,
        pub fill_structure: u8,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(name = "IntentLocked", abi = "IntentLocked(bytes32)")]
    pub struct IntentLockedFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(name = "IntentPublisherAdded", abi = "IntentPublisherAdded(address)")]
    pub struct IntentPublisherAddedFilter {
        #[ethevent(indexed)]
        pub publisher: ::ethers::core::types::Address,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(
        name = "IntentPublisherRevoked",
        abi = "IntentPublisherRevoked(address)"
    )]
    pub struct IntentPublisherRevokedFilter {
        #[ethevent(indexed)]
        pub publisher: ::ethers::core::types::Address,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(name = "IntentSolved", abi = "IntentSolved(bytes32)")]
    pub struct IntentSolvedFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethevent(
        name = "OwnershipTransferred",
        abi = "OwnershipTransferred(address,address)"
    )]
    pub struct OwnershipTransferredFilter {
        #[ethevent(indexed)]
        pub previous_owner: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub new_owner: ::ethers::core::types::Address,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum intentBookEvents {
        IntentCancelledFilter(IntentCancelledFilter),
        IntentCreatedFilter(IntentCreatedFilter),
        IntentLockedFilter(IntentLockedFilter),
        IntentPublisherAddedFilter(IntentPublisherAddedFilter),
        IntentPublisherRevokedFilter(IntentPublisherRevokedFilter),
        IntentSolvedFilter(IntentSolvedFilter),
        OwnershipTransferredFilter(OwnershipTransferredFilter),
    }
    impl ::ethers::contract::EthLogDecode for intentBookEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = IntentCancelledFilter::decode_log(log) {
                return Ok(intentBookEvents::IntentCancelledFilter(decoded));
            }
            if let Ok(decoded) = IntentCreatedFilter::decode_log(log) {
                return Ok(intentBookEvents::IntentCreatedFilter(decoded));
            }
            if let Ok(decoded) = IntentLockedFilter::decode_log(log) {
                return Ok(intentBookEvents::IntentLockedFilter(decoded));
            }
            if let Ok(decoded) = IntentPublisherAddedFilter::decode_log(log) {
                return Ok(intentBookEvents::IntentPublisherAddedFilter(decoded));
            }
            if let Ok(decoded) = IntentPublisherRevokedFilter::decode_log(log) {
                return Ok(intentBookEvents::IntentPublisherRevokedFilter(decoded));
            }
            if let Ok(decoded) = IntentSolvedFilter::decode_log(log) {
                return Ok(intentBookEvents::IntentSolvedFilter(decoded));
            }
            if let Ok(decoded) = OwnershipTransferredFilter::decode_log(log) {
                return Ok(intentBookEvents::OwnershipTransferredFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for intentBookEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::IntentCancelledFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentCreatedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentLockedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentPublisherAddedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentPublisherRevokedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::IntentSolvedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::OwnershipTransferredFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<IntentCancelledFilter> for intentBookEvents {
        fn from(value: IntentCancelledFilter) -> Self {
            Self::IntentCancelledFilter(value)
        }
    }
    impl ::core::convert::From<IntentCreatedFilter> for intentBookEvents {
        fn from(value: IntentCreatedFilter) -> Self {
            Self::IntentCreatedFilter(value)
        }
    }
    impl ::core::convert::From<IntentLockedFilter> for intentBookEvents {
        fn from(value: IntentLockedFilter) -> Self {
            Self::IntentLockedFilter(value)
        }
    }
    impl ::core::convert::From<IntentPublisherAddedFilter> for intentBookEvents {
        fn from(value: IntentPublisherAddedFilter) -> Self {
            Self::IntentPublisherAddedFilter(value)
        }
    }
    impl ::core::convert::From<IntentPublisherRevokedFilter> for intentBookEvents {
        fn from(value: IntentPublisherRevokedFilter) -> Self {
            Self::IntentPublisherRevokedFilter(value)
        }
    }
    impl ::core::convert::From<IntentSolvedFilter> for intentBookEvents {
        fn from(value: IntentSolvedFilter) -> Self {
            Self::IntentSolvedFilter(value)
        }
    }
    impl ::core::convert::From<OwnershipTransferredFilter> for intentBookEvents {
        fn from(value: OwnershipTransferredFilter) -> Self {
            Self::OwnershipTransferredFilter(value)
        }
    }
    ///Container type for all input parameters for the `addPublisher` function with signature `addPublisher(address)` and selector `0x763f323d`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "addPublisher", abi = "addPublisher(address)")]
    pub struct AddPublisherCall {
        pub new_publisher: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `addSolver` function with signature `addSolver(address)` and selector `0xec58f4b8`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "addSolver", abi = "addSolver(address)")]
    pub struct AddSolverCall {
        pub new_solver: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `cancelIntent` function with signature `cancelIntent(bytes32)` and selector `0xd55f960d`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
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
    ///Container type for all input parameters for the `checkIntentValidToSpend` function with signature `checkIntentValidToSpend(((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes))` and selector `0xcdcef587`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "checkIntentValidToSpend",
        abi = "checkIntentValidToSpend(((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes))"
    )]
    pub struct CheckIntentValidToSpendCall {
        pub signed_intent: SignedIntent,
    }
    ///Container type for all input parameters for the `getIntent` function with signature `getIntent(bytes32)` and selector `0xf13c46aa`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getIntent", abi = "getIntent(bytes32)")]
    pub struct GetIntentCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getIntentChainRoot` function with signature `getIntentChainRoot(bytes32)` and selector `0x00dce513`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getIntentChainRoot", abi = "getIntentChainRoot(bytes32)")]
    pub struct GetIntentChainRootCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getIntentId` function with signature `getIntentId((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)))` and selector `0x8982c74a`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "getIntentId",
        abi = "getIntentId((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)))"
    )]
    pub struct GetIntentIdCall {
        pub intent: Intent,
    }
    ///Container type for all input parameters for the `getIntentIdsByAuthor` function with signature `getIntentIdsByAuthor(address)` and selector `0x6dc632f0`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getIntentIdsByAuthor", abi = "getIntentIdsByAuthor(address)")]
    pub struct GetIntentIdsByAuthorCall {
        pub author: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `getIntentState` function with signature `getIntentState(bytes32)` and selector `0xb4257b9a`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getIntentState", abi = "getIntentState(bytes32)")]
    pub struct GetIntentStateCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getNonce` function with signature `getNonce(address)` and selector `0x2d0335ab`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getNonce", abi = "getNonce(address)")]
    pub struct GetNonceWithUserCall {
        pub user: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `getNonce` function with signature `getNonce()` and selector `0xd087d288`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getNonce", abi = "getNonce()")]
    pub struct GetNonceCall;
    ///Container type for all input parameters for the `getReceiptManager` function with signature `getReceiptManager()` and selector `0x14e03208`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getReceiptManager", abi = "getReceiptManager()")]
    pub struct GetReceiptManagerCall;
    ///Container type for all input parameters for the `getSignedIntent` function with signature `getSignedIntent(bytes32)` and selector `0x3c9d9398`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getSignedIntent", abi = "getSignedIntent(bytes32)")]
    pub struct GetSignedIntentCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getTokenManager` function with signature `getTokenManager()` and selector `0xab97d59d`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getTokenManager", abi = "getTokenManager()")]
    pub struct GetTokenManagerCall;
    ///Container type for all input parameters for the `isSolver` function with signature `isSolver(address)` and selector `0x02cc250d`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "isSolver", abi = "isSolver(address)")]
    pub struct IsSolverCall {
        pub solver: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `lockIntent` function with signature `lockIntent(bytes32)` and selector `0xdc94809a`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "lockIntent", abi = "lockIntent(bytes32)")]
    pub struct LockIntentCall {
        pub intent_id: [u8; 32],
    }
    ///Container type for all input parameters for the `lockIntents` function with signature `lockIntents(bytes32[])` and selector `0xf568559e`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "lockIntents", abi = "lockIntents(bytes32[])")]
    pub struct LockIntentsCall {
        pub intent_ids: ::std::vec::Vec<[u8; 32]>,
    }
    ///Container type for all input parameters for the `owner` function with signature `owner()` and selector `0x8da5cb5b`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "owner", abi = "owner()")]
    pub struct OwnerCall;
    ///Container type for all input parameters for the `publishIntent` function with signature `publishIntent(((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes))` and selector `0x3ce30eba`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "publishIntent",
        abi = "publishIntent(((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes))"
    )]
    pub struct PublishIntentCall {
        pub signed_intent: SignedIntent,
    }
    ///Container type for all input parameters for the `removePublisher` function with signature `removePublisher(address)` and selector `0xae61c5ae`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "removePublisher", abi = "removePublisher(address)")]
    pub struct RemovePublisherCall {
        pub publisher: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `removeSolver` function with signature `removeSolver(address)` and selector `0x8fd57b92`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "removeSolver", abi = "removeSolver(address)")]
    pub struct RemoveSolverCall {
        pub new_solver: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `renounceOwnership` function with signature `renounceOwnership()` and selector `0x715018a6`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "renounceOwnership", abi = "renounceOwnership()")]
    pub struct RenounceOwnershipCall;
    ///Container type for all input parameters for the `setReceiptManager` function with signature `setReceiptManager(address)` and selector `0x2ff71a69`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "setReceiptManager", abi = "setReceiptManager(address)")]
    pub struct SetReceiptManagerCall {
        pub receipt_manager: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `setTokenManager` function with signature `setTokenManager(address)` and selector `0x7cb2b79c`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "setTokenManager", abi = "setTokenManager(address)")]
    pub struct SetTokenManagerCall {
        pub token_manager: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `solve` function with signature `solve((bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[]))` and selector `0x2ad75ab1`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "solve",
        abi = "solve((bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[]))"
    )]
    pub struct SolveCall {
        pub solution: Solution,
    }
    ///Container type for all input parameters for the `transferOwnership` function with signature `transferOwnership(address)` and selector `0xf2fde38b`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "transferOwnership", abi = "transferOwnership(address)")]
    pub struct TransferOwnershipCall {
        pub new_owner: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `validateSolutionInputs` function with signature `validateSolutionInputs((bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[]))` and selector `0xcc902109`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "validateSolutionInputs",
        abi = "validateSolutionInputs((bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[]))"
    )]
    pub struct ValidateSolutionInputsCall {
        pub solution: Solution,
    }
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum intentBookCalls {
        AddPublisher(AddPublisherCall),
        AddSolver(AddSolverCall),
        CancelIntent(CancelIntentCall),
        CheckIntentValidToSpend(CheckIntentValidToSpendCall),
        GetIntent(GetIntentCall),
        GetIntentChainRoot(GetIntentChainRootCall),
        GetIntentId(GetIntentIdCall),
        GetIntentIdsByAuthor(GetIntentIdsByAuthorCall),
        GetIntentState(GetIntentStateCall),
        GetNonceWithUser(GetNonceWithUserCall),
        GetNonce(GetNonceCall),
        GetReceiptManager(GetReceiptManagerCall),
        GetSignedIntent(GetSignedIntentCall),
        GetTokenManager(GetTokenManagerCall),
        IsSolver(IsSolverCall),
        LockIntent(LockIntentCall),
        LockIntents(LockIntentsCall),
        Owner(OwnerCall),
        PublishIntent(PublishIntentCall),
        RemovePublisher(RemovePublisherCall),
        RemoveSolver(RemoveSolverCall),
        RenounceOwnership(RenounceOwnershipCall),
        SetReceiptManager(SetReceiptManagerCall),
        SetTokenManager(SetTokenManagerCall),
        Solve(SolveCall),
        TransferOwnership(TransferOwnershipCall),
        ValidateSolutionInputs(ValidateSolutionInputsCall),
    }
    impl ::ethers::core::abi::AbiDecode for intentBookCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <AddPublisherCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::AddPublisher(decoded));
            }
            if let Ok(decoded) = <AddSolverCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::AddSolver(decoded));
            }
            if let Ok(decoded) = <CancelIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::CancelIntent(decoded));
            }
            if let Ok(decoded) =
                <CheckIntentValidToSpendCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::CheckIntentValidToSpend(decoded));
            }
            if let Ok(decoded) = <GetIntentCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetIntent(decoded));
            }
            if let Ok(decoded) =
                <GetIntentChainRootCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetIntentChainRoot(decoded));
            }
            if let Ok(decoded) = <GetIntentIdCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetIntentId(decoded));
            }
            if let Ok(decoded) =
                <GetIntentIdsByAuthorCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetIntentIdsByAuthor(decoded));
            }
            if let Ok(decoded) =
                <GetIntentStateCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetIntentState(decoded));
            }
            if let Ok(decoded) =
                <GetNonceWithUserCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetNonceWithUser(decoded));
            }
            if let Ok(decoded) = <GetNonceCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetNonce(decoded));
            }
            if let Ok(decoded) =
                <GetReceiptManagerCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetReceiptManager(decoded));
            }
            if let Ok(decoded) =
                <GetSignedIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetSignedIntent(decoded));
            }
            if let Ok(decoded) =
                <GetTokenManagerCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetTokenManager(decoded));
            }
            if let Ok(decoded) = <IsSolverCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::IsSolver(decoded));
            }
            if let Ok(decoded) = <LockIntentCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::LockIntent(decoded));
            }
            if let Ok(decoded) = <LockIntentsCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::LockIntents(decoded));
            }
            if let Ok(decoded) = <OwnerCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Owner(decoded));
            }
            if let Ok(decoded) = <PublishIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::PublishIntent(decoded));
            }
            if let Ok(decoded) =
                <RemovePublisherCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::RemovePublisher(decoded));
            }
            if let Ok(decoded) = <RemoveSolverCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::RemoveSolver(decoded));
            }
            if let Ok(decoded) =
                <RenounceOwnershipCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::RenounceOwnership(decoded));
            }
            if let Ok(decoded) =
                <SetReceiptManagerCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetReceiptManager(decoded));
            }
            if let Ok(decoded) =
                <SetTokenManagerCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetTokenManager(decoded));
            }
            if let Ok(decoded) = <SolveCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Solve(decoded));
            }
            if let Ok(decoded) =
                <TransferOwnershipCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::TransferOwnership(decoded));
            }
            if let Ok(decoded) =
                <ValidateSolutionInputsCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::ValidateSolutionInputs(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for intentBookCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::AddPublisher(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::AddSolver(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CancelIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CheckIntentValidToSpend(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetIntentChainRoot(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetIntentId(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetIntentIdsByAuthor(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetIntentState(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetNonceWithUser(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetNonce(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetReceiptManager(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetSignedIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetTokenManager(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsSolver(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::LockIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::LockIntents(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Owner(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::PublishIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RemovePublisher(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RemoveSolver(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RenounceOwnership(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetReceiptManager(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetTokenManager(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Solve(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::TransferOwnership(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ValidateSolutionInputs(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for intentBookCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::AddPublisher(element) => ::core::fmt::Display::fmt(element, f),
                Self::AddSolver(element) => ::core::fmt::Display::fmt(element, f),
                Self::CancelIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::CheckIntentValidToSpend(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetIntentChainRoot(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetIntentId(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetIntentIdsByAuthor(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetIntentState(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetNonceWithUser(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetNonce(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetReceiptManager(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetSignedIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetTokenManager(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsSolver(element) => ::core::fmt::Display::fmt(element, f),
                Self::LockIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::LockIntents(element) => ::core::fmt::Display::fmt(element, f),
                Self::Owner(element) => ::core::fmt::Display::fmt(element, f),
                Self::PublishIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::RemovePublisher(element) => ::core::fmt::Display::fmt(element, f),
                Self::RemoveSolver(element) => ::core::fmt::Display::fmt(element, f),
                Self::RenounceOwnership(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetReceiptManager(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetTokenManager(element) => ::core::fmt::Display::fmt(element, f),
                Self::Solve(element) => ::core::fmt::Display::fmt(element, f),
                Self::TransferOwnership(element) => ::core::fmt::Display::fmt(element, f),
                Self::ValidateSolutionInputs(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<AddPublisherCall> for intentBookCalls {
        fn from(value: AddPublisherCall) -> Self {
            Self::AddPublisher(value)
        }
    }
    impl ::core::convert::From<AddSolverCall> for intentBookCalls {
        fn from(value: AddSolverCall) -> Self {
            Self::AddSolver(value)
        }
    }
    impl ::core::convert::From<CancelIntentCall> for intentBookCalls {
        fn from(value: CancelIntentCall) -> Self {
            Self::CancelIntent(value)
        }
    }
    impl ::core::convert::From<CheckIntentValidToSpendCall> for intentBookCalls {
        fn from(value: CheckIntentValidToSpendCall) -> Self {
            Self::CheckIntentValidToSpend(value)
        }
    }
    impl ::core::convert::From<GetIntentCall> for intentBookCalls {
        fn from(value: GetIntentCall) -> Self {
            Self::GetIntent(value)
        }
    }
    impl ::core::convert::From<GetIntentChainRootCall> for intentBookCalls {
        fn from(value: GetIntentChainRootCall) -> Self {
            Self::GetIntentChainRoot(value)
        }
    }
    impl ::core::convert::From<GetIntentIdCall> for intentBookCalls {
        fn from(value: GetIntentIdCall) -> Self {
            Self::GetIntentId(value)
        }
    }
    impl ::core::convert::From<GetIntentIdsByAuthorCall> for intentBookCalls {
        fn from(value: GetIntentIdsByAuthorCall) -> Self {
            Self::GetIntentIdsByAuthor(value)
        }
    }
    impl ::core::convert::From<GetIntentStateCall> for intentBookCalls {
        fn from(value: GetIntentStateCall) -> Self {
            Self::GetIntentState(value)
        }
    }
    impl ::core::convert::From<GetNonceWithUserCall> for intentBookCalls {
        fn from(value: GetNonceWithUserCall) -> Self {
            Self::GetNonceWithUser(value)
        }
    }
    impl ::core::convert::From<GetNonceCall> for intentBookCalls {
        fn from(value: GetNonceCall) -> Self {
            Self::GetNonce(value)
        }
    }
    impl ::core::convert::From<GetReceiptManagerCall> for intentBookCalls {
        fn from(value: GetReceiptManagerCall) -> Self {
            Self::GetReceiptManager(value)
        }
    }
    impl ::core::convert::From<GetSignedIntentCall> for intentBookCalls {
        fn from(value: GetSignedIntentCall) -> Self {
            Self::GetSignedIntent(value)
        }
    }
    impl ::core::convert::From<GetTokenManagerCall> for intentBookCalls {
        fn from(value: GetTokenManagerCall) -> Self {
            Self::GetTokenManager(value)
        }
    }
    impl ::core::convert::From<IsSolverCall> for intentBookCalls {
        fn from(value: IsSolverCall) -> Self {
            Self::IsSolver(value)
        }
    }
    impl ::core::convert::From<LockIntentCall> for intentBookCalls {
        fn from(value: LockIntentCall) -> Self {
            Self::LockIntent(value)
        }
    }
    impl ::core::convert::From<LockIntentsCall> for intentBookCalls {
        fn from(value: LockIntentsCall) -> Self {
            Self::LockIntents(value)
        }
    }
    impl ::core::convert::From<OwnerCall> for intentBookCalls {
        fn from(value: OwnerCall) -> Self {
            Self::Owner(value)
        }
    }
    impl ::core::convert::From<PublishIntentCall> for intentBookCalls {
        fn from(value: PublishIntentCall) -> Self {
            Self::PublishIntent(value)
        }
    }
    impl ::core::convert::From<RemovePublisherCall> for intentBookCalls {
        fn from(value: RemovePublisherCall) -> Self {
            Self::RemovePublisher(value)
        }
    }
    impl ::core::convert::From<RemoveSolverCall> for intentBookCalls {
        fn from(value: RemoveSolverCall) -> Self {
            Self::RemoveSolver(value)
        }
    }
    impl ::core::convert::From<RenounceOwnershipCall> for intentBookCalls {
        fn from(value: RenounceOwnershipCall) -> Self {
            Self::RenounceOwnership(value)
        }
    }
    impl ::core::convert::From<SetReceiptManagerCall> for intentBookCalls {
        fn from(value: SetReceiptManagerCall) -> Self {
            Self::SetReceiptManager(value)
        }
    }
    impl ::core::convert::From<SetTokenManagerCall> for intentBookCalls {
        fn from(value: SetTokenManagerCall) -> Self {
            Self::SetTokenManager(value)
        }
    }
    impl ::core::convert::From<SolveCall> for intentBookCalls {
        fn from(value: SolveCall) -> Self {
            Self::Solve(value)
        }
    }
    impl ::core::convert::From<TransferOwnershipCall> for intentBookCalls {
        fn from(value: TransferOwnershipCall) -> Self {
            Self::TransferOwnership(value)
        }
    }
    impl ::core::convert::From<ValidateSolutionInputsCall> for intentBookCalls {
        fn from(value: ValidateSolutionInputsCall) -> Self {
            Self::ValidateSolutionInputs(value)
        }
    }
    ///Container type for all return fields from the `checkIntentValidToSpend` function with signature `checkIntentValidToSpend(((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes))` and selector `0xcdcef587`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct CheckIntentValidToSpendReturn(pub bool);
    ///Container type for all return fields from the `getIntent` function with signature `getIntent(bytes32)` and selector `0xf13c46aa`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetIntentReturn(pub Intent);
    ///Container type for all return fields from the `getIntentChainRoot` function with signature `getIntentChainRoot(bytes32)` and selector `0x00dce513`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetIntentChainRootReturn(pub [u8; 32]);
    ///Container type for all return fields from the `getIntentId` function with signature `getIntentId((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)))` and selector `0x8982c74a`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetIntentIdReturn(pub [u8; 32]);
    ///Container type for all return fields from the `getIntentIdsByAuthor` function with signature `getIntentIdsByAuthor(address)` and selector `0x6dc632f0`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetIntentIdsByAuthorReturn(pub ::std::vec::Vec<[u8; 32]>);
    ///Container type for all return fields from the `getIntentState` function with signature `getIntentState(bytes32)` and selector `0xb4257b9a`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetIntentStateReturn(pub u8);
    ///Container type for all return fields from the `getNonce` function with signature `getNonce(address)` and selector `0x2d0335ab`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetNonceWithUserReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getNonce` function with signature `getNonce()` and selector `0xd087d288`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetNonceReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getReceiptManager` function with signature `getReceiptManager()` and selector `0x14e03208`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetReceiptManagerReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `getSignedIntent` function with signature `getSignedIntent(bytes32)` and selector `0x3c9d9398`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetSignedIntentReturn(pub SignedIntent);
    ///Container type for all return fields from the `getTokenManager` function with signature `getTokenManager()` and selector `0xab97d59d`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetTokenManagerReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `isSolver` function with signature `isSolver(address)` and selector `0x02cc250d`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct IsSolverReturn(pub bool);
    ///Container type for all return fields from the `owner` function with signature `owner()` and selector `0x8da5cb5b`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct OwnerReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `publishIntent` function with signature `publishIntent(((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes))` and selector `0x3ce30eba`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct PublishIntentReturn(pub [u8; 32]);
    ///Container type for all return fields from the `solve` function with signature `solve((bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[]))` and selector `0x2ad75ab1`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct SolveReturn(pub [u8; 32]);
    ///Container type for all return fields from the `validateSolutionInputs` function with signature `validateSolutionInputs((bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[]))` and selector `0xcc902109`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct ValidateSolutionInputsReturn(pub ::std::vec::Vec<Intent>);
    ///`FillRecord(uint64,uint64,uint8)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct FillRecord {
        pub in_idx: u64,
        pub out_idx: u64,
        pub out_type: u8,
    }
    ///`Intent(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct Intent {
        pub author: ::ethers::core::types::Address,
        pub ttl: ::ethers::core::types::U256,
        pub nonce: ::ethers::core::types::U256,
        pub src_m_token: ::ethers::core::types::Address,
        pub src_amount: ::ethers::core::types::U256,
        pub outcome: Outcome,
    }
    ///`MoveRecord(uint64,(uint8,uint64),uint256)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct MoveRecord {
        pub src_idx: u64,
        pub output_idx: OutputIdx,
        pub qty: ::ethers::core::types::U256,
    }
    ///`Outcome(address[],uint256[],uint8,uint8)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct Outcome {
        pub m_tokens: ::std::vec::Vec<::ethers::core::types::Address>,
        pub m_amounts: ::std::vec::Vec<::ethers::core::types::U256>,
        pub outcome_asset_structure: u8,
        pub fill_structure: u8,
    }
    ///`OutputIdx(uint8,uint64)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct OutputIdx {
        pub out_type: u8,
        pub out_idx: u64,
    }
    ///`Receipt(address,uint256,address,bytes32)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct Receipt {
        pub m_token: ::ethers::core::types::Address,
        pub m_token_amount: ::ethers::core::types::U256,
        pub owner: ::ethers::core::types::Address,
        pub intent_hash: [u8; 32],
    }
    ///`SignedIntent((address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8)),bytes)`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct SignedIntent {
        pub intent: Intent,
        pub signature: ::ethers::core::types::Bytes,
    }
    ///`Solution(bytes32[],(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))[],(address,uint256,address,bytes32)[],(uint64,(uint8,uint64),uint256)[],(uint64,uint64,uint8)[])`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct Solution {
        pub intent_ids: ::std::vec::Vec<[u8; 32]>,
        pub intent_outputs: ::std::vec::Vec<Intent>,
        pub receipt_outputs: ::std::vec::Vec<Receipt>,
        pub spend_graph: ::std::vec::Vec<MoveRecord>,
        pub fill_graph: ::std::vec::Vec<FillRecord>,
    }
}

use ethers::types::{H160, U256};

impl From<medusa_types::Intent> for Intent {
    fn from(intent: medusa_types::Intent) -> Self {
        Self {
            author: H160(intent.author.0.0),
            ttl: U256(*intent.ttl.as_limbs()),
            nonce: U256(*intent.nonce.as_limbs()),
            src_m_token: H160(intent.src_m_token.0.0),
            src_amount: U256(*intent.src_amount.as_limbs()),
            outcome: intent.outcome.into(),
        }
    }
}

impl From<medusa_types::Outcome> for Outcome {
    fn from(outcome: medusa_types::Outcome) -> Self {
        Self {
            m_tokens: outcome.m_tokens.iter().map(|t| H160(t.0.0)).collect(),
            m_amounts: outcome
                .m_amounts
                .iter()
                .map(|a| U256(*a.as_limbs()))
                .collect(),
            outcome_asset_structure: outcome.outcome_asset_structure.into(),
            fill_structure: outcome.fill_structure.into(),
        }
    }
}

impl From<medusa_types::receipt::Receipt> for Receipt {
    fn from(receipt: medusa_types::receipt::Receipt) -> Self {
        Self {
            m_token: H160(receipt.m_token.0.0),
            m_token_amount: U256(*receipt.m_token_amount.as_limbs()),
            owner: H160(receipt.owner.0.0),
            intent_hash: receipt.intent_hash.0,
        }
    }
}

impl From<medusa_types::MoveRecord> for MoveRecord {
    fn from(record: medusa_types::MoveRecord) -> Self {
        Self {
            src_idx: record.src_idx,
            output_idx: record.output_idx.into(),
            qty: U256(*record.qty.as_limbs()),
        }
    }
}

impl From<medusa_types::OutputIdx> for OutputIdx {
    fn from(output_idx: medusa_types::OutputIdx) -> Self {
        Self {
            out_type: output_idx.out_type.into(),
            out_idx: output_idx.out_idx,
        }
    }
}

impl From<medusa_types::FillRecord> for FillRecord {
    fn from(record: medusa_types::FillRecord) -> Self {
        Self {
            in_idx: record.in_idx,
            out_idx: record.out_idx,
            out_type: record.out_type.into(),
        }
    }
}

impl From<medusa_types::Solution> for Solution {
    fn from(solution: medusa_types::Solution) -> Self {
        Self {
            intent_ids: solution.intent_ids.iter().map(|id| id.0).collect(),
            intent_outputs: solution
                .intent_outputs
                .into_iter()
                .map(|i| i.into())
                .collect(),
            receipt_outputs: solution
                .receipt_outputs
                .into_iter()
                .map(|r| r.into())
                .collect(),
            spend_graph: solution.spend_graph.into_iter().map(|r| r.into()).collect(),
            fill_graph: solution.fill_graph.into_iter().map(|r| r.into()).collect(),
        }
    }
}
