pub use swap_intent_filler::*;
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
pub mod swap_intent_filler {
    pub use super::super::shared_types::*;
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                    name: ::std::borrow::ToOwned::to_owned("_intentEventProver"),
                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                    internal_type: ::core::option::Option::Some(::std::borrow::ToOwned::to_owned(
                        "contract EventProver"
                    ),),
                },],
            }),
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("fillSwapIntent"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("fillSwapIntent"),
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("intent"),
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
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("filler"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("address"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("fillAmount"),
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
                    ::std::borrow::ToOwned::to_owned("intentEventProver"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("intentEventProver"),
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
                ::std::borrow::ToOwned::to_owned("Fill"),
                ::std::vec![::ethers::core::abi::ethabi::Event {
                    name: ::std::borrow::ToOwned::to_owned("Fill"),
                    inputs: ::std::vec![
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("intentId"),
                            kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize,),
                            indexed: true,
                        },
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("filler"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            indexed: true,
                        },
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("author"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Address,
                            indexed: true,
                        },
                        ::ethers::core::abi::ethabi::EventParam {
                            name: ::std::borrow::ToOwned::to_owned("fillAmount"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Uint(256usize,),
                            indexed: false,
                        },
                    ],
                    anonymous: false,
                },],
            )]),
            errors: ::core::convert::From::from([(
                ::std::borrow::ToOwned::to_owned("DeadlineExpired"),
                ::std::vec![::ethers::core::abi::ethabi::AbiError {
                    name: ::std::borrow::ToOwned::to_owned("DeadlineExpired"),
                    inputs: ::std::vec![],
                },],
            )]),
            receive: false,
            fallback: false,
        }
    }
    ///The parsed JSON ABI of the contract.
    pub static SWAPINTENTFILLER_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`@Qa\x08\xFC8\x03\x80a\x08\xFC\x839\x81\x01`@\x81\x90Ra\0/\x91a\0TV[`\0\x80T`\x01`\x01`\xA0\x1B\x03\x19\x16`\x01`\x01`\xA0\x1B\x03\x92\x90\x92\x16\x91\x90\x91\x17\x90Ua\0\x84V[`\0` \x82\x84\x03\x12\x15a\0fW`\0\x80\xFD[\x81Q`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\0}W`\0\x80\xFD[\x93\x92PPPV[a\x08i\x80a\0\x93`\09`\0\xF3\xFE`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\x006W`\x005`\xE0\x1C\x80c7>l\x84\x14a\0;W\x80c\x86\\\xB8\xC2\x14a\0PW[`\0\x80\xFD[a\0Na\0I6`\x04a\x06<V[a\0\x7FV[\0[`\0Ta\0c\x90`\x01`\x01`\xA0\x1B\x03\x16\x81V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01`@Q\x80\x91\x03\x90\xF3[a\0\x88\x83a\x01\x89V[a\0\x9C\x83`\x80\x01Q3\x85`\0\x01Q\x84a\x01\xB2V[`\0a\0\xA7\x84a\x02\x12V[`@\x80Q``\x81\x01\x82R\x82\x81R`\x01`\x01`\xA0\x1B\x03\x80\x87\x16` \x83\x01R\x91\x81\x01\x85\x90R`\0T\x92\x93P\x91\x16c\xD6k\"\xC8a\0\xE0\x83a\x02oV[`@Q\x82c\xFF\xFF\xFF\xFF\x16`\xE0\x1B\x81R`\x04\x01a\0\xFE\x91\x81R` \x01\x90V[`\0`@Q\x80\x83\x03\x81`\0\x87\x80;\x15\x80\x15a\x01\x18W`\0\x80\xFD[PZ\xF1\x15\x80\x15a\x01,W=`\0\x80>=`\0\xFD[PPPP\x84`\0\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x84`\x01`\x01`\xA0\x1B\x03\x16\x83\x7Fx\xAD~\xC0\xE9\xF8\x9Et\x01*\xFAXs\x8Bkf\x1C\x02L\xB0\xFD\x18^\xE2\xF6\x16\xC0\xA2\x89$\xBDf\x86`@Qa\x01z\x91\x81R` \x01\x90V[`@Q\x80\x91\x03\x90\xA4PPPPPV[\x80a\x01\0\x01QB\x11\x15a\x01\xAFW`@Qc\x1A\xB7\xDAk`\xE0\x1B\x81R`\x04\x01`@Q\x80\x91\x03\x90\xFD[PV[`@\x80Q`\x01`\x01`\xA0\x1B\x03\x85\x81\x16`$\x83\x01R\x84\x16`D\x82\x01R`d\x80\x82\x01\x84\x90R\x82Q\x80\x83\x03\x90\x91\x01\x81R`\x84\x90\x91\x01\x90\x91R` \x81\x01\x80Q`\x01`\x01`\xE0\x1B\x03\x16c#\xB8r\xDD`\xE0\x1B\x17\x90Ra\x02\x0C\x90\x85\x90a\x02\xD0V[PPPPV[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q`\xC0\x89\x01Q`\xE0\x8A\x01Qa\x01\0\x8B\x01Q\x96Q`\0\x9Aa\x02R\x9A\x90\x99\x98\x91\x01a\x07^V[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0\x81`\0\x01Q\x82` \x01Q\x83`@\x01Q`@Q` \x01a\x02R\x93\x92\x91\x90o\x14\xDD\xD8\\\x12[\x9D\x19[\x9D\x11\x9A[\x1B\x19Y`\x82\x1B\x81R`\x10\x81\x01\x93\x90\x93R``\x91\x90\x91\x1Bk\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x16`0\x83\x01R`D\x82\x01R`d\x01\x90V[`\0a\x03%\x82`@Q\x80`@\x01`@R\x80` \x81R` \x01\x7FSafeERC20: low-level call failed\x81RP\x85`\x01`\x01`\xA0\x1B\x03\x16a\x03\xAF\x90\x92\x91\x90c\xFF\xFF\xFF\xFF\x16V[\x90P\x80Q`\0\x14\x80a\x03FWP\x80\x80` \x01\x90Q\x81\x01\x90a\x03F\x91\x90a\x07\xE4V[a\x03\xAAW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`*`$\x82\x01R\x7FSafeERC20: ERC20 operation did n`D\x82\x01Ri\x1B\xDD\x08\x1C\xDDX\xD8\xD9YY`\xB2\x1B`d\x82\x01R`\x84\x01[`@Q\x80\x91\x03\x90\xFD[PPPV[``a\x03\xBE\x84\x84`\0\x85a\x03\xC6V[\x94\x93PPPPV[``\x82G\x10\x15a\x04'W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FAddress: insufficient balance fo`D\x82\x01Re\x1C\x88\x18\xD8[\x1B`\xD2\x1B`d\x82\x01R`\x84\x01a\x03\xA1V[`\0\x80\x86`\x01`\x01`\xA0\x1B\x03\x16\x85\x87`@Qa\x04C\x91\x90a\x08\rV[`\0`@Q\x80\x83\x03\x81\x85\x87Z\xF1\x92PPP=\x80`\0\x81\x14a\x04\x80W`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x04\x85V[``\x91P[P\x91P\x91Pa\x04\x96\x87\x83\x83\x87a\x04\xA1V[\x97\x96PPPPPPPV[``\x83\x15a\x05\x10W\x82Q`\0\x03a\x05\tW`\x01`\x01`\xA0\x1B\x03\x85\x16;a\x05\tW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1D`$\x82\x01R\x7FAddress: call to non-contract\0\0\0`D\x82\x01R`d\x01a\x03\xA1V[P\x81a\x03\xBEV[a\x03\xBE\x83\x83\x81Q\x15a\x05%W\x81Q\x80\x83` \x01\xFD[\x80`@QbF\x1B\xCD`\xE5\x1B\x81R`\x04\x01a\x03\xA1\x91\x90a\x08)V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@Qa\x01 \x81\x01g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x82\x82\x10\x17\x15a\x05yWa\x05ya\x05?V[`@R\x90V[\x805`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x05\x96W`\0\x80\xFD[\x91\x90PV[\x805c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\x05\x96W`\0\x80\xFD[`\0\x82`\x1F\x83\x01\x12a\x05\xC0W`\0\x80\xFD[\x815g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x05\xDBWa\x05\xDBa\x05?V[`@Q`\x1F\x83\x01`\x1F\x19\x90\x81\x16`?\x01\x16\x81\x01\x90\x82\x82\x11\x81\x83\x10\x17\x15a\x06\x03Wa\x06\x03a\x05?V[\x81`@R\x83\x81R\x86` \x85\x88\x01\x01\x11\x15a\x06\x1CW`\0\x80\xFD[\x83` \x87\x01` \x83\x017`\0` \x85\x83\x01\x01R\x80\x94PPPPP\x92\x91PPV[`\0\x80`\0``\x84\x86\x03\x12\x15a\x06QW`\0\x80\xFD[\x835g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x06iW`\0\x80\xFD[\x90\x85\x01\x90a\x01 \x82\x88\x03\x12\x15a\x06~W`\0\x80\xFD[a\x06\x86a\x05UV[a\x06\x8F\x83a\x05\x7FV[\x81Ra\x06\x9D` \x84\x01a\x05\x9BV[` \x82\x01Ra\x06\xAE`@\x84\x01a\x05\x9BV[`@\x82\x01Ra\x06\xBF``\x84\x01a\x05\x7FV[``\x82\x01Ra\x06\xD0`\x80\x84\x01a\x05\x7FV[`\x80\x82\x01R`\xA0\x83\x015`\xA0\x82\x01R`\xC0\x83\x015\x82\x81\x11\x15a\x06\xF1W`\0\x80\xFD[a\x06\xFD\x89\x82\x86\x01a\x05\xAFV[`\xC0\x83\x01RP`\xE0\x83\x81\x015\x90\x82\x01Ra\x01\0\x92\x83\x015\x92\x81\x01\x92\x90\x92RP\x92Pa\x07*` \x85\x01a\x05\x7FV[\x91P`@\x84\x015\x90P\x92P\x92P\x92V[`\0[\x83\x81\x10\x15a\x07UW\x81\x81\x01Q\x83\x82\x01R` \x01a\x07=V[PP`\0\x91\x01RV[`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x8C``\x1B\x16\x83Rc\xFF\xFF\xFF\xFF`\xE0\x1B\x80\x8C`\xE0\x1B\x16`\x14\x85\x01R\x80\x8B`\xE0\x1B\x16`\x18\x85\x01RP\x80\x89``\x1B\x16`\x1C\x84\x01R\x80\x88``\x1B\x16`0\x84\x01RP\x85`D\x83\x01R\x84Qa\x07\xC5\x81`d\x85\x01` \x89\x01a\x07:V[\x90\x91\x01`d\x81\x01\x93\x90\x93RP`\x84\x82\x01R`\xA4\x01\x97\x96PPPPPPPV[`\0` \x82\x84\x03\x12\x15a\x07\xF6W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a\x08\x06W`\0\x80\xFD[\x93\x92PPPV[`\0\x82Qa\x08\x1F\x81\x84` \x87\x01a\x07:V[\x91\x90\x91\x01\x92\x91PPV[` \x81R`\0\x82Q\x80` \x84\x01Ra\x08H\x81`@\x85\x01` \x87\x01a\x07:V[`\x1F\x01`\x1F\x19\x16\x91\x90\x91\x01`@\x01\x92\x91PPV\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The bytecode of the contract.
    pub static SWAPINTENTFILLER_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\x006W`\x005`\xE0\x1C\x80c7>l\x84\x14a\0;W\x80c\x86\\\xB8\xC2\x14a\0PW[`\0\x80\xFD[a\0Na\0I6`\x04a\x06<V[a\0\x7FV[\0[`\0Ta\0c\x90`\x01`\x01`\xA0\x1B\x03\x16\x81V[`@Q`\x01`\x01`\xA0\x1B\x03\x90\x91\x16\x81R` \x01`@Q\x80\x91\x03\x90\xF3[a\0\x88\x83a\x01\x89V[a\0\x9C\x83`\x80\x01Q3\x85`\0\x01Q\x84a\x01\xB2V[`\0a\0\xA7\x84a\x02\x12V[`@\x80Q``\x81\x01\x82R\x82\x81R`\x01`\x01`\xA0\x1B\x03\x80\x87\x16` \x83\x01R\x91\x81\x01\x85\x90R`\0T\x92\x93P\x91\x16c\xD6k\"\xC8a\0\xE0\x83a\x02oV[`@Q\x82c\xFF\xFF\xFF\xFF\x16`\xE0\x1B\x81R`\x04\x01a\0\xFE\x91\x81R` \x01\x90V[`\0`@Q\x80\x83\x03\x81`\0\x87\x80;\x15\x80\x15a\x01\x18W`\0\x80\xFD[PZ\xF1\x15\x80\x15a\x01,W=`\0\x80>=`\0\xFD[PPPP\x84`\0\x01Q`\x01`\x01`\xA0\x1B\x03\x16\x84`\x01`\x01`\xA0\x1B\x03\x16\x83\x7Fx\xAD~\xC0\xE9\xF8\x9Et\x01*\xFAXs\x8Bkf\x1C\x02L\xB0\xFD\x18^\xE2\xF6\x16\xC0\xA2\x89$\xBDf\x86`@Qa\x01z\x91\x81R` \x01\x90V[`@Q\x80\x91\x03\x90\xA4PPPPPV[\x80a\x01\0\x01QB\x11\x15a\x01\xAFW`@Qc\x1A\xB7\xDAk`\xE0\x1B\x81R`\x04\x01`@Q\x80\x91\x03\x90\xFD[PV[`@\x80Q`\x01`\x01`\xA0\x1B\x03\x85\x81\x16`$\x83\x01R\x84\x16`D\x82\x01R`d\x80\x82\x01\x84\x90R\x82Q\x80\x83\x03\x90\x91\x01\x81R`\x84\x90\x91\x01\x90\x91R` \x81\x01\x80Q`\x01`\x01`\xE0\x1B\x03\x16c#\xB8r\xDD`\xE0\x1B\x17\x90Ra\x02\x0C\x90\x85\x90a\x02\xD0V[PPPPV[\x80Q` \x80\x83\x01Q`@\x80\x85\x01Q``\x86\x01Q`\x80\x87\x01Q`\xA0\x88\x01Q`\xC0\x89\x01Q`\xE0\x8A\x01Qa\x01\0\x8B\x01Q\x96Q`\0\x9Aa\x02R\x9A\x90\x99\x98\x91\x01a\x07^V[`@Q` \x81\x83\x03\x03\x81R\x90`@R\x80Q\x90` \x01 \x90P\x91\x90PV[`\0\x81`\0\x01Q\x82` \x01Q\x83`@\x01Q`@Q` \x01a\x02R\x93\x92\x91\x90o\x14\xDD\xD8\\\x12[\x9D\x19[\x9D\x11\x9A[\x1B\x19Y`\x82\x1B\x81R`\x10\x81\x01\x93\x90\x93R``\x91\x90\x91\x1Bk\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x16`0\x83\x01R`D\x82\x01R`d\x01\x90V[`\0a\x03%\x82`@Q\x80`@\x01`@R\x80` \x81R` \x01\x7FSafeERC20: low-level call failed\x81RP\x85`\x01`\x01`\xA0\x1B\x03\x16a\x03\xAF\x90\x92\x91\x90c\xFF\xFF\xFF\xFF\x16V[\x90P\x80Q`\0\x14\x80a\x03FWP\x80\x80` \x01\x90Q\x81\x01\x90a\x03F\x91\x90a\x07\xE4V[a\x03\xAAW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`*`$\x82\x01R\x7FSafeERC20: ERC20 operation did n`D\x82\x01Ri\x1B\xDD\x08\x1C\xDDX\xD8\xD9YY`\xB2\x1B`d\x82\x01R`\x84\x01[`@Q\x80\x91\x03\x90\xFD[PPPV[``a\x03\xBE\x84\x84`\0\x85a\x03\xC6V[\x94\x93PPPPV[``\x82G\x10\x15a\x04'W`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`&`$\x82\x01R\x7FAddress: insufficient balance fo`D\x82\x01Re\x1C\x88\x18\xD8[\x1B`\xD2\x1B`d\x82\x01R`\x84\x01a\x03\xA1V[`\0\x80\x86`\x01`\x01`\xA0\x1B\x03\x16\x85\x87`@Qa\x04C\x91\x90a\x08\rV[`\0`@Q\x80\x83\x03\x81\x85\x87Z\xF1\x92PPP=\x80`\0\x81\x14a\x04\x80W`@Q\x91P`\x1F\x19`?=\x01\x16\x82\x01`@R=\x82R=`\0` \x84\x01>a\x04\x85V[``\x91P[P\x91P\x91Pa\x04\x96\x87\x83\x83\x87a\x04\xA1V[\x97\x96PPPPPPPV[``\x83\x15a\x05\x10W\x82Q`\0\x03a\x05\tW`\x01`\x01`\xA0\x1B\x03\x85\x16;a\x05\tW`@QbF\x1B\xCD`\xE5\x1B\x81R` `\x04\x82\x01R`\x1D`$\x82\x01R\x7FAddress: call to non-contract\0\0\0`D\x82\x01R`d\x01a\x03\xA1V[P\x81a\x03\xBEV[a\x03\xBE\x83\x83\x81Q\x15a\x05%W\x81Q\x80\x83` \x01\xFD[\x80`@QbF\x1B\xCD`\xE5\x1B\x81R`\x04\x01a\x03\xA1\x91\x90a\x08)V[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`@Qa\x01 \x81\x01g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x82\x82\x10\x17\x15a\x05yWa\x05ya\x05?V[`@R\x90V[\x805`\x01`\x01`\xA0\x1B\x03\x81\x16\x81\x14a\x05\x96W`\0\x80\xFD[\x91\x90PV[\x805c\xFF\xFF\xFF\xFF\x81\x16\x81\x14a\x05\x96W`\0\x80\xFD[`\0\x82`\x1F\x83\x01\x12a\x05\xC0W`\0\x80\xFD[\x815g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x05\xDBWa\x05\xDBa\x05?V[`@Q`\x1F\x83\x01`\x1F\x19\x90\x81\x16`?\x01\x16\x81\x01\x90\x82\x82\x11\x81\x83\x10\x17\x15a\x06\x03Wa\x06\x03a\x05?V[\x81`@R\x83\x81R\x86` \x85\x88\x01\x01\x11\x15a\x06\x1CW`\0\x80\xFD[\x83` \x87\x01` \x83\x017`\0` \x85\x83\x01\x01R\x80\x94PPPPP\x92\x91PPV[`\0\x80`\0``\x84\x86\x03\x12\x15a\x06QW`\0\x80\xFD[\x835g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x06iW`\0\x80\xFD[\x90\x85\x01\x90a\x01 \x82\x88\x03\x12\x15a\x06~W`\0\x80\xFD[a\x06\x86a\x05UV[a\x06\x8F\x83a\x05\x7FV[\x81Ra\x06\x9D` \x84\x01a\x05\x9BV[` \x82\x01Ra\x06\xAE`@\x84\x01a\x05\x9BV[`@\x82\x01Ra\x06\xBF``\x84\x01a\x05\x7FV[``\x82\x01Ra\x06\xD0`\x80\x84\x01a\x05\x7FV[`\x80\x82\x01R`\xA0\x83\x015`\xA0\x82\x01R`\xC0\x83\x015\x82\x81\x11\x15a\x06\xF1W`\0\x80\xFD[a\x06\xFD\x89\x82\x86\x01a\x05\xAFV[`\xC0\x83\x01RP`\xE0\x83\x81\x015\x90\x82\x01Ra\x01\0\x92\x83\x015\x92\x81\x01\x92\x90\x92RP\x92Pa\x07*` \x85\x01a\x05\x7FV[\x91P`@\x84\x015\x90P\x92P\x92P\x92V[`\0[\x83\x81\x10\x15a\x07UW\x81\x81\x01Q\x83\x82\x01R` \x01a\x07=V[PP`\0\x91\x01RV[`\0k\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x19\x80\x8C``\x1B\x16\x83Rc\xFF\xFF\xFF\xFF`\xE0\x1B\x80\x8C`\xE0\x1B\x16`\x14\x85\x01R\x80\x8B`\xE0\x1B\x16`\x18\x85\x01RP\x80\x89``\x1B\x16`\x1C\x84\x01R\x80\x88``\x1B\x16`0\x84\x01RP\x85`D\x83\x01R\x84Qa\x07\xC5\x81`d\x85\x01` \x89\x01a\x07:V[\x90\x91\x01`d\x81\x01\x93\x90\x93RP`\x84\x82\x01R`\xA4\x01\x97\x96PPPPPPPV[`\0` \x82\x84\x03\x12\x15a\x07\xF6W`\0\x80\xFD[\x81Q\x80\x15\x15\x81\x14a\x08\x06W`\0\x80\xFD[\x93\x92PPPV[`\0\x82Qa\x08\x1F\x81\x84` \x87\x01a\x07:V[\x91\x90\x91\x01\x92\x91PPV[` \x81R`\0\x82Q\x80` \x84\x01Ra\x08H\x81`@\x85\x01` \x87\x01a\x07:V[`\x1F\x01`\x1F\x19\x16\x91\x90\x91\x01`@\x01\x92\x91PPV\xFE\xA1dsolcC\0\x08\x13\0\n";
    /// The deployed bytecode of the contract.
    pub static SWAPINTENTFILLER_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct SwapIntentFiller<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for SwapIntentFiller<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for SwapIntentFiller<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for SwapIntentFiller<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for SwapIntentFiller<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(SwapIntentFiller))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> SwapIntentFiller<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                SWAPINTENTFILLER_ABI.clone(),
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
                SWAPINTENTFILLER_ABI.clone(),
                SWAPINTENTFILLER_BYTECODE.clone().into(),
                client,
            );
            let deployer = factory.deploy(constructor_args)?;
            let deployer = ::ethers::contract::ContractDeployer::new(deployer);
            Ok(deployer)
        }
        ///Calls the contract's `fillSwapIntent` (0x373e6c84) function
        pub fn fill_swap_intent(
            &self,
            intent: SwapIntent,
            filler: ::ethers::core::types::Address,
            fill_amount: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([55, 62, 108, 132], (intent, filler, fill_amount))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `intentEventProver` (0x865cb8c2) function
        pub fn intent_event_prover(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([134, 92, 184, 194], ())
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `Fill` event
        pub fn fill_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, FillFilter> {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, FillFilter> {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for SwapIntentFiller<M>
    {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    ///Custom Error type `DeadlineExpired` with signature `DeadlineExpired()` and selector `0x1ab7da6b`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        serde::Serialize,
        serde::Deserialize,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[etherror(name = "DeadlineExpired", abi = "DeadlineExpired()")]
    pub struct DeadlineExpired;
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
    #[ethevent(name = "Fill", abi = "Fill(bytes32,address,address,uint256)")]
    pub struct FillFilter {
        #[ethevent(indexed)]
        pub intent_id: [u8; 32],
        #[ethevent(indexed)]
        pub filler: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub author: ::ethers::core::types::Address,
        pub fill_amount: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `fillSwapIntent` function with signature `fillSwapIntent((address,uint32,uint32,address,address,uint256,bytes,uint256,uint256),address,uint256)` and selector `0x373e6c84`
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
        name = "fillSwapIntent",
        abi = "fillSwapIntent((address,uint32,uint32,address,address,uint256,bytes,uint256,uint256),address,uint256)"
    )]
    pub struct FillSwapIntentCall {
        pub intent: SwapIntent,
        pub filler: ::ethers::core::types::Address,
        pub fill_amount: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `intentEventProver` function with signature `intentEventProver()` and selector `0x865cb8c2`
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
    #[ethcall(name = "intentEventProver", abi = "intentEventProver()")]
    pub struct IntentEventProverCall;
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
    pub enum SwapIntentFillerCalls {
        FillSwapIntent(FillSwapIntentCall),
        IntentEventProver(IntentEventProverCall),
    }
    impl ::ethers::core::abi::AbiDecode for SwapIntentFillerCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) =
                <FillSwapIntentCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::FillSwapIntent(decoded));
            }
            if let Ok(decoded) =
                <IntentEventProverCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IntentEventProver(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for SwapIntentFillerCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::FillSwapIntent(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IntentEventProver(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for SwapIntentFillerCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::FillSwapIntent(element) => ::core::fmt::Display::fmt(element, f),
                Self::IntentEventProver(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<FillSwapIntentCall> for SwapIntentFillerCalls {
        fn from(value: FillSwapIntentCall) -> Self {
            Self::FillSwapIntent(value)
        }
    }
    impl ::core::convert::From<IntentEventProverCall> for SwapIntentFillerCalls {
        fn from(value: IntentEventProverCall) -> Self {
            Self::IntentEventProver(value)
        }
    }
    ///Container type for all return fields from the `intentEventProver` function with signature `intentEventProver()` and selector `0x865cb8c2`
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
    pub struct IntentEventProverReturn(pub ::ethers::core::types::Address);
}
