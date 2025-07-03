pub use gmp_intent_event_verifier::*;
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
pub mod gmp_intent_event_verifier {
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::None,
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("DEFAULT_ADMIN_ROLE"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("DEFAULT_ADMIN_ROLE"),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("addEventRegisterer"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("addEventRegisterer"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("eventRegisterer"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("address"),
                            ),
                        },],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getRoleAdmin"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("getRoleAdmin"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("role"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getRoleMember"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("getRoleMember"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("index"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Uint(256usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("uint256"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("address"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getRoleMemberCount"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("getRoleMemberCount"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("role"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Uint(256usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("uint256"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("grantRole"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("grantRole"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("account"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("handle"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("handle"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("_origin"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Uint(32usize),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("uint32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("_sender"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("_message"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("hasRole"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("hasRole"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("account"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bool"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("initialise"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("initialise"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("_proverChainDomain",),
                                kind: ::ethers::core::abi::ethabi::ParamType::Uint(32usize),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("uint32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("_mailbox"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("mailbox"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("mailbox"),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("address"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("provedEvents"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("provedEvents"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("eventHash"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bool"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("proverChainDomain"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("proverChainDomain"),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Uint(32usize),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("uint32"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("renounceRole"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("renounceRole"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("account"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("revokeRole"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("revokeRole"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("account"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("supportsInterface"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("supportsInterface"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("interfaceId"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(4usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes4"),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bool"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("verify"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("verify"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("eventHash"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes32"),
                            ),
                        },],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bool"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
            ]),
            events: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("NewEventRegistered"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("NewEventRegistered"),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("eventHash"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            indexed: true,
                        },],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("RoleAdminChanged"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("RoleAdminChanged"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("previousAdminRole"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("newAdminRole"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                        ],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("RoleGranted"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("RoleGranted"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("account"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("sender"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                indexed: true,
                            },
                        ],
                        anonymous: false,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("RoleRevoked"),
                    ::std::vec![::ethers::core::abi::ethabi::Event {
                        name: ::std::borrow::ToOwned::to_owned("RoleRevoked"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("role"),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("account"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                indexed: true,
                            },
                            ::ethers::core::abi::ethabi::EventParam {
                                name: ::std::borrow::ToOwned::to_owned("sender"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
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
    pub static GMPINTENTEVENTVERIFIER_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[Pa\0\x1C`\x003a\0!V[a\x01TV[a\0+\x82\x82a\0HV[`\0\x82\x81R`\x01` R`@\x90 a\0C\x90\x82a\0\xE7V[PPPV[`\0\x82\x81R` \x81\x81R`@\x80\x83 `\x01`\x01`\xA0\x1B\x03\x85\x16\x84R\x90\x91R\x90 T`\xFF\x16a\0\xE3W`\0\x82\x81R` \x81\x81R`@\x80\x83 `\x01`\x01`\xA0\x1B\x03\x85\x16\x84R\x90\x91R\x90 \x80T`\xFF\x19\x16`\x01\x17\x90Ua\0\xA23\x90V[`\x01`\x01`\xA0\x1B\x03\x16\x81`\x01`\x01`\xA0\x1B\x03\x16\x83\x7F/\x87\x88\x11~~\xFF\x1D\x82\xE9&\xECyI\x01\xD1|x\x02JP'\t@0E@\xA73eo\r`@Q`@Q\x80\x91\x03\x90\xA4[PPV[`\0a\0\xFC\x83`\x01`\x01`\xA0\x1B\x03\x84\x16a\x01\x05V[\x90P[\x92\x91PPV[`\0\x81\x81R`\x01\x83\x01` R`@\x81 Ta\x01LWP\x81T`\x01\x81\x81\x01\x84U`\0\x84\x81R` \x80\x82 \x90\x93\x01\x84\x90U\x84T\x84\x82R\x82\x86\x01\x90\x93R`@\x90 \x91\x90\x91Ua\0\xFFV[P`\0a\0\xFFV[a\r\xEB\x80a\x01c`\09`\0\xF3\xFE`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\x01\0W`\x005`\xE0\x1C\x80c\x90\x10\xD0|\x11a\0\x97W\x80c\xCA\x15\xC8s\x11a\0fW\x80c\xCA\x15\xC8s\x14a\x02]W\x80c\xD5C\x8E\xAE\x14a\x02pW\x80c\xD5Gt\x1F\x14a\x02\x8BW\x80c\xD6\xA1\x87\xB6\x14a\x02\x9EW`\0\x80\xFD[\x80c\x90\x10\xD0|\x14a\x01\xF4W\x80c\x91\xD1HT\x14a\x02\x1FW\x80c\xA2\x17\xFD\xDF\x14a\x022W\x80c\xADUY>\x14a\x02:W`\0\x80\xFD[\x80c6V\x8A\xBE\x11a\0\xD3W\x80c6V\x8A\xBE\x14a\x01\x98W\x80cV\xD5\xD4u\x14a\x01\xABW\x80co\xF3\xFE\x95\x14a\x01\xBEW\x80cu\xE3f\x16\x14a\x01\xD1W`\0\x80\xFD[\x80c\x01\xFF\xC9\xA7\x14a\x01\x05W\x80c$\x8A\x9C\xA3\x14a\x01-W\x80c&2\xBB\x8D\x14a\x01^W\x80c//\xF1]\x14a\x01\x83W[`\0\x80\xFD[a\x01\x18a\x01\x136`\x04a\n\xD9V[a\x02\xB1V[`@Q\x90\x15\x15\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\x01Pa\x01;6`\x04a\x0B\x03V[`\0\x90\x81R` \x81\x90R`@\x90 `\x01\x01T\x90V[`@Q\x90\x81R` \x01a\x01$V[`\x02Ta\x01n\x90c\xFF\xFF\xFF\xFF\x16\x81V[`@Qc\xFF\xFF\xFF\xFF\x90\x91\x16\x81R` \x01a\x01$V[a\x01\x96a\x01\x916`\x04a\x0B8V[a\x02\xDCV[\0[a\x01\x96a\x01\xA66`\x04a\x0B8V[a\x03\x06V[a\x01\x96a\x01\xB96`\x04a\x0BxV[a\x03\x89V[a\x01\x96a\x01\xCC6`\x04a\x0B\xFFV[a\x04}V[a\x01\x18a\x01\xDF6`\x04a\x0B\x03V[`\0\x90\x81R`\x03` R`@\x90 T`\xFF\x16\x90V[a\x02\x07a\x02\x026`\x04a\x0C\x1AV[a\x04\xB5V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01a\x01$V[a\x01\x18a\x02-6`\x04a\x0B8V[a\x04\xD4V[a\x01P`\0\x81V[a\x01\x18a\x02H6`\x04a\x0B\x03V[`\x03` R`\0\x90\x81R`@\x90 T`\xFF\x16\x81V[a\x01Pa\x02k6`\x04a\x0B\x03V[a\x04\xFDV[`\x02Ta\x02\x07\x90d\x01\0\0\0\0\x90\x04`\x01`\x01`\xA0\x1B\x03\x16\x81V[a\x01\x96a\x02\x996`\x04a\x0B8V[a\x05\x14V[a\x01\x96a\x02\xAC6`\x04a\x0C<V[a\x059V[`\0`\x01`\x01`\xE0\x1B\x03\x19\x82\x16cZ\x05\x18\x0F`\xE0\x1B\x14\x80a\x02\xD6WPa\x02\xD6\x82a\x05wV[\x92\x91PPV[`\0\x82\x81R` \x81\x90R`@\x90 `\x01\x01Ta\x02\xF7\x81a\x05\xACV[a\x03\x01\x83\x83a\x05\xB6V[PPPV[`\x01`\x01`\xA0\x1B\x03\x81\x163\x14a\x03{W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`/`$\x82\x01R\x7FAccessControl: can only renounce`D\x82\x01Rn\x1097\xB62\xB9\x9037\xB9\x109\xB2\xB63`\x89\x1B`d\x82\x01R`\x84\x01[`@Q\x80\x91\x03\x90\xFD[a\x03\x85\x82\x82a\x05\xD8V[PPV[`\x02Td\x01\0\0\0\0\x90\x04`\x01`\x01`\xA0\x1B\x03\x163`\x01`\x01`\xA0\x1B\x03\x16\x14a\x03\xE6W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x0F`$\x82\x01Rn\r-\xCE\xCC-\x8D,\x84\r\xAC--\x8CM\xEF`\x8B\x1B`D\x82\x01R`d\x01a\x03rV[`\x02Tc\xFF\xFF\xFF\xFF\x85\x81\x16\x91\x16\x14a\x043W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x10`$\x82\x01Ro\x1A[\x9D\x98[\x1AY\x08\x18\xDA\x18Z[\x88\x1AY`\x82\x1B`D\x82\x01R`d\x01a\x03rV[a\x04]\x7F\x13\t\x10=\x1D\xD9\xD9$$I\n\xBF\x1CA\xCE\xF2\x02\xD9E\x9E\x99\x9A7\xBA\xDD\xF4$5\x0BH+$\x84a\x05\xFAV[`\0a\x04k\x82\x84\x01\x84a\x0B\x03V[\x90Pa\x04v\x81a\x06SV[PPPPPV[a\x04\x88`\x003a\x05\xFAV[a\x04\xB2\x7F\x13\t\x10=\x1D\xD9\xD9$$I\n\xBF\x1CA\xCE\xF2\x02\xD9E\x9E\x99\x9A7\xBA\xDD\xF4$5\x0BH+$\x82a\x05\xB6V[PV[`\0\x82\x81R`\x01` R`@\x81 a\x04\xCD\x90\x83a\x06\x96V[\x93\x92PPPV[`\0\x91\x82R` \x82\x81R`@\x80\x84 `\x01`\x01`\xA0\x1B\x03\x93\x90\x93\x16\x84R\x91\x90R\x90 T`\xFF\x16\x90V[`\0\x81\x81R`\x01` R`@\x81 a\x02\xD6\x90a\x06\xA2V[`\0\x82\x81R` \x81\x90R`@\x90 `\x01\x01Ta\x05/\x81a\x05\xACV[a\x03\x01\x83\x83a\x05\xD8V[a\x05D`\x003a\x05\xB6V[`\x02\x80T`\x01`\x01`\xA0\x1B\x03\x90\x92\x16d\x01\0\0\0\0\x02`\x01`\x01`\xC0\x1B\x03\x19\x90\x92\x16c\xFF\xFF\xFF\xFF\x90\x93\x16\x92\x90\x92\x17\x17\x90UV[`\0`\x01`\x01`\xE0\x1B\x03\x19\x82\x16cye\xDB\x0B`\xE0\x1B\x14\x80a\x02\xD6WPc\x01\xFF\xC9\xA7`\xE0\x1B`\x01`\x01`\xE0\x1B\x03\x19\x83\x16\x14a\x02\xD6V[a\x04\xB2\x813a\x05\xFAV[a\x05\xC0\x82\x82a\x06\xACV[`\0\x82\x81R`\x01` R`@\x90 a\x03\x01\x90\x82a\x070V[a\x05\xE2\x82\x82a\x07EV[`\0\x82\x81R`\x01` R`@\x90 a\x03\x01\x90\x82a\x07\xAAV[a\x06\x04\x82\x82a\x04\xD4V[a\x03\x85Wa\x06\x11\x81a\x07\xBFV[a\x06\x1C\x83` a\x07\xD1V[`@Q` \x01a\x06-\x92\x91\x90a\x0C\x8AV[`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x90\x82\x90RbF\x1B\xCD`\xE5\x1B\x82Ra\x03r\x91`\x04\x01a\x0C\xFFV[`\0\x81\x81R`\x03` R`@\x80\x82 \x80T`\xFF\x19\x16`\x01\x17\x90UQ\x82\x91\x7F\xDD\xC5\xDC23\x1C\x1DE\xC7\xA1\x0E\xD7n\x8C\x0B\xAE\xB2:\x18\xCCOK\xE7\xDA\x0Ch:9\x7F\xFB\xF30\x91\xA2PV[`\0a\x04\xCD\x83\x83a\tmV[`\0a\x02\xD6\x82T\x90V[a\x06\xB6\x82\x82a\x04\xD4V[a\x03\x85W`\0\x82\x81R` \x81\x81R`@\x80\x83 `\x01`\x01`\xA0\x1B\x03\x85\x16\x84R\x90\x91R\x90 \x80T`\xFF\x19\x16`\x01\x17\x90Ua\x06\xEC3\x90V[`\x01`\x01`\xA0\x1B\x03\x16\x81`\x01`\x01`\xA0\x1B\x03\x16\x83\x7F/\x87\x88\x11~~\xFF\x1D\x82\xE9&\xECyI\x01\xD1|x\x02JP'\t@0E@\xA73eo\r`@Q`@Q\x80\x91\x03\x90\xA4PPV[`\0a\x04\xCD\x83`\x01`\x01`\xA0\x1B\x03\x84\x16a\t\x97V[a\x07O\x82\x82a\x04\xD4V[\x15a\x03\x85W`\0\x82\x81R` \x81\x81R`@\x80\x83 `\x01`\x01`\xA0\x1B\x03\x85\x16\x80\x85R\x92R\x80\x83 \x80T`\xFF\x19\x16\x90UQ3\x92\x85\x91\x7F\xF69\x1F\\2\xD9\xC6\x9D*G\xEAg\x0BD)t\xB595\xD1\xED\xC7\xFDd\xEB!\xE0G\xA89\x17\x1B\x91\x90\xA4PPV[`\0a\x04\xCD\x83`\x01`\x01`\xA0\x1B\x03\x84\x16a\t\xE6V[``a\x02\xD6`\x01`\x01`\xA0\x1B\x03\x83\x16`\x14[```\0a\x07\xE0\x83`\x02a\rHV[a\x07\xEB\x90`\x02a\r_V[g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x15a\x08\x03Wa\x08\x03a\rrV[`@Q\x90\x80\x82R\x80`\x1F\x01`\x1F\x19\x16` \x01\x82\x01`@R\x80\x15a\x08-W` \x82\x01\x81\x806\x837\x01\x90P[P\x90P`\x03`\xFC\x1B\x81`\0\x81Q\x81\x10a\x08HWa\x08Ha\r\x88V[` \x01\x01\x90`\x01`\x01`\xF8\x1B\x03\x19\x16\x90\x81`\0\x1A\x90SP`\x0F`\xFB\x1B\x81`\x01\x81Q\x81\x10a\x08wWa\x08wa\r\x88V[` \x01\x01\x90`\x01`\x01`\xF8\x1B\x03\x19\x16\x90\x81`\0\x1A\x90SP`\0a\x08\x9B\x84`\x02a\rHV[a\x08\xA6\x90`\x01a\r_V[\x90P[`\x01\x81\x11\x15a\t\x1EWo\x18\x18\x99\x19\x9A\x1A\x9B\x1B\x9C\x1C\xB0\xB11\xB22\xB3`\x81\x1B\x85`\x0F\x16`\x10\x81\x10a\x08\xDAWa\x08\xDAa\r\x88V[\x1A`\xF8\x1B\x82\x82\x81Q\x81\x10a\x08\xF0Wa\x08\xF0a\r\x88V[` \x01\x01\x90`\x01`\x01`\xF8\x1B\x03\x19\x16\x90\x81`\0\x1A\x90SP`\x04\x94\x90\x94\x1C\x93a\t\x17\x81a\r\x9EV[\x90Pa\x08\xA9V[P\x83\x15a\x04\xCDW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01\x81\x90R`$\x82\x01R\x7FStrings: hex length insufficient`D\x82\x01R`d\x01a\x03rV[`\0\x82`\0\x01\x82\x81T\x81\x10a\t\x84Wa\t\x84a\r\x88V[\x90`\0R` `\0 \x01T\x90P\x92\x91PPV[`\0\x81\x81R`\x01\x83\x01` R`@\x81 Ta\t\xDEWP\x81T`\x01\x81\x81\x01\x84U`\0\x84\x81R` \x80\x82 \x90\x93\x01\x84\x90U\x84T\x84\x82R\x82\x86\x01\x90\x93R`@\x90 \x91\x90\x91Ua\x02\xD6V[P`\0a\x02\xD6V[`\0\x81\x81R`\x01\x83\x01` R`@\x81 T\x80\x15a\n\xCFW`\0a\n\n`\x01\x83a\r\xB5V[\x85T\x90\x91P`\0\x90a\n\x1E\x90`\x01\x90a\r\xB5V[\x90P\x81\x81\x14a\n\x83W`\0\x86`\0\x01\x82\x81T\x81\x10a\n>Wa\n>a\r\x88V[\x90`\0R` `\0 \x01T\x90P\x80\x87`\0\x01\x84\x81T\x81\x10a\naWa\naa\r\x88V[`\0\x91\x82R` \x80\x83 \x90\x91\x01\x92\x90\x92U\x91\x82R`\x01\x88\x01\x90R`@\x90 \x83\x90U[\x85T\x86\x90\x80a\n\x94Wa\n\x94a\r\xC8V[`\x01\x90\x03\x81\x81\x90`\0R` `\0 \x01`\0\x90U\x90U\x85`\x01\x01`\0\x86\x81R` \x01\x90\x81R` \x01`\0 `\0\x90U`\x01\x93PPPPa\x02\xD6V[`\0\x91PPa\x02\xD6V[`\0` \x82\x84\x03\x12\x15a\n\xEBW`\0\x80\xFD[\x815`\x01`\x01`\xE0\x1B\x03\x19\x81\x16\x81\x14a\x04\xCDW`\0\x80\xFD[`\0` \x82\x84\x03\x12\x15a\x0B\x15W`\0\x80\xFD[P5\x91\x90PV[\x805`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x0B3W`\0\x80\xFD[\x91\x90PV[`\0\x80`@\x83\x85\x03\x12\x15a\x0BKW`\0\x80\xFD[\x825\x91Pa\x0B[` \x84\x01a\x0B\x1CV[\x90P\x92P\x92\x90PV[\x805c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\x0B3W`\0\x80\xFD[`\0\x80`\0\x80``\x85\x87\x03\x12\x15a\x0B\x8EW`\0\x80\xFD[a\x0B\x97\x85a\x0BdV[\x93P` \x85\x015\x92P`@\x85\x015g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x0B\xBBW`\0\x80\xFD[\x81\x87\x01\x91P\x87`\x1F\x83\x01\x12a\x0B\xCFW`\0\x80\xFD[\x815\x81\x81\x11\x15a\x0B\xDEW`\0\x80\xFD[\x88` \x82\x85\x01\x01\x11\x15a\x0B\xF0W`\0\x80\xFD[\x95\x98\x94\x97PP` \x01\x94PPPV[`\0` \x82\x84\x03\x12\x15a\x0C\x11W`\0\x80\xFD[a\x04\xCD\x82a\x0B\x1CV[`\0\x80`@\x83\x85\x03\x12\x15a\x0C-W`\0\x80\xFD[PP\x805\x92` \x90\x91\x015\x91PV[`\0\x80`@\x83\x85\x03\x12\x15a\x0COW`\0\x80\xFD[a\x0CX\x83a\x0BdV[\x91Pa\x0B[` \x84\x01a\x0B\x1CV[`\0[\x83\x81\x10\x15a\x0C\x81W\x81\x81\x01Q\x83\x82\x01R` \x01a\x0CiV[PP`\0\x91\x01RV[\x7FAccessControl: account \0\0\0\0\0\0\0\0\0\x81R`\0\x83Qa\x0C\xC2\x81`\x17\x85\x01` \x88\x01a\x0CfV[p\x01\x03K\x99\x03kK\x9B\x9BKs9\x03\x93{c)`}\x1B`\x17\x91\x84\x01\x91\x82\x01R\x83Qa\x0C\xF3\x81`(\x84\x01` \x88\x01a\x0CfV[\x01`(\x01\x94\x93PPPPV[` \x81R`\0\x82Q\x80` \x84\x01Ra\r\x1E\x81`@\x85\x01` \x87\x01a\x0CfV[`\x1F\x01`\x1F\x19\x16\x91\x90\x91\x01`@\x01\x92\x91PPV[cNH{q`\xE0\x1B`\0R`\x11`\x04R`$`\0\xFD[\x80\x82\x02\x81\x15\x82\x82\x04\x84\x14\x17a\x02\xD6Wa\x02\xD6a\r2V[\x80\x82\x01\x80\x82\x11\x15a\x02\xD6Wa\x02\xD6a\r2V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`\0\x81a\r\xADWa\r\xADa\r2V[P`\0\x19\x01\x90V[\x81\x81\x03\x81\x81\x11\x15a\x02\xD6Wa\x02\xD6a\r2V[cNH{q`\xE0\x1B`\0R`1`\x04R`$`\0\xFD\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The bytecode of the contract.
    pub static GMPINTENTEVENTVERIFIER_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\x01\0W`\x005`\xE0\x1C\x80c\x90\x10\xD0|\x11a\0\x97W\x80c\xCA\x15\xC8s\x11a\0fW\x80c\xCA\x15\xC8s\x14a\x02]W\x80c\xD5C\x8E\xAE\x14a\x02pW\x80c\xD5Gt\x1F\x14a\x02\x8BW\x80c\xD6\xA1\x87\xB6\x14a\x02\x9EW`\0\x80\xFD[\x80c\x90\x10\xD0|\x14a\x01\xF4W\x80c\x91\xD1HT\x14a\x02\x1FW\x80c\xA2\x17\xFD\xDF\x14a\x022W\x80c\xADUY>\x14a\x02:W`\0\x80\xFD[\x80c6V\x8A\xBE\x11a\0\xD3W\x80c6V\x8A\xBE\x14a\x01\x98W\x80cV\xD5\xD4u\x14a\x01\xABW\x80co\xF3\xFE\x95\x14a\x01\xBEW\x80cu\xE3f\x16\x14a\x01\xD1W`\0\x80\xFD[\x80c\x01\xFF\xC9\xA7\x14a\x01\x05W\x80c$\x8A\x9C\xA3\x14a\x01-W\x80c&2\xBB\x8D\x14a\x01^W\x80c//\xF1]\x14a\x01\x83W[`\0\x80\xFD[a\x01\x18a\x01\x136`\x04a\n\xD9V[a\x02\xB1V[`@Q\x90\x15\x15\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\x01Pa\x01;6`\x04a\x0B\x03V[`\0\x90\x81R` \x81\x90R`@\x90 `\x01\x01T\x90V[`@Q\x90\x81R` \x01a\x01$V[`\x02Ta\x01n\x90c\xFF\xFF\xFF\xFF\x16\x81V[`@Qc\xFF\xFF\xFF\xFF\x90\x91\x16\x81R` \x01a\x01$V[a\x01\x96a\x01\x916`\x04a\x0B8V[a\x02\xDCV[\0[a\x01\x96a\x01\xA66`\x04a\x0B8V[a\x03\x06V[a\x01\x96a\x01\xB96`\x04a\x0BxV[a\x03\x89V[a\x01\x96a\x01\xCC6`\x04a\x0B\xFFV[a\x04}V[a\x01\x18a\x01\xDF6`\x04a\x0B\x03V[`\0\x90\x81R`\x03` R`@\x90 T`\xFF\x16\x90V[a\x02\x07a\x02\x026`\x04a\x0C\x1AV[a\x04\xB5V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01a\x01$V[a\x01\x18a\x02-6`\x04a\x0B8V[a\x04\xD4V[a\x01P`\0\x81V[a\x01\x18a\x02H6`\x04a\x0B\x03V[`\x03` R`\0\x90\x81R`@\x90 T`\xFF\x16\x81V[a\x01Pa\x02k6`\x04a\x0B\x03V[a\x04\xFDV[`\x02Ta\x02\x07\x90d\x01\0\0\0\0\x90\x04`\x01`\x01`\xA0\x1B\x03\x16\x81V[a\x01\x96a\x02\x996`\x04a\x0B8V[a\x05\x14V[a\x01\x96a\x02\xAC6`\x04a\x0C<V[a\x059V[`\0`\x01`\x01`\xE0\x1B\x03\x19\x82\x16cZ\x05\x18\x0F`\xE0\x1B\x14\x80a\x02\xD6WPa\x02\xD6\x82a\x05wV[\x92\x91PPV[`\0\x82\x81R` \x81\x90R`@\x90 `\x01\x01Ta\x02\xF7\x81a\x05\xACV[a\x03\x01\x83\x83a\x05\xB6V[PPPV[`\x01`\x01`\xA0\x1B\x03\x81\x163\x14a\x03{W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`/`$\x82\x01R\x7FAccessControl: can only renounce`D\x82\x01Rn\x1097\xB62\xB9\x9037\xB9\x109\xB2\xB63`\x89\x1B`d\x82\x01R`\x84\x01[`@Q\x80\x91\x03\x90\xFD[a\x03\x85\x82\x82a\x05\xD8V[PPV[`\x02Td\x01\0\0\0\0\x90\x04`\x01`\x01`\xA0\x1B\x03\x163`\x01`\x01`\xA0\x1B\x03\x16\x14a\x03\xE6W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x0F`$\x82\x01Rn\r-\xCE\xCC-\x8D,\x84\r\xAC--\x8CM\xEF`\x8B\x1B`D\x82\x01R`d\x01a\x03rV[`\x02Tc\xFF\xFF\xFF\xFF\x85\x81\x16\x91\x16\x14a\x043W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x10`$\x82\x01Ro\x1A[\x9D\x98[\x1AY\x08\x18\xDA\x18Z[\x88\x1AY`\x82\x1B`D\x82\x01R`d\x01a\x03rV[a\x04]\x7F\x13\t\x10=\x1D\xD9\xD9$$I\n\xBF\x1CA\xCE\xF2\x02\xD9E\x9E\x99\x9A7\xBA\xDD\xF4$5\x0BH+$\x84a\x05\xFAV[`\0a\x04k\x82\x84\x01\x84a\x0B\x03V[\x90Pa\x04v\x81a\x06SV[PPPPPV[a\x04\x88`\x003a\x05\xFAV[a\x04\xB2\x7F\x13\t\x10=\x1D\xD9\xD9$$I\n\xBF\x1CA\xCE\xF2\x02\xD9E\x9E\x99\x9A7\xBA\xDD\xF4$5\x0BH+$\x82a\x05\xB6V[PV[`\0\x82\x81R`\x01` R`@\x81 a\x04\xCD\x90\x83a\x06\x96V[\x93\x92PPPV[`\0\x91\x82R` \x82\x81R`@\x80\x84 `\x01`\x01`\xA0\x1B\x03\x93\x90\x93\x16\x84R\x91\x90R\x90 T`\xFF\x16\x90V[`\0\x81\x81R`\x01` R`@\x81 a\x02\xD6\x90a\x06\xA2V[`\0\x82\x81R` \x81\x90R`@\x90 `\x01\x01Ta\x05/\x81a\x05\xACV[a\x03\x01\x83\x83a\x05\xD8V[a\x05D`\x003a\x05\xB6V[`\x02\x80T`\x01`\x01`\xA0\x1B\x03\x90\x92\x16d\x01\0\0\0\0\x02`\x01`\x01`\xC0\x1B\x03\x19\x90\x92\x16c\xFF\xFF\xFF\xFF\x90\x93\x16\x92\x90\x92\x17\x17\x90UV[`\0`\x01`\x01`\xE0\x1B\x03\x19\x82\x16cye\xDB\x0B`\xE0\x1B\x14\x80a\x02\xD6WPc\x01\xFF\xC9\xA7`\xE0\x1B`\x01`\x01`\xE0\x1B\x03\x19\x83\x16\x14a\x02\xD6V[a\x04\xB2\x813a\x05\xFAV[a\x05\xC0\x82\x82a\x06\xACV[`\0\x82\x81R`\x01` R`@\x90 a\x03\x01\x90\x82a\x070V[a\x05\xE2\x82\x82a\x07EV[`\0\x82\x81R`\x01` R`@\x90 a\x03\x01\x90\x82a\x07\xAAV[a\x06\x04\x82\x82a\x04\xD4V[a\x03\x85Wa\x06\x11\x81a\x07\xBFV[a\x06\x1C\x83` a\x07\xD1V[`@Q` \x01a\x06-\x92\x91\x90a\x0C\x8AV[`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x90\x82\x90RbF\x1B\xCD`\xE5\x1B\x82Ra\x03r\x91`\x04\x01a\x0C\xFFV[`\0\x81\x81R`\x03` R`@\x80\x82 \x80T`\xFF\x19\x16`\x01\x17\x90UQ\x82\x91\x7F\xDD\xC5\xDC23\x1C\x1DE\xC7\xA1\x0E\xD7n\x8C\x0B\xAE\xB2:\x18\xCCOK\xE7\xDA\x0Ch:9\x7F\xFB\xF30\x91\xA2PV[`\0a\x04\xCD\x83\x83a\tmV[`\0a\x02\xD6\x82T\x90V[a\x06\xB6\x82\x82a\x04\xD4V[a\x03\x85W`\0\x82\x81R` \x81\x81R`@\x80\x83 `\x01`\x01`\xA0\x1B\x03\x85\x16\x84R\x90\x91R\x90 \x80T`\xFF\x19\x16`\x01\x17\x90Ua\x06\xEC3\x90V[`\x01`\x01`\xA0\x1B\x03\x16\x81`\x01`\x01`\xA0\x1B\x03\x16\x83\x7F/\x87\x88\x11~~\xFF\x1D\x82\xE9&\xECyI\x01\xD1|x\x02JP'\t@0E@\xA73eo\r`@Q`@Q\x80\x91\x03\x90\xA4PPV[`\0a\x04\xCD\x83`\x01`\x01`\xA0\x1B\x03\x84\x16a\t\x97V[a\x07O\x82\x82a\x04\xD4V[\x15a\x03\x85W`\0\x82\x81R` \x81\x81R`@\x80\x83 `\x01`\x01`\xA0\x1B\x03\x85\x16\x80\x85R\x92R\x80\x83 \x80T`\xFF\x19\x16\x90UQ3\x92\x85\x91\x7F\xF69\x1F\\2\xD9\xC6\x9D*G\xEAg\x0BD)t\xB595\xD1\xED\xC7\xFDd\xEB!\xE0G\xA89\x17\x1B\x91\x90\xA4PPV[`\0a\x04\xCD\x83`\x01`\x01`\xA0\x1B\x03\x84\x16a\t\xE6V[``a\x02\xD6`\x01`\x01`\xA0\x1B\x03\x83\x16`\x14[```\0a\x07\xE0\x83`\x02a\rHV[a\x07\xEB\x90`\x02a\r_V[g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x15a\x08\x03Wa\x08\x03a\rrV[`@Q\x90\x80\x82R\x80`\x1F\x01`\x1F\x19\x16` \x01\x82\x01`@R\x80\x15a\x08-W` \x82\x01\x81\x806\x837\x01\x90P[P\x90P`\x03`\xFC\x1B\x81`\0\x81Q\x81\x10a\x08HWa\x08Ha\r\x88V[` \x01\x01\x90`\x01`\x01`\xF8\x1B\x03\x19\x16\x90\x81`\0\x1A\x90SP`\x0F`\xFB\x1B\x81`\x01\x81Q\x81\x10a\x08wWa\x08wa\r\x88V[` \x01\x01\x90`\x01`\x01`\xF8\x1B\x03\x19\x16\x90\x81`\0\x1A\x90SP`\0a\x08\x9B\x84`\x02a\rHV[a\x08\xA6\x90`\x01a\r_V[\x90P[`\x01\x81\x11\x15a\t\x1EWo\x18\x18\x99\x19\x9A\x1A\x9B\x1B\x9C\x1C\xB0\xB11\xB22\xB3`\x81\x1B\x85`\x0F\x16`\x10\x81\x10a\x08\xDAWa\x08\xDAa\r\x88V[\x1A`\xF8\x1B\x82\x82\x81Q\x81\x10a\x08\xF0Wa\x08\xF0a\r\x88V[` \x01\x01\x90`\x01`\x01`\xF8\x1B\x03\x19\x16\x90\x81`\0\x1A\x90SP`\x04\x94\x90\x94\x1C\x93a\t\x17\x81a\r\x9EV[\x90Pa\x08\xA9V[P\x83\x15a\x04\xCDW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01\x81\x90R`$\x82\x01R\x7FStrings: hex length insufficient`D\x82\x01R`d\x01a\x03rV[`\0\x82`\0\x01\x82\x81T\x81\x10a\t\x84Wa\t\x84a\r\x88V[\x90`\0R` `\0 \x01T\x90P\x92\x91PPV[`\0\x81\x81R`\x01\x83\x01` R`@\x81 Ta\t\xDEWP\x81T`\x01\x81\x81\x01\x84U`\0\x84\x81R` \x80\x82 \x90\x93\x01\x84\x90U\x84T\x84\x82R\x82\x86\x01\x90\x93R`@\x90 \x91\x90\x91Ua\x02\xD6V[P`\0a\x02\xD6V[`\0\x81\x81R`\x01\x83\x01` R`@\x81 T\x80\x15a\n\xCFW`\0a\n\n`\x01\x83a\r\xB5V[\x85T\x90\x91P`\0\x90a\n\x1E\x90`\x01\x90a\r\xB5V[\x90P\x81\x81\x14a\n\x83W`\0\x86`\0\x01\x82\x81T\x81\x10a\n>Wa\n>a\r\x88V[\x90`\0R` `\0 \x01T\x90P\x80\x87`\0\x01\x84\x81T\x81\x10a\naWa\naa\r\x88V[`\0\x91\x82R` \x80\x83 \x90\x91\x01\x92\x90\x92U\x91\x82R`\x01\x88\x01\x90R`@\x90 \x83\x90U[\x85T\x86\x90\x80a\n\x94Wa\n\x94a\r\xC8V[`\x01\x90\x03\x81\x81\x90`\0R` `\0 \x01`\0\x90U\x90U\x85`\x01\x01`\0\x86\x81R` \x01\x90\x81R` \x01`\0 `\0\x90U`\x01\x93PPPPa\x02\xD6V[`\0\x91PPa\x02\xD6V[`\0` \x82\x84\x03\x12\x15a\n\xEBW`\0\x80\xFD[\x815`\x01`\x01`\xE0\x1B\x03\x19\x81\x16\x81\x14a\x04\xCDW`\0\x80\xFD[`\0` \x82\x84\x03\x12\x15a\x0B\x15W`\0\x80\xFD[P5\x91\x90PV[\x805`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x0B3W`\0\x80\xFD[\x91\x90PV[`\0\x80`@\x83\x85\x03\x12\x15a\x0BKW`\0\x80\xFD[\x825\x91Pa\x0B[` \x84\x01a\x0B\x1CV[\x90P\x92P\x92\x90PV[\x805c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\x0B3W`\0\x80\xFD[`\0\x80`\0\x80``\x85\x87\x03\x12\x15a\x0B\x8EW`\0\x80\xFD[a\x0B\x97\x85a\x0BdV[\x93P` \x85\x015\x92P`@\x85\x015g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x0B\xBBW`\0\x80\xFD[\x81\x87\x01\x91P\x87`\x1F\x83\x01\x12a\x0B\xCFW`\0\x80\xFD[\x815\x81\x81\x11\x15a\x0B\xDEW`\0\x80\xFD[\x88` \x82\x85\x01\x01\x11\x15a\x0B\xF0W`\0\x80\xFD[\x95\x98\x94\x97PP` \x01\x94PPPV[`\0` \x82\x84\x03\x12\x15a\x0C\x11W`\0\x80\xFD[a\x04\xCD\x82a\x0B\x1CV[`\0\x80`@\x83\x85\x03\x12\x15a\x0C-W`\0\x80\xFD[PP\x805\x92` \x90\x91\x015\x91PV[`\0\x80`@\x83\x85\x03\x12\x15a\x0COW`\0\x80\xFD[a\x0CX\x83a\x0BdV[\x91Pa\x0B[` \x84\x01a\x0B\x1CV[`\0[\x83\x81\x10\x15a\x0C\x81W\x81\x81\x01Q\x83\x82\x01R` \x01a\x0CiV[PP`\0\x91\x01RV[\x7FAccessControl: account \0\0\0\0\0\0\0\0\0\x81R`\0\x83Qa\x0C\xC2\x81`\x17\x85\x01` \x88\x01a\x0CfV[p\x01\x03K\x99\x03kK\x9B\x9BKs9\x03\x93{c)`}\x1B`\x17\x91\x84\x01\x91\x82\x01R\x83Qa\x0C\xF3\x81`(\x84\x01` \x88\x01a\x0CfV[\x01`(\x01\x94\x93PPPPV[` \x81R`\0\x82Q\x80` \x84\x01Ra\r\x1E\x81`@\x85\x01` \x87\x01a\x0CfV[`\x1F\x01`\x1F\x19\x16\x91\x90\x91\x01`@\x01\x92\x91PPV[cNH{q`\xE0\x1B`\0R`\x11`\x04R`$`\0\xFD[\x80\x82\x02\x81\x15\x82\x82\x04\x84\x14\x17a\x02\xD6Wa\x02\xD6a\r2V[\x80\x82\x01\x80\x82\x11\x15a\x02\xD6Wa\x02\xD6a\r2V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[cNH{q`\xE0\x1B`\0R`2`\x04R`$`\0\xFD[`\0\x81a\r\xADWa\r\xADa\r2V[P`\0\x19\x01\x90V[\x81\x81\x03\x81\x81\x11\x15a\x02\xD6Wa\x02\xD6a\r2V[cNH{q`\xE0\x1B`\0R`1`\x04R`$`\0\xFD\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The deployed bytecode of the contract.
    pub static GMPINTENTEVENTVERIFIER_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct GMPIntentEventVerifier<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for GMPIntentEventVerifier<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for GMPIntentEventVerifier<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for GMPIntentEventVerifier<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for GMPIntentEventVerifier<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(GMPIntentEventVerifier))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> GMPIntentEventVerifier<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                GMPINTENTEVENTVERIFIER_ABI.clone(),
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
                GMPINTENTEVENTVERIFIER_ABI.clone(),
                GMPINTENTEVENTVERIFIER_BYTECODE.clone().into(),
                client,
            );
            let deployer = factory.deploy(constructor_args)?;
            let deployer = ::ethers::contract::ContractDeployer::new(deployer);
            Ok(deployer)
        }
        ///Calls the contract's `DEFAULT_ADMIN_ROLE` (0xa217fddf) function
        pub fn default_admin_role(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([162, 23, 253, 223], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `addEventRegisterer` (0x6ff3fe95) function
        pub fn add_event_registerer(
            &self,
            event_registerer: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([111, 243, 254, 149], event_registerer)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getRoleAdmin` (0x248a9ca3) function
        pub fn get_role_admin(
            &self,
            role: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([36, 138, 156, 163], role)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getRoleMember` (0x9010d07c) function
        pub fn get_role_member(
            &self,
            role: [u8; 32],
            index: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([144, 16, 208, 124], (role, index))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getRoleMemberCount` (0xca15c873) function
        pub fn get_role_member_count(
            &self,
            role: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([202, 21, 200, 115], role)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `grantRole` (0x2f2ff15d) function
        pub fn grant_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([47, 47, 241, 93], (role, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `handle` (0x56d5d475) function
        pub fn handle(
            &self,
            origin: u32,
            sender: [u8; 32],
            message: ::ethers::core::types::Bytes,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([86, 213, 212, 117], (origin, sender, message))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `hasRole` (0x91d14854) function
        pub fn has_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([145, 209, 72, 84], (role, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `initialise` (0xd6a187b6) function
        pub fn initialise(
            &self,
            prover_chain_domain: u32,
            mailbox: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([214, 161, 135, 182], (prover_chain_domain, mailbox))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `mailbox` (0xd5438eae) function
        pub fn mailbox(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([213, 67, 142, 174], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `provedEvents` (0xad55593e) function
        pub fn proved_events(
            &self,
            event_hash: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([173, 85, 89, 62], event_hash)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proverChainDomain` (0x2632bb8d) function
        pub fn prover_chain_domain(&self) -> ::ethers::contract::builders::ContractCall<M, u32> {
            self.0
                .method_hash([38, 50, 187, 141], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `renounceRole` (0x36568abe) function
        pub fn renounce_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([54, 86, 138, 190], (role, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `revokeRole` (0xd547741f) function
        pub fn revoke_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([213, 71, 116, 31], (role, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `supportsInterface` (0x01ffc9a7) function
        pub fn supports_interface(
            &self,
            interface_id: [u8; 4],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([1, 255, 201, 167], interface_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `verify` (0x75e36616) function
        pub fn verify(
            &self,
            event_hash: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([117, 227, 102, 22], event_hash)
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `NewEventRegistered` event
        pub fn new_event_registered_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, NewEventRegisteredFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `RoleAdminChanged` event
        pub fn role_admin_changed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, RoleAdminChangedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `RoleGranted` event
        pub fn role_granted_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, RoleGrantedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `RoleRevoked` event
        pub fn role_revoked_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, RoleRevokedFilter>
        {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, GMPIntentEventVerifierEvents>
        {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for GMPIntentEventVerifier<M>
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
    #[ethevent(name = "NewEventRegistered", abi = "NewEventRegistered(bytes32)")]
    pub struct NewEventRegisteredFilter {
        #[ethevent(indexed)]
        pub event_hash: [u8; 32],
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
        name = "RoleAdminChanged",
        abi = "RoleAdminChanged(bytes32,bytes32,bytes32)"
    )]
    pub struct RoleAdminChangedFilter {
        #[ethevent(indexed)]
        pub role: [u8; 32],
        #[ethevent(indexed)]
        pub previous_admin_role: [u8; 32],
        #[ethevent(indexed)]
        pub new_admin_role: [u8; 32],
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
    #[ethevent(name = "RoleGranted", abi = "RoleGranted(bytes32,address,address)")]
    pub struct RoleGrantedFilter {
        #[ethevent(indexed)]
        pub role: [u8; 32],
        #[ethevent(indexed)]
        pub account: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub sender: ::ethers::core::types::Address,
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
    #[ethevent(name = "RoleRevoked", abi = "RoleRevoked(bytes32,address,address)")]
    pub struct RoleRevokedFilter {
        #[ethevent(indexed)]
        pub role: [u8; 32],
        #[ethevent(indexed)]
        pub account: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub sender: ::ethers::core::types::Address,
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
    pub enum GMPIntentEventVerifierEvents {
        NewEventRegisteredFilter(NewEventRegisteredFilter),
        RoleAdminChangedFilter(RoleAdminChangedFilter),
        RoleGrantedFilter(RoleGrantedFilter),
        RoleRevokedFilter(RoleRevokedFilter),
    }
    impl ::ethers::contract::EthLogDecode for GMPIntentEventVerifierEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = NewEventRegisteredFilter::decode_log(log) {
                return Ok(GMPIntentEventVerifierEvents::NewEventRegisteredFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = RoleAdminChangedFilter::decode_log(log) {
                return Ok(GMPIntentEventVerifierEvents::RoleAdminChangedFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = RoleGrantedFilter::decode_log(log) {
                return Ok(GMPIntentEventVerifierEvents::RoleGrantedFilter(decoded));
            }
            if let Ok(decoded) = RoleRevokedFilter::decode_log(log) {
                return Ok(GMPIntentEventVerifierEvents::RoleRevokedFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for GMPIntentEventVerifierEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::NewEventRegisteredFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::RoleAdminChangedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::RoleGrantedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::RoleRevokedFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<NewEventRegisteredFilter> for GMPIntentEventVerifierEvents {
        fn from(value: NewEventRegisteredFilter) -> Self {
            Self::NewEventRegisteredFilter(value)
        }
    }
    impl ::core::convert::From<RoleAdminChangedFilter> for GMPIntentEventVerifierEvents {
        fn from(value: RoleAdminChangedFilter) -> Self {
            Self::RoleAdminChangedFilter(value)
        }
    }
    impl ::core::convert::From<RoleGrantedFilter> for GMPIntentEventVerifierEvents {
        fn from(value: RoleGrantedFilter) -> Self {
            Self::RoleGrantedFilter(value)
        }
    }
    impl ::core::convert::From<RoleRevokedFilter> for GMPIntentEventVerifierEvents {
        fn from(value: RoleRevokedFilter) -> Self {
            Self::RoleRevokedFilter(value)
        }
    }
    ///Container type for all input parameters for the `DEFAULT_ADMIN_ROLE` function with signature `DEFAULT_ADMIN_ROLE()` and selector `0xa217fddf`
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
    #[ethcall(name = "DEFAULT_ADMIN_ROLE", abi = "DEFAULT_ADMIN_ROLE()")]
    pub struct DefaultAdminRoleCall;
    ///Container type for all input parameters for the `addEventRegisterer` function with signature `addEventRegisterer(address)` and selector `0x6ff3fe95`
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
    #[ethcall(name = "addEventRegisterer", abi = "addEventRegisterer(address)")]
    pub struct AddEventRegistererCall {
        pub event_registerer: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `getRoleAdmin` function with signature `getRoleAdmin(bytes32)` and selector `0x248a9ca3`
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
    #[ethcall(name = "getRoleAdmin", abi = "getRoleAdmin(bytes32)")]
    pub struct GetRoleAdminCall {
        pub role: [u8; 32],
    }
    ///Container type for all input parameters for the `getRoleMember` function with signature `getRoleMember(bytes32,uint256)` and selector `0x9010d07c`
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
    #[ethcall(name = "getRoleMember", abi = "getRoleMember(bytes32,uint256)")]
    pub struct GetRoleMemberCall {
        pub role: [u8; 32],
        pub index: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getRoleMemberCount` function with signature `getRoleMemberCount(bytes32)` and selector `0xca15c873`
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
    #[ethcall(name = "getRoleMemberCount", abi = "getRoleMemberCount(bytes32)")]
    pub struct GetRoleMemberCountCall {
        pub role: [u8; 32],
    }
    ///Container type for all input parameters for the `grantRole` function with signature `grantRole(bytes32,address)` and selector `0x2f2ff15d`
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
    #[ethcall(name = "grantRole", abi = "grantRole(bytes32,address)")]
    pub struct GrantRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `handle` function with signature `handle(uint32,bytes32,bytes)` and selector `0x56d5d475`
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
    #[ethcall(name = "handle", abi = "handle(uint32,bytes32,bytes)")]
    pub struct HandleCall {
        pub origin: u32,
        pub sender: [u8; 32],
        pub message: ::ethers::core::types::Bytes,
    }
    ///Container type for all input parameters for the `hasRole` function with signature `hasRole(bytes32,address)` and selector `0x91d14854`
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
    #[ethcall(name = "hasRole", abi = "hasRole(bytes32,address)")]
    pub struct HasRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `initialise` function with signature `initialise(uint32,address)` and selector `0xd6a187b6`
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
    #[ethcall(name = "initialise", abi = "initialise(uint32,address)")]
    pub struct InitialiseCall {
        pub prover_chain_domain: u32,
        pub mailbox: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `mailbox` function with signature `mailbox()` and selector `0xd5438eae`
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
    #[ethcall(name = "mailbox", abi = "mailbox()")]
    pub struct MailboxCall;
    ///Container type for all input parameters for the `provedEvents` function with signature `provedEvents(bytes32)` and selector `0xad55593e`
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
    #[ethcall(name = "provedEvents", abi = "provedEvents(bytes32)")]
    pub struct ProvedEventsCall {
        pub event_hash: [u8; 32],
    }
    ///Container type for all input parameters for the `proverChainDomain` function with signature `proverChainDomain()` and selector `0x2632bb8d`
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
    #[ethcall(name = "proverChainDomain", abi = "proverChainDomain()")]
    pub struct ProverChainDomainCall;
    ///Container type for all input parameters for the `renounceRole` function with signature `renounceRole(bytes32,address)` and selector `0x36568abe`
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
    #[ethcall(name = "renounceRole", abi = "renounceRole(bytes32,address)")]
    pub struct RenounceRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `revokeRole` function with signature `revokeRole(bytes32,address)` and selector `0xd547741f`
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
    #[ethcall(name = "revokeRole", abi = "revokeRole(bytes32,address)")]
    pub struct RevokeRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `supportsInterface` function with signature `supportsInterface(bytes4)` and selector `0x01ffc9a7`
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
    #[ethcall(name = "supportsInterface", abi = "supportsInterface(bytes4)")]
    pub struct SupportsInterfaceCall {
        pub interface_id: [u8; 4],
    }
    ///Container type for all input parameters for the `verify` function with signature `verify(bytes32)` and selector `0x75e36616`
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
    #[ethcall(name = "verify", abi = "verify(bytes32)")]
    pub struct VerifyCall {
        pub event_hash: [u8; 32],
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
    pub enum GMPIntentEventVerifierCalls {
        DefaultAdminRole(DefaultAdminRoleCall),
        AddEventRegisterer(AddEventRegistererCall),
        GetRoleAdmin(GetRoleAdminCall),
        GetRoleMember(GetRoleMemberCall),
        GetRoleMemberCount(GetRoleMemberCountCall),
        GrantRole(GrantRoleCall),
        Handle(HandleCall),
        HasRole(HasRoleCall),
        Initialise(InitialiseCall),
        Mailbox(MailboxCall),
        ProvedEvents(ProvedEventsCall),
        ProverChainDomain(ProverChainDomainCall),
        RenounceRole(RenounceRoleCall),
        RevokeRole(RevokeRoleCall),
        SupportsInterface(SupportsInterfaceCall),
        Verify(VerifyCall),
    }
    impl ::ethers::core::abi::AbiDecode for GMPIntentEventVerifierCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) =
                <DefaultAdminRoleCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::DefaultAdminRole(decoded));
            }
            if let Ok(decoded) =
                <AddEventRegistererCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::AddEventRegisterer(decoded));
            }
            if let Ok(decoded) = <GetRoleAdminCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetRoleAdmin(decoded));
            }
            if let Ok(decoded) = <GetRoleMemberCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetRoleMember(decoded));
            }
            if let Ok(decoded) =
                <GetRoleMemberCountCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetRoleMemberCount(decoded));
            }
            if let Ok(decoded) = <GrantRoleCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GrantRole(decoded));
            }
            if let Ok(decoded) = <HandleCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Handle(decoded));
            }
            if let Ok(decoded) = <HasRoleCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::HasRole(decoded));
            }
            if let Ok(decoded) = <InitialiseCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Initialise(decoded));
            }
            if let Ok(decoded) = <MailboxCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Mailbox(decoded));
            }
            if let Ok(decoded) = <ProvedEventsCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::ProvedEvents(decoded));
            }
            if let Ok(decoded) =
                <ProverChainDomainCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::ProverChainDomain(decoded));
            }
            if let Ok(decoded) = <RenounceRoleCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::RenounceRole(decoded));
            }
            if let Ok(decoded) = <RevokeRoleCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::RevokeRole(decoded));
            }
            if let Ok(decoded) =
                <SupportsInterfaceCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SupportsInterface(decoded));
            }
            if let Ok(decoded) = <VerifyCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Verify(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for GMPIntentEventVerifierCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::DefaultAdminRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::AddEventRegisterer(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetRoleAdmin(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetRoleMember(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetRoleMemberCount(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GrantRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Handle(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::HasRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Initialise(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Mailbox(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ProvedEvents(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ProverChainDomain(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RenounceRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RevokeRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SupportsInterface(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Verify(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for GMPIntentEventVerifierCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::DefaultAdminRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::AddEventRegisterer(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetRoleAdmin(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetRoleMember(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetRoleMemberCount(element) => ::core::fmt::Display::fmt(element, f),
                Self::GrantRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::Handle(element) => ::core::fmt::Display::fmt(element, f),
                Self::HasRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::Initialise(element) => ::core::fmt::Display::fmt(element, f),
                Self::Mailbox(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProvedEvents(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProverChainDomain(element) => ::core::fmt::Display::fmt(element, f),
                Self::RenounceRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::RevokeRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::SupportsInterface(element) => ::core::fmt::Display::fmt(element, f),
                Self::Verify(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<DefaultAdminRoleCall> for GMPIntentEventVerifierCalls {
        fn from(value: DefaultAdminRoleCall) -> Self {
            Self::DefaultAdminRole(value)
        }
    }
    impl ::core::convert::From<AddEventRegistererCall> for GMPIntentEventVerifierCalls {
        fn from(value: AddEventRegistererCall) -> Self {
            Self::AddEventRegisterer(value)
        }
    }
    impl ::core::convert::From<GetRoleAdminCall> for GMPIntentEventVerifierCalls {
        fn from(value: GetRoleAdminCall) -> Self {
            Self::GetRoleAdmin(value)
        }
    }
    impl ::core::convert::From<GetRoleMemberCall> for GMPIntentEventVerifierCalls {
        fn from(value: GetRoleMemberCall) -> Self {
            Self::GetRoleMember(value)
        }
    }
    impl ::core::convert::From<GetRoleMemberCountCall> for GMPIntentEventVerifierCalls {
        fn from(value: GetRoleMemberCountCall) -> Self {
            Self::GetRoleMemberCount(value)
        }
    }
    impl ::core::convert::From<GrantRoleCall> for GMPIntentEventVerifierCalls {
        fn from(value: GrantRoleCall) -> Self {
            Self::GrantRole(value)
        }
    }
    impl ::core::convert::From<HandleCall> for GMPIntentEventVerifierCalls {
        fn from(value: HandleCall) -> Self {
            Self::Handle(value)
        }
    }
    impl ::core::convert::From<HasRoleCall> for GMPIntentEventVerifierCalls {
        fn from(value: HasRoleCall) -> Self {
            Self::HasRole(value)
        }
    }
    impl ::core::convert::From<InitialiseCall> for GMPIntentEventVerifierCalls {
        fn from(value: InitialiseCall) -> Self {
            Self::Initialise(value)
        }
    }
    impl ::core::convert::From<MailboxCall> for GMPIntentEventVerifierCalls {
        fn from(value: MailboxCall) -> Self {
            Self::Mailbox(value)
        }
    }
    impl ::core::convert::From<ProvedEventsCall> for GMPIntentEventVerifierCalls {
        fn from(value: ProvedEventsCall) -> Self {
            Self::ProvedEvents(value)
        }
    }
    impl ::core::convert::From<ProverChainDomainCall> for GMPIntentEventVerifierCalls {
        fn from(value: ProverChainDomainCall) -> Self {
            Self::ProverChainDomain(value)
        }
    }
    impl ::core::convert::From<RenounceRoleCall> for GMPIntentEventVerifierCalls {
        fn from(value: RenounceRoleCall) -> Self {
            Self::RenounceRole(value)
        }
    }
    impl ::core::convert::From<RevokeRoleCall> for GMPIntentEventVerifierCalls {
        fn from(value: RevokeRoleCall) -> Self {
            Self::RevokeRole(value)
        }
    }
    impl ::core::convert::From<SupportsInterfaceCall> for GMPIntentEventVerifierCalls {
        fn from(value: SupportsInterfaceCall) -> Self {
            Self::SupportsInterface(value)
        }
    }
    impl ::core::convert::From<VerifyCall> for GMPIntentEventVerifierCalls {
        fn from(value: VerifyCall) -> Self {
            Self::Verify(value)
        }
    }
    ///Container type for all return fields from the `DEFAULT_ADMIN_ROLE` function with signature `DEFAULT_ADMIN_ROLE()` and selector `0xa217fddf`
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
    pub struct DefaultAdminRoleReturn(pub [u8; 32]);
    ///Container type for all return fields from the `getRoleAdmin` function with signature `getRoleAdmin(bytes32)` and selector `0x248a9ca3`
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
    pub struct GetRoleAdminReturn(pub [u8; 32]);
    ///Container type for all return fields from the `getRoleMember` function with signature `getRoleMember(bytes32,uint256)` and selector `0x9010d07c`
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
    pub struct GetRoleMemberReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `getRoleMemberCount` function with signature `getRoleMemberCount(bytes32)` and selector `0xca15c873`
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
    pub struct GetRoleMemberCountReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `hasRole` function with signature `hasRole(bytes32,address)` and selector `0x91d14854`
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
    pub struct HasRoleReturn(pub bool);
    ///Container type for all return fields from the `mailbox` function with signature `mailbox()` and selector `0xd5438eae`
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
    pub struct MailboxReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `provedEvents` function with signature `provedEvents(bytes32)` and selector `0xad55593e`
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
    pub struct ProvedEventsReturn(pub bool);
    ///Container type for all return fields from the `proverChainDomain` function with signature `proverChainDomain()` and selector `0x2632bb8d`
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
    pub struct ProverChainDomainReturn(pub u32);
    ///Container type for all return fields from the `supportsInterface` function with signature `supportsInterface(bytes4)` and selector `0x01ffc9a7`
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
    pub struct SupportsInterfaceReturn(pub bool);
    ///Container type for all return fields from the `verify` function with signature `verify(bytes32)` and selector `0x75e36616`
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
    pub struct VerifyReturn(pub bool);
}
