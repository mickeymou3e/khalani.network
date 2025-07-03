pub use spoke_chain_executor::*;
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
pub mod spoke_chain_executor {
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                    name: ::std::borrow::ToOwned::to_owned("_spokeChainCallEventProver",),
                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                    internal_type: ::core::option::Option::Some(::std::borrow::ToOwned::to_owned(
                        "contract EventProver"
                    ),),
                },],
            }),
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("callSpoke"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("callSpoke"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("spokeChainCallIntentId",),
                                kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes32"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("contractToCall"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("callData"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("token"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("amount"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Uint(256usize,),
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("uint256"),
                                ),
                            },
                        ],
                        outputs: ::std::vec![],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("spokeChainCallEventProver"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("spokeChainCallEventProver",),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("contract EventProver"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
            ]),
            events: ::core::convert::From::from([(
                ::std::borrow::ToOwned::to_owned("SpokeCalled"),
                ::std::vec![::ethers::core::abi::ethabi::Event {
                    name: ::std::borrow::ToOwned::to_owned("SpokeCalled"),
                    inputs: ::std::vec![
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("contractToCall"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            indexed: true,
                        },
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("token"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            indexed: true,
                        },
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("amount"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Uint(256usize,),
                            indexed: true,
                        },
                    ],
                    anonymous: false,
                },],
            )]),
            errors: ::std::collections::BTreeMap::new(),
            receive: false,
            fallback: false,
        }
    }
    ///The parsed JSON ABI of the contract.
    pub static SPOKECHAINEXECUTOR_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`@Qa\te8\x03\x80a\te\x839\x81\x01`@\x81\x90Ra\0/\x91a\0TV[`\0\x80T`\x01`\x01`\xA0\x1B\x03\x19\x16`\x01`\x01`\xA0\x1B\x03\x92\x90\x92\x16\x91\x90\x91\x17\x90Ua\0\x84V[`\0` \x82\x84\x03\x12\x15a\0fW`\0\x80\xFD[\x81Q`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\0}W`\0\x80\xFD[\x93\x92PPPV[a\x08\xD2\x80a\0\x93`\09`\0\xF3\xFE`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\x006W`\x005`\xE0\x1C\x80c)\xA4\xD7U\x14a\0;W\x80c\xF4Mx\x14\x14a\0PW[`\0\x80\xFD[a\0Na\0I6`\x04a\x06\xE3V[a\0\x7FV[\0[`\0Ta\0c\x90`\x01`\x01`\xA0\x1B\x03\x16\x81V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01`@Q\x80\x91\x03\x90\xF3[`\x01`\x01`\xA0\x1B\x03\x82\x16\x15a\0\xA5Wa\0\x9A\x8230\x84a\x02\x8AV[a\0\xA5\x82\x86\x83a\x02\xFBV[`\0\x85`\x01`\x01`\xA0\x1B\x03\x16\x85\x85`@Qa\0\xC1\x92\x91\x90a\x07\x89V[`\0`@Q\x80\x83\x03\x81`\0\x86Z\xF1\x91PP=\x80`\0\x81\x14a\0\xFEW`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x01\x03V[``\x91P[PP\x90P\x80a\x01YW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x17`$\x82\x01R\x7FCall to contract failed\0\0\0\0\0\0\0\0\0`D\x82\x01R`d\x01[`@Q\x80\x91\x03\x90\xFD[`\0a\x01\xE0`@Q\x80`\xC0\x01`@R\x803`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x8A\x81R` \x01\x89`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x88\x88\x80\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x93\x92\x91\x90\x81\x81R` \x01\x83\x83\x80\x82\x847`\0\x92\x01\x91\x90\x91RPPP\x90\x82RP`\x01`\x01`\xA0\x1B\x03\x87\x16` \x82\x01R`@\x01\x85\x90Ra\x04\x15V[`\0T`@Qc\x1A\xCDdY`\xE3\x1B\x81R`\x04\x81\x01\x83\x90R\x91\x92P`\x01`\x01`\xA0\x1B\x03\x16\x90c\xD6k\"\xC8\x90`$\x01`\0`@Q\x80\x83\x03\x81`\0\x87\x80;\x15\x80\x15a\x02'W`\0\x80\xFD[PZ\xF1\x15\x80\x15a\x02;W=`\0\x80>=`\0\xFD[PPPP\x82\x84`\x01`\x01`\xA0\x1B\x03\x16\x88`\x01`\x01`\xA0\x1B\x03\x16\x7F\x1FG\xD7\xE1\x13 \x1Ef\xC1\xA1\xB8)\xD5\x010\xAD\x83@e2\x12\xF2\x19\xD7M\xA5\xD4/\x89\xF7\xDB\xD8`@Q`@Q\x80\x91\x03\x90\xA4PPPPPPPPV[`@Q`\x01`\x01`\xA0\x1B\x03\x80\x85\x16`$\x83\x01R\x83\x16`D\x82\x01R`d\x81\x01\x82\x90Ra\x02\xF5\x90\x85\x90c#\xB8r\xDD`\xE0\x1B\x90`\x84\x01[`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x91\x90R` \x81\x01\x80Q`\x01`\x01`\xE0\x1B\x03\x16`\x01`\x01`\xE0\x1B\x03\x19\x90\x93\x16\x92\x90\x92\x17\x90\x91Ra\x04bV[PPPPV[\x80\x15\x80a\x03uWP`@Qcn\xB1v\x9F`\xE1\x1B\x81R0`\x04\x82\x01R`\x01`\x01`\xA0\x1B\x03\x83\x81\x16`$\x83\x01R\x84\x16\x90c\xDDb\xED>\x90`D\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x03OW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x03s\x91\x90a\x07\x99V[\x15[a\x03\xE0W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`6`$\x82\x01R\x7FSafeERC20: approve from non-zero`D\x82\x01Ru to non-zero allowance`P\x1B`d\x82\x01R`\x84\x01a\x01PV[`@Q`\x01`\x01`\xA0\x1B\x03\x83\x16`$\x82\x01R`D\x81\x01\x82\x90Ra\x04\x10\x90\x84\x90c\t^\xA7\xB3`\xE0\x1B\x90`d\x01a\x02\xBEV[PPPV[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q\x93Q`\0\x97a\x04E\x97\x90\x96\x95\x91\x01a\x07\xD6V[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0a\x04\xB7\x82`@Q\x80`@\x01`@R\x80` \x81R` \x01\x7FSafeERC20: low-level call failed\x81RP\x85`\x01`\x01`\xA0\x1B\x03\x16a\x057\x90\x92\x91\x90c\xFF\xFF\xFF\xFF\x16V[\x90P\x80Q`\0\x14\x80a\x04\xD8WP\x80\x80` \x01\x90Q\x81\x01\x90a\x04\xD8\x91\x90a\x08MV[a\x04\x10W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`*`$\x82\x01R\x7FSafeERC20: ERC20 operation did n`D\x82\x01Ri\x1B\xDD\x08\x1C\xDDX\xD8\xD9YY`\xB2\x1B`d\x82\x01R`\x84\x01a\x01PV[``a\x05F\x84\x84`\0\x85a\x05NV[\x94\x93PPPPV[``\x82G\x10\x15a\x05\xAFW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FAddress: insufficient balance fo`D\x82\x01Re\x1C\x88\x18\xD8[\x1B`\xD2\x1B`d\x82\x01R`\x84\x01a\x01PV[`\0\x80\x86`\x01`\x01`\xA0\x1B\x03\x16\x85\x87`@Qa\x05\xCB\x91\x90a\x08vV[`\0`@Q\x80\x83\x03\x81\x85\x87Z\xF1\x92PPP=\x80`\0\x81\x14a\x06\x08W`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x06\rV[``\x91P[P\x91P\x91Pa\x06\x1E\x87\x83\x83\x87a\x06)V[\x97\x96PPPPPPPV[``\x83\x15a\x06\x98W\x82Q`\0\x03a\x06\x91W`\x01`\x01`\xA0\x1B\x03\x85\x16;a\x06\x91W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1D`$\x82\x01R\x7FAddress: call to non-contract\0\0\0`D\x82\x01R`d\x01a\x01PV[P\x81a\x05FV[a\x05F\x83\x83\x81Q\x15a\x06\xADW\x81Q\x80\x83` \x01\xFD[\x80`@QbF\x1B\xCD`\xE5\x1B\x81R`\x04\x01a\x01P\x91\x90a\x08\x92V[\x805`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x06\xDEW`\0\x80\xFD[\x91\x90PV[`\0\x80`\0\x80`\0\x80`\xA0\x87\x89\x03\x12\x15a\x06\xFCW`\0\x80\xFD[\x865\x95Pa\x07\x0C` \x88\x01a\x06\xC7V[\x94P`@\x87\x015g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x07)W`\0\x80\xFD[\x81\x89\x01\x91P\x89`\x1F\x83\x01\x12a\x07=W`\0\x80\xFD[\x815\x81\x81\x11\x15a\x07LW`\0\x80\xFD[\x8A` \x82\x85\x01\x01\x11\x15a\x07^W`\0\x80\xFD[` \x83\x01\x96P\x80\x95PPPPa\x07v``\x88\x01a\x06\xC7V[\x91P`\x80\x87\x015\x90P\x92\x95P\x92\x95P\x92\x95V[\x81\x83\x827`\0\x91\x01\x90\x81R\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x07\xABW`\0\x80\xFD[PQ\x91\x90PV[`\0[\x83\x81\x10\x15a\x07\xCDW\x81\x81\x01Q\x83\x82\x01R` \x01a\x07\xB5V[PP`\0\x91\x01RV[j\x14\xDC\x1B\xDA\xD9P\xD8[\x1B\x19Y`\xAA\x1B\x81R`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x89``\x1B\x16`\x0B\x84\x01R\x87`\x1F\x84\x01R\x80\x87``\x1B\x16`?\x84\x01R\x85Qa\x08&\x81`S\x86\x01` \x8A\x01a\x07\xB2V[``\x95\x90\x95\x1B\x16\x91\x90\x93\x01`S\x81\x01\x91\x90\x91R`g\x81\x01\x91\x90\x91R`\x87\x01\x95\x94PPPPPV[`\0` \x82\x84\x03\x12\x15a\x08_W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a\x08oW`\0\x80\xFD[\x93\x92PPPV[`\0\x82Qa\x08\x88\x81\x84` \x87\x01a\x07\xB2V[\x91\x90\x91\x01\x92\x91PPV[` \x81R`\0\x82Q\x80` \x84\x01Ra\x08\xB1\x81`@\x85\x01` \x87\x01a\x07\xB2V[`\x1F\x01`\x1F\x19\x16\x91\x90\x91\x01`@\x01\x92\x91PPV\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The bytecode of the contract.
    pub static SPOKECHAINEXECUTOR_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\x006W`\x005`\xE0\x1C\x80c)\xA4\xD7U\x14a\0;W\x80c\xF4Mx\x14\x14a\0PW[`\0\x80\xFD[a\0Na\0I6`\x04a\x06\xE3V[a\0\x7FV[\0[`\0Ta\0c\x90`\x01`\x01`\xA0\x1B\x03\x16\x81V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01`@Q\x80\x91\x03\x90\xF3[`\x01`\x01`\xA0\x1B\x03\x82\x16\x15a\0\xA5Wa\0\x9A\x8230\x84a\x02\x8AV[a\0\xA5\x82\x86\x83a\x02\xFBV[`\0\x85`\x01`\x01`\xA0\x1B\x03\x16\x85\x85`@Qa\0\xC1\x92\x91\x90a\x07\x89V[`\0`@Q\x80\x83\x03\x81`\0\x86Z\xF1\x91PP=\x80`\0\x81\x14a\0\xFEW`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x01\x03V[``\x91P[PP\x90P\x80a\x01YW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x17`$\x82\x01R\x7FCall to contract failed\0\0\0\0\0\0\0\0\0`D\x82\x01R`d\x01[`@Q\x80\x91\x03\x90\xFD[`\0a\x01\xE0`@Q\x80`\xC0\x01`@R\x803`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x8A\x81R` \x01\x89`\x01`\x01`\xA0\x1B\x03\x16\x81R` \x01\x88\x88\x80\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x93\x92\x91\x90\x81\x81R` \x01\x83\x83\x80\x82\x847`\0\x92\x01\x91\x90\x91RPPP\x90\x82RP`\x01`\x01`\xA0\x1B\x03\x87\x16` \x82\x01R`@\x01\x85\x90Ra\x04\x15V[`\0T`@Qc\x1A\xCDdY`\xE3\x1B\x81R`\x04\x81\x01\x83\x90R\x91\x92P`\x01`\x01`\xA0\x1B\x03\x16\x90c\xD6k\"\xC8\x90`$\x01`\0`@Q\x80\x83\x03\x81`\0\x87\x80;\x15\x80\x15a\x02'W`\0\x80\xFD[PZ\xF1\x15\x80\x15a\x02;W=`\0\x80>=`\0\xFD[PPPP\x82\x84`\x01`\x01`\xA0\x1B\x03\x16\x88`\x01`\x01`\xA0\x1B\x03\x16\x7F\x1FG\xD7\xE1\x13 \x1Ef\xC1\xA1\xB8)\xD5\x010\xAD\x83@e2\x12\xF2\x19\xD7M\xA5\xD4/\x89\xF7\xDB\xD8`@Q`@Q\x80\x91\x03\x90\xA4PPPPPPPPV[`@Q`\x01`\x01`\xA0\x1B\x03\x80\x85\x16`$\x83\x01R\x83\x16`D\x82\x01R`d\x81\x01\x82\x90Ra\x02\xF5\x90\x85\x90c#\xB8r\xDD`\xE0\x1B\x90`\x84\x01[`@\x80Q`\x1F\x19\x81\x84\x03\x01\x81R\x91\x90R` \x81\x01\x80Q`\x01`\x01`\xE0\x1B\x03\x16`\x01`\x01`\xE0\x1B\x03\x19\x90\x93\x16\x92\x90\x92\x17\x90\x91Ra\x04bV[PPPPV[\x80\x15\x80a\x03uWP`@Qcn\xB1v\x9F`\xE1\x1B\x81R0`\x04\x82\x01R`\x01`\x01`\xA0\x1B\x03\x83\x81\x16`$\x83\x01R\x84\x16\x90c\xDDb\xED>\x90`D\x01` `@Q\x80\x83\x03\x81\x86Z\xFA\x15\x80\x15a\x03OW=`\0\x80>=`\0\xFD[PPPP`@Q=`\x1F\x19`\x1F\x82\x01\x16\x82\x01\x80`@RP\x81\x01\x90a\x03s\x91\x90a\x07\x99V[\x15[a\x03\xE0W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`6`$\x82\x01R\x7FSafeERC20: approve from non-zero`D\x82\x01Ru to non-zero allowance`P\x1B`d\x82\x01R`\x84\x01a\x01PV[`@Q`\x01`\x01`\xA0\x1B\x03\x83\x16`$\x82\x01R`D\x81\x01\x82\x90Ra\x04\x10\x90\x84\x90c\t^\xA7\xB3`\xE0\x1B\x90`d\x01a\x02\xBEV[PPPV[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q\x93Q`\0\x97a\x04E\x97\x90\x96\x95\x91\x01a\x07\xD6V[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0a\x04\xB7\x82`@Q\x80`@\x01`@R\x80` \x81R` \x01\x7FSafeERC20: low-level call failed\x81RP\x85`\x01`\x01`\xA0\x1B\x03\x16a\x057\x90\x92\x91\x90c\xFF\xFF\xFF\xFF\x16V[\x90P\x80Q`\0\x14\x80a\x04\xD8WP\x80\x80` \x01\x90Q\x81\x01\x90a\x04\xD8\x91\x90a\x08MV[a\x04\x10W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`*`$\x82\x01R\x7FSafeERC20: ERC20 operation did n`D\x82\x01Ri\x1B\xDD\x08\x1C\xDDX\xD8\xD9YY`\xB2\x1B`d\x82\x01R`\x84\x01a\x01PV[``a\x05F\x84\x84`\0\x85a\x05NV[\x94\x93PPPPV[``\x82G\x10\x15a\x05\xAFW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FAddress: insufficient balance fo`D\x82\x01Re\x1C\x88\x18\xD8[\x1B`\xD2\x1B`d\x82\x01R`\x84\x01a\x01PV[`\0\x80\x86`\x01`\x01`\xA0\x1B\x03\x16\x85\x87`@Qa\x05\xCB\x91\x90a\x08vV[`\0`@Q\x80\x83\x03\x81\x85\x87Z\xF1\x92PPP=\x80`\0\x81\x14a\x06\x08W`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x06\rV[``\x91P[P\x91P\x91Pa\x06\x1E\x87\x83\x83\x87a\x06)V[\x97\x96PPPPPPPV[``\x83\x15a\x06\x98W\x82Q`\0\x03a\x06\x91W`\x01`\x01`\xA0\x1B\x03\x85\x16;a\x06\x91W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1D`$\x82\x01R\x7FAddress: call to non-contract\0\0\0`D\x82\x01R`d\x01a\x01PV[P\x81a\x05FV[a\x05F\x83\x83\x81Q\x15a\x06\xADW\x81Q\x80\x83` \x01\xFD[\x80`@QbF\x1B\xCD`\xE5\x1B\x81R`\x04\x01a\x01P\x91\x90a\x08\x92V[\x805`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x06\xDEW`\0\x80\xFD[\x91\x90PV[`\0\x80`\0\x80`\0\x80`\xA0\x87\x89\x03\x12\x15a\x06\xFCW`\0\x80\xFD[\x865\x95Pa\x07\x0C` \x88\x01a\x06\xC7V[\x94P`@\x87\x015g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x07)W`\0\x80\xFD[\x81\x89\x01\x91P\x89`\x1F\x83\x01\x12a\x07=W`\0\x80\xFD[\x815\x81\x81\x11\x15a\x07LW`\0\x80\xFD[\x8A` \x82\x85\x01\x01\x11\x15a\x07^W`\0\x80\xFD[` \x83\x01\x96P\x80\x95PPPPa\x07v``\x88\x01a\x06\xC7V[\x91P`\x80\x87\x015\x90P\x92\x95P\x92\x95P\x92\x95V[\x81\x83\x827`\0\x91\x01\x90\x81R\x91\x90PV[`\0` \x82\x84\x03\x12\x15a\x07\xABW`\0\x80\xFD[PQ\x91\x90PV[`\0[\x83\x81\x10\x15a\x07\xCDW\x81\x81\x01Q\x83\x82\x01R` \x01a\x07\xB5V[PP`\0\x91\x01RV[j\x14\xDC\x1B\xDA\xD9P\xD8[\x1B\x19Y`\xAA\x1B\x81R`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x89``\x1B\x16`\x0B\x84\x01R\x87`\x1F\x84\x01R\x80\x87``\x1B\x16`?\x84\x01R\x85Qa\x08&\x81`S\x86\x01` \x8A\x01a\x07\xB2V[``\x95\x90\x95\x1B\x16\x91\x90\x93\x01`S\x81\x01\x91\x90\x91R`g\x81\x01\x91\x90\x91R`\x87\x01\x95\x94PPPPPV[`\0` \x82\x84\x03\x12\x15a\x08_W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a\x08oW`\0\x80\xFD[\x93\x92PPPV[`\0\x82Qa\x08\x88\x81\x84` \x87\x01a\x07\xB2V[\x91\x90\x91\x01\x92\x91PPV[` \x81R`\0\x82Q\x80` \x84\x01Ra\x08\xB1\x81`@\x85\x01` \x87\x01a\x07\xB2V[`\x1F\x01`\x1F\x19\x16\x91\x90\x91\x01`@\x01\x92\x91PPV\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The deployed bytecode of the contract.
    pub static SPOKECHAINEXECUTOR_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct SpokeChainExecutor<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for SpokeChainExecutor<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for SpokeChainExecutor<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for SpokeChainExecutor<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for SpokeChainExecutor<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(SpokeChainExecutor))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> SpokeChainExecutor<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                SPOKECHAINEXECUTOR_ABI.clone(),
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
                SPOKECHAINEXECUTOR_ABI.clone(),
                SPOKECHAINEXECUTOR_BYTECODE.clone().into(),
                client,
            );
            let deployer = factory.deploy(constructor_args)?;
            let deployer = ::ethers::contract::ContractDeployer::new(deployer);
            Ok(deployer)
        }
        ///Calls the contract's `callSpoke` (0x29a4d755) function
        pub fn call_spoke(
            &self,
            spoke_chain_call_intent_id: [u8; 32],
            contract_to_call: ::ethers::core::types::Address,
            call_data: ::ethers::core::types::Bytes,
            token: ::ethers::core::types::Address,
            amount: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [41, 164, 215, 85],
                    (
                        spoke_chain_call_intent_id,
                        contract_to_call,
                        call_data,
                        token,
                        amount,
                    ),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `spokeChainCallEventProver` (0xf44d7814) function
        pub fn spoke_chain_call_event_prover(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([244, 77, 120, 20], ())
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `SpokeCalled` event
        pub fn spoke_called_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, SpokeCalledFilter>
        {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, SpokeCalledFilter>
        {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for SpokeChainExecutor<M>
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
    #[ethevent(name = "SpokeCalled", abi = "SpokeCalled(address,address,uint256)")]
    pub struct SpokeCalledFilter {
        #[ethevent(indexed)]
        pub contract_to_call: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub token: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub amount: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `callSpoke` function with signature `callSpoke(bytes32,address,bytes,address,uint256)` and selector `0x29a4d755`
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
        name = "callSpoke",
        abi = "callSpoke(bytes32,address,bytes,address,uint256)"
    )]
    pub struct CallSpokeCall {
        pub spoke_chain_call_intent_id: [u8; 32],
        pub contract_to_call: ::ethers::core::types::Address,
        pub call_data: ::ethers::core::types::Bytes,
        pub token: ::ethers::core::types::Address,
        pub amount: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `spokeChainCallEventProver` function with signature `spokeChainCallEventProver()` and selector `0xf44d7814`
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
        name = "spokeChainCallEventProver",
        abi = "spokeChainCallEventProver()"
    )]
    pub struct SpokeChainCallEventProverCall;
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
    pub enum SpokeChainExecutorCalls {
        CallSpoke(CallSpokeCall),
        SpokeChainCallEventProver(SpokeChainCallEventProverCall),
    }
    impl ::ethers::core::abi::AbiDecode for SpokeChainExecutorCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <CallSpokeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CallSpoke(decoded));
            }
            if let Ok(decoded) =
                <SpokeChainCallEventProverCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SpokeChainCallEventProver(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for SpokeChainExecutorCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::CallSpoke(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SpokeChainCallEventProver(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for SpokeChainExecutorCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CallSpoke(element) => ::core::fmt::Display::fmt(element, f),
                Self::SpokeChainCallEventProver(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<CallSpokeCall> for SpokeChainExecutorCalls {
        fn from(value: CallSpokeCall) -> Self {
            Self::CallSpoke(value)
        }
    }
    impl ::core::convert::From<SpokeChainCallEventProverCall> for SpokeChainExecutorCalls {
        fn from(value: SpokeChainCallEventProverCall) -> Self {
            Self::SpokeChainCallEventProver(value)
        }
    }
    ///Container type for all return fields from the `spokeChainCallEventProver` function with signature `spokeChainCallEventProver()` and selector `0xf44d7814`
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
    pub struct SpokeChainCallEventProverReturn(pub ::ethers::core::types::Address);
}
