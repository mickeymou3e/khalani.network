pub use test_ism::*;
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
pub mod test_ism {
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                    name: ::std::borrow::ToOwned::to_owned("_requiredMetadata"),
                    kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                    internal_type: ::core::option::Option::Some(::std::borrow::ToOwned::to_owned(
                        "bytes"
                    ),),
                },],
            }),
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("moduleType"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("moduleType"),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Uint(8usize),
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("uint8"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("requiredMetadata"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("requiredMetadata"),
                        inputs: ::std::vec![],
                        outputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::string::String::new(),
                            kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes"),
                            ),
                        },],
                        constant: ::core::option::Option::None,
                        state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                    },],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("setRequiredMetadata"),
                    ::std::vec![::ethers::core::abi::ethabi::Function {
                        name: ::std::borrow::ToOwned::to_owned("setRequiredMetadata",),
                        inputs: ::std::vec![::ethers::core::abi::ethabi::Param {
                            name: ::std::borrow::ToOwned::to_owned("_requiredMetadata"),
                            kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                            internal_type: ::core::option::Option::Some(
                                ::std::borrow::ToOwned::to_owned("bytes"),
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
                        inputs: ::std::vec![
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::borrow::ToOwned::to_owned("_metadata"),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
                                ),
                            },
                            ::ethers::core::abi::ethabi::Param {
                                name: ::std::string::String::new(),
                                kind: ::ethers::core::abi::ethabi::ParamType::Bytes,
                                internal_type: ::core::option::Option::Some(
                                    ::std::borrow::ToOwned::to_owned("bytes"),
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
            ]),
            events: ::std::collections::BTreeMap::new(),
            errors: ::std::collections::BTreeMap::new(),
            receive: false,
            fallback: false,
        }
    }
    ///The parsed JSON ABI of the contract.
    pub static TESTISM_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(__abi);
    #[rustfmt::skip]
    const __BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`@Qb\0\x08\xDF8\x03\x80b\0\x08\xDF\x839\x81\x01`@\x81\x90Ra\x001\x91a\0fV[a\0:\x81a\0@V[Pa\x02}V[`\0a\0L\x82\x82a\x01\xBEV[PPV[cNH{q`\xE0\x1B`\0R`A`\x04R`$`\0\xFD[`\0` \x80\x83\x85\x03\x12\x15a\0yW`\0\x80\xFD[\x82Q`\x01`\x01`@\x1B\x03\x80\x82\x11\x15a\0\x90W`\0\x80\xFD[\x81\x85\x01\x91P\x85`\x1F\x83\x01\x12a\0\xA4W`\0\x80\xFD[\x81Q\x81\x81\x11\x15a\0\xB6Wa\0\xB6a\0PV[`@Q`\x1F\x82\x01`\x1F\x19\x90\x81\x16`?\x01\x16\x81\x01\x90\x83\x82\x11\x81\x83\x10\x17\x15a\0\xDEWa\0\xDEa\0PV[\x81`@R\x82\x81R\x88\x86\x84\x87\x01\x01\x11\x15a\0\xF6W`\0\x80\xFD[`\0\x93P[\x82\x84\x10\x15a\x01\x18W\x84\x84\x01\x86\x01Q\x81\x85\x01\x87\x01R\x92\x85\x01\x92a\0\xFBV[\x82\x84\x11\x15a\x01)W`\0\x86\x84\x83\x01\x01R[\x98\x97PPPPPPPPV[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x01IW`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x01iWcNH{q`\xE0\x1B`\0R`\"`\x04R`$`\0\xFD[P\x91\x90PV[`\x1F\x82\x11\x15a\x01\xB9W`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x01\x96WP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x01\xB5W\x82\x81U`\x01\x01a\x01\xA2V[PPP[PPPV[\x81Q`\x01`\x01`@\x1B\x03\x81\x11\x15a\x01\xD7Wa\x01\xD7a\0PV[a\x01\xEB\x81a\x01\xE5\x84Ta\x015V[\x84a\x01oV[` \x80`\x1F\x83\x11`\x01\x81\x14a\x02 W`\0\x84\x15a\x02\x08WP\x85\x83\x01Q[`\0\x19`\x03\x86\x90\x1B\x1C\x19\x16`\x01\x85\x90\x1B\x17\x85Ua\x01\xB5V[`\0\x85\x81R` \x81 `\x1F\x19\x86\x16\x91[\x82\x81\x10\x15a\x02OW\x88\x86\x01Q\x82U\x94\x84\x01\x94`\x01\x90\x91\x01\x90\x84\x01a\x020V[P\x85\x82\x10\x15a\x02mW\x87\x85\x01Q`\0\x19`\x03\x88\x90\x1B`\xF8\x16\x1C\x19\x16\x81U[PPPPP`\x01\x90\x81\x1B\x01\x90UPV[a\x06R\x80b\0\x02\x8D`\09`\0\xF3\xFE`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\0LW`\x005`\xE0\x1C\x80cde\xE6\x9F\x14a\0QW\x80c\x88$/\xA0\x14a\0pW\x80c\x89A\x87\xCE\x14a\0\x85W\x80c\xF7\xE8:\xEE\x14a\0\x9AW[`\0\x80\xFD[a\0Y`\0\x81V[`@Q`\xFF\x90\x91\x16\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\0xa\0\xBDV[`@Qa\0g\x91\x90a\x01\x96V[a\0\x98a\0\x936`\x04a\x028V[a\x01KV[\0[a\0\xADa\0\xA86`\x04a\x03PV[a\x01[V[`@Q\x90\x15\x15\x81R` \x01a\0gV[`\0\x80Ta\0\xCA\x90a\x03\xBCV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\0\xF6\x90a\x03\xBCV[\x80\x15a\x01CW\x80`\x1F\x10a\x01\x18Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x01CV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x01&W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81V[`\0a\x01W\x82\x82a\x04^V[PPV[`\0\x80`@Qa\x01k\x91\x90a\x05xV[`@Q\x80\x91\x03\x90 \x85\x85`@Qa\x01\x83\x92\x91\x90a\x06\x0CV[`@Q\x80\x91\x03\x90 \x14\x90P\x94\x93PPPPV[`\0` \x80\x83R\x83Q\x80\x82\x85\x01R`\0[\x81\x81\x10\x15a\x01\xC3W\x85\x81\x01\x83\x01Q\x85\x82\x01`@\x01R\x82\x01a\x01\xA7V[\x81\x81\x11\x15a\x01\xD5W`\0`@\x83\x87\x01\x01R[P`\x1F\x01\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xE0\x16\x92\x90\x92\x01`@\x01\x93\x92PPPV[\x7FNH{q\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`\0R`A`\x04R`$`\0\xFD[`\0` \x82\x84\x03\x12\x15a\x02JW`\0\x80\xFD[\x815g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x02bW`\0\x80\xFD[\x81\x84\x01\x91P\x84`\x1F\x83\x01\x12a\x02vW`\0\x80\xFD[\x815\x81\x81\x11\x15a\x02\x88Wa\x02\x88a\x02\tV[`@Q`\x1F\x82\x01\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xE0\x90\x81\x16`?\x01\x16\x81\x01\x90\x83\x82\x11\x81\x83\x10\x17\x15a\x02\xCEWa\x02\xCEa\x02\tV[\x81`@R\x82\x81R\x87` \x84\x87\x01\x01\x11\x15a\x02\xE7W`\0\x80\xFD[\x82` \x86\x01` \x83\x017`\0\x92\x81\x01` \x01\x92\x90\x92RP\x95\x94PPPPPV[`\0\x80\x83`\x1F\x84\x01\x12a\x03\x19W`\0\x80\xFD[P\x815g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x15a\x031W`\0\x80\xFD[` \x83\x01\x91P\x83` \x82\x85\x01\x01\x11\x15a\x03IW`\0\x80\xFD[\x92P\x92\x90PV[`\0\x80`\0\x80`@\x85\x87\x03\x12\x15a\x03fW`\0\x80\xFD[\x845g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x03~W`\0\x80\xFD[a\x03\x8A\x88\x83\x89\x01a\x03\x07V[\x90\x96P\x94P` \x87\x015\x91P\x80\x82\x11\x15a\x03\xA3W`\0\x80\xFD[Pa\x03\xB0\x87\x82\x88\x01a\x03\x07V[\x95\x98\x94\x97P\x95PPPPV[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x03\xD0W`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x04\tW\x7FNH{q\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`\0R`\"`\x04R`$`\0\xFD[P\x91\x90PV[`\x1F\x82\x11\x15a\x04YW`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x046WP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x04UW\x82\x81U`\x01\x01a\x04BV[PPP[PPPV[\x81Qg\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x15a\x04xWa\x04xa\x02\tV[a\x04\x8C\x81a\x04\x86\x84Ta\x03\xBCV[\x84a\x04\x0FV[` \x80`\x1F\x83\x11`\x01\x81\x14a\x04\xDFW`\0\x84\x15a\x04\xA9WP\x85\x83\x01Q[\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\x03\x86\x90\x1B\x1C\x19\x16`\x01\x85\x90\x1B\x17\x85Ua\x04UV[`\0\x85\x81R` \x81 \x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xE0\x86\x16\x91[\x82\x81\x10\x15a\x05,W\x88\x86\x01Q\x82U\x94\x84\x01\x94`\x01\x90\x91\x01\x90\x84\x01a\x05\rV[P\x85\x82\x10\x15a\x05hW\x87\x85\x01Q\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\x03\x88\x90\x1B`\xF8\x16\x1C\x19\x16\x81U[PPPPP`\x01\x90\x81\x1B\x01\x90UPV[`\0\x80\x83Ta\x05\x86\x81a\x03\xBCV[`\x01\x82\x81\x16\x80\x15a\x05\x9EW`\x01\x81\x14a\x05\xD1Wa\x06\0V[\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\0\x84\x16\x87R\x82\x15\x15\x83\x02\x87\x01\x94Pa\x06\0V[\x87`\0R` \x80`\0 `\0[\x85\x81\x10\x15a\x05\xF7W\x81T\x8A\x82\x01R\x90\x84\x01\x90\x82\x01a\x05\xDEV[PPP\x82\x87\x01\x94P[P\x92\x96\x95PPPPPPV[\x81\x83\x827`\0\x91\x01\x90\x81R\x91\x90PV\xFE\xA2dipfsX\"\x12 O\xDB\x98i\x83m\xF3\x90\xC3\xE3\n\xF9s\x9AGbj\x94\x1AB\xE0\x95\x1E\xF5\x10\xB2\xD789\x04\x8B\x07dsolcC\0\x08\x0F\x003";
    /// The bytecode of the contract.
    pub static TESTISM_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__BYTECODE);
    #[rustfmt::skip]
    const __DEPLOYED_BYTECODE: &[u8] = b"`\x80`@R4\x80\x15a\0\x10W`\0\x80\xFD[P`\x046\x10a\0LW`\x005`\xE0\x1C\x80cde\xE6\x9F\x14a\0QW\x80c\x88$/\xA0\x14a\0pW\x80c\x89A\x87\xCE\x14a\0\x85W\x80c\xF7\xE8:\xEE\x14a\0\x9AW[`\0\x80\xFD[a\0Y`\0\x81V[`@Q`\xFF\x90\x91\x16\x81R` \x01[`@Q\x80\x91\x03\x90\xF3[a\0xa\0\xBDV[`@Qa\0g\x91\x90a\x01\x96V[a\0\x98a\0\x936`\x04a\x028V[a\x01KV[\0[a\0\xADa\0\xA86`\x04a\x03PV[a\x01[V[`@Q\x90\x15\x15\x81R` \x01a\0gV[`\0\x80Ta\0\xCA\x90a\x03\xBCV[\x80`\x1F\x01` \x80\x91\x04\x02` \x01`@Q\x90\x81\x01`@R\x80\x92\x91\x90\x81\x81R` \x01\x82\x80Ta\0\xF6\x90a\x03\xBCV[\x80\x15a\x01CW\x80`\x1F\x10a\x01\x18Wa\x01\0\x80\x83T\x04\x02\x83R\x91` \x01\x91a\x01CV[\x82\x01\x91\x90`\0R` `\0 \x90[\x81T\x81R\x90`\x01\x01\x90` \x01\x80\x83\x11a\x01&W\x82\x90\x03`\x1F\x16\x82\x01\x91[PPPPP\x81V[`\0a\x01W\x82\x82a\x04^V[PPV[`\0\x80`@Qa\x01k\x91\x90a\x05xV[`@Q\x80\x91\x03\x90 \x85\x85`@Qa\x01\x83\x92\x91\x90a\x06\x0CV[`@Q\x80\x91\x03\x90 \x14\x90P\x94\x93PPPPV[`\0` \x80\x83R\x83Q\x80\x82\x85\x01R`\0[\x81\x81\x10\x15a\x01\xC3W\x85\x81\x01\x83\x01Q\x85\x82\x01`@\x01R\x82\x01a\x01\xA7V[\x81\x81\x11\x15a\x01\xD5W`\0`@\x83\x87\x01\x01R[P`\x1F\x01\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xE0\x16\x92\x90\x92\x01`@\x01\x93\x92PPPV[\x7FNH{q\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`\0R`A`\x04R`$`\0\xFD[`\0` \x82\x84\x03\x12\x15a\x02JW`\0\x80\xFD[\x815g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x02bW`\0\x80\xFD[\x81\x84\x01\x91P\x84`\x1F\x83\x01\x12a\x02vW`\0\x80\xFD[\x815\x81\x81\x11\x15a\x02\x88Wa\x02\x88a\x02\tV[`@Q`\x1F\x82\x01\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xE0\x90\x81\x16`?\x01\x16\x81\x01\x90\x83\x82\x11\x81\x83\x10\x17\x15a\x02\xCEWa\x02\xCEa\x02\tV[\x81`@R\x82\x81R\x87` \x84\x87\x01\x01\x11\x15a\x02\xE7W`\0\x80\xFD[\x82` \x86\x01` \x83\x017`\0\x92\x81\x01` \x01\x92\x90\x92RP\x95\x94PPPPPV[`\0\x80\x83`\x1F\x84\x01\x12a\x03\x19W`\0\x80\xFD[P\x815g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x15a\x031W`\0\x80\xFD[` \x83\x01\x91P\x83` \x82\x85\x01\x01\x11\x15a\x03IW`\0\x80\xFD[\x92P\x92\x90PV[`\0\x80`\0\x80`@\x85\x87\x03\x12\x15a\x03fW`\0\x80\xFD[\x845g\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x80\x82\x11\x15a\x03~W`\0\x80\xFD[a\x03\x8A\x88\x83\x89\x01a\x03\x07V[\x90\x96P\x94P` \x87\x015\x91P\x80\x82\x11\x15a\x03\xA3W`\0\x80\xFD[Pa\x03\xB0\x87\x82\x88\x01a\x03\x07V[\x95\x98\x94\x97P\x95PPPPV[`\x01\x81\x81\x1C\x90\x82\x16\x80a\x03\xD0W`\x7F\x82\x16\x91P[` \x82\x10\x81\x03a\x04\tW\x7FNH{q\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0`\0R`\"`\x04R`$`\0\xFD[P\x91\x90PV[`\x1F\x82\x11\x15a\x04YW`\0\x81\x81R` \x81 `\x1F\x85\x01`\x05\x1C\x81\x01` \x86\x10\x15a\x046WP\x80[`\x1F\x85\x01`\x05\x1C\x82\x01\x91P[\x81\x81\x10\x15a\x04UW\x82\x81U`\x01\x01a\x04BV[PPP[PPPV[\x81Qg\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\x81\x11\x15a\x04xWa\x04xa\x02\tV[a\x04\x8C\x81a\x04\x86\x84Ta\x03\xBCV[\x84a\x04\x0FV[` \x80`\x1F\x83\x11`\x01\x81\x14a\x04\xDFW`\0\x84\x15a\x04\xA9WP\x85\x83\x01Q[\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\x03\x86\x90\x1B\x1C\x19\x16`\x01\x85\x90\x1B\x17\x85Ua\x04UV[`\0\x85\x81R` \x81 \x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xE0\x86\x16\x91[\x82\x81\x10\x15a\x05,W\x88\x86\x01Q\x82U\x94\x84\x01\x94`\x01\x90\x91\x01\x90\x84\x01a\x05\rV[P\x85\x82\x10\x15a\x05hW\x87\x85\x01Q\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF`\x03\x88\x90\x1B`\xF8\x16\x1C\x19\x16\x81U[PPPPP`\x01\x90\x81\x1B\x01\x90UPV[`\0\x80\x83Ta\x05\x86\x81a\x03\xBCV[`\x01\x82\x81\x16\x80\x15a\x05\x9EW`\x01\x81\x14a\x05\xD1Wa\x06\0V[\x7F\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\0\x84\x16\x87R\x82\x15\x15\x83\x02\x87\x01\x94Pa\x06\0V[\x87`\0R` \x80`\0 `\0[\x85\x81\x10\x15a\x05\xF7W\x81T\x8A\x82\x01R\x90\x84\x01\x90\x82\x01a\x05\xDEV[PPP\x82\x87\x01\x94P[P\x92\x96\x95PPPPPPV[\x81\x83\x827`\0\x91\x01\x90\x81R\x91\x90PV\xFE\xA2dipfsX\"\x12 O\xDB\x98i\x83m\xF3\x90\xC3\xE3\n\xF9s\x9AGbj\x94\x1AB\xE0\x95\x1E\xF5\x10\xB2\xD789\x04\x8B\x07dsolcC\0\x08\x0F\x003";
    /// The deployed bytecode of the contract.
    pub static TESTISM_DEPLOYED_BYTECODE: ::ethers::core::types::Bytes =
        ::ethers::core::types::Bytes::from_static(__DEPLOYED_BYTECODE);
    pub struct TestIsm<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for TestIsm<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for TestIsm<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for TestIsm<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for TestIsm<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(::core::stringify!(TestIsm))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> TestIsm<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                TESTISM_ABI.clone(),
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
                TESTISM_ABI.clone(),
                TESTISM_BYTECODE.clone().into(),
                client,
            );
            let deployer = factory.deploy(constructor_args)?;
            let deployer = ::ethers::contract::ContractDeployer::new(deployer);
            Ok(deployer)
        }
        ///Calls the contract's `moduleType` (0x6465e69f) function
        pub fn module_type(&self) -> ::ethers::contract::builders::ContractCall<M, u8> {
            self.0
                .method_hash([100, 101, 230, 159], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `requiredMetadata` (0x88242fa0) function
        pub fn required_metadata(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Bytes> {
            self.0
                .method_hash([136, 36, 47, 160], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setRequiredMetadata` (0x894187ce) function
        pub fn set_required_metadata(
            &self,
            required_metadata: ::ethers::core::types::Bytes,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([137, 65, 135, 206], required_metadata)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `verify` (0xf7e83aee) function
        pub fn verify(
            &self,
            metadata: ::ethers::core::types::Bytes,
            p1: ::ethers::core::types::Bytes,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([247, 232, 58, 238], (metadata, p1))
                .expect("method not found (this should never happen)")
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>> for TestIsm<M> {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    ///Container type for all input parameters for the `moduleType` function with signature `moduleType()` and selector `0x6465e69f`
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
    #[ethcall(name = "moduleType", abi = "moduleType()")]
    pub struct ModuleTypeCall;
    ///Container type for all input parameters for the `requiredMetadata` function with signature `requiredMetadata()` and selector `0x88242fa0`
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
    #[ethcall(name = "requiredMetadata", abi = "requiredMetadata()")]
    pub struct RequiredMetadataCall;
    ///Container type for all input parameters for the `setRequiredMetadata` function with signature `setRequiredMetadata(bytes)` and selector `0x894187ce`
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
    #[ethcall(name = "setRequiredMetadata", abi = "setRequiredMetadata(bytes)")]
    pub struct SetRequiredMetadataCall {
        pub required_metadata: ::ethers::core::types::Bytes,
    }
    ///Container type for all input parameters for the `verify` function with signature `verify(bytes,bytes)` and selector `0xf7e83aee`
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
    #[ethcall(name = "verify", abi = "verify(bytes,bytes)")]
    pub struct VerifyCall {
        pub metadata: ::ethers::core::types::Bytes,
        pub p1: ::ethers::core::types::Bytes,
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
    pub enum TestIsmCalls {
        ModuleType(ModuleTypeCall),
        RequiredMetadata(RequiredMetadataCall),
        SetRequiredMetadata(SetRequiredMetadataCall),
        Verify(VerifyCall),
    }
    impl ::ethers::core::abi::AbiDecode for TestIsmCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <ModuleTypeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::ModuleType(decoded));
            }
            if let Ok(decoded) =
                <RequiredMetadataCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::RequiredMetadata(decoded));
            }
            if let Ok(decoded) =
                <SetRequiredMetadataCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetRequiredMetadata(decoded));
            }
            if let Ok(decoded) = <VerifyCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Verify(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for TestIsmCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::ModuleType(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RequiredMetadata(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetRequiredMetadata(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Verify(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for TestIsmCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::ModuleType(element) => ::core::fmt::Display::fmt(element, f),
                Self::RequiredMetadata(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetRequiredMetadata(element) => ::core::fmt::Display::fmt(element, f),
                Self::Verify(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<ModuleTypeCall> for TestIsmCalls {
        fn from(value: ModuleTypeCall) -> Self {
            Self::ModuleType(value)
        }
    }
    impl ::core::convert::From<RequiredMetadataCall> for TestIsmCalls {
        fn from(value: RequiredMetadataCall) -> Self {
            Self::RequiredMetadata(value)
        }
    }
    impl ::core::convert::From<SetRequiredMetadataCall> for TestIsmCalls {
        fn from(value: SetRequiredMetadataCall) -> Self {
            Self::SetRequiredMetadata(value)
        }
    }
    impl ::core::convert::From<VerifyCall> for TestIsmCalls {
        fn from(value: VerifyCall) -> Self {
            Self::Verify(value)
        }
    }
    ///Container type for all return fields from the `moduleType` function with signature `moduleType()` and selector `0x6465e69f`
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
    pub struct ModuleTypeReturn(pub u8);
    ///Container type for all return fields from the `requiredMetadata` function with signature `requiredMetadata()` and selector `0x88242fa0`
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
    pub struct RequiredMetadataReturn(pub ::ethers::core::types::Bytes);
    ///Container type for all return fields from the `verify` function with signature `verify(bytes,bytes)` and selector `0xf7e83aee`
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
