use codec::{Decode, Encode};
use frame_metadata::{v15::ExtrinsicMetadata, RuntimeMetadata, RuntimeMetadataPrefixed};
use merkleized_metadata::{
    generate_metadata_digest, generate_proof_for_extrinsic, generate_proof_for_extrinsic_parts,
    types::{Hash, MetadataDigest},
    verify_proof, ExtraInfo, Proof, SignedExtrinsicData,
};
use scale_info::form::PortableForm;

use pyo3::prelude::*;

#[pymodule(name = "merkleized_metadata")]
mod py_merkleized_metadata {
    use super::*;
    #[pyclass(name = "ExtraInfo")]
    #[derive(Clone)]
    pub struct PyExtraInfo {
        pub spec_version: u32,
        pub spec_name: String,
        pub base58_prefix: u16,
        pub decimals: u8,
        pub token_symbol: String,
    }

    #[pymethods]
    impl PyExtraInfo {
        #[new]
        fn new(
            spec_version: u32,
            spec_name: String,
            base58_prefix: u16,
            decimals: u8,
            token_symbol: String,
        ) -> Self {
            PyExtraInfo {
                spec_version,
                spec_name,
                base58_prefix,
                decimals,
                token_symbol,
            }
        }
    }

    impl From<ExtraInfo> for PyExtraInfo {
        fn from(extra_info: ExtraInfo) -> Self {
            PyExtraInfo {
                spec_version: extra_info.spec_version,
                spec_name: extra_info.spec_name,
                base58_prefix: extra_info.base58_prefix,
                decimals: extra_info.decimals,
                token_symbol: extra_info.token_symbol,
            }
        }
    }

    impl From<PyExtraInfo> for ExtraInfo {
        fn from(py_extra_info: PyExtraInfo) -> Self {
            ExtraInfo {
                spec_version: py_extra_info.spec_version,
                spec_name: py_extra_info.spec_name,
                base58_prefix: py_extra_info.base58_prefix,
                decimals: py_extra_info.decimals,
                token_symbol: py_extra_info.token_symbol,
            }
        }
    }

    #[pyclass(name = "Proof")]
    #[derive(Clone)]
    pub struct PyProof {
        pub proof: Proof,
    }
    #[pymethods]
    impl PyProof {
        fn encode(&self) -> Vec<u8> {
            self.proof.encode().to_vec()
        }
    }

    impl From<Proof> for PyProof {
        fn from(proof: Proof) -> Self {
            PyProof { proof: proof }
        }
    }

    impl From<PyProof> for Proof {
        fn from(py_proof: PyProof) -> Self {
            py_proof.proof
        }
    }

    #[pyclass(name = "MetadataDigest", get_all)]
    #[derive(Clone)]
    pub struct PyMetadataDigest {
        pub disabled: bool,
        pub v1: Option<PyMetadataDigestV1>,
    }

    #[pyclass(name = "MetadataDigestV1", get_all)]
    #[derive(Clone)]
    pub struct PyMetadataDigestV1 {
        pub types_tree_root: Hash,
        pub extrinsic_metadata_hash: Hash,
        pub spec_version: u32,
        pub spec_name: String,
        pub base58_prefix: u16,
        pub decimals: u8,
        pub token_symbol: String,
    }

    impl From<PyMetadataDigest> for MetadataDigest {
        fn from(py_metadata_digest: PyMetadataDigest) -> Self {
            match py_metadata_digest.disabled {
                false => {
                    let v1 = py_metadata_digest.v1.unwrap();
                    MetadataDigest::V1 {
                        types_tree_root: v1.types_tree_root,
                        extrinsic_metadata_hash: v1.extrinsic_metadata_hash,
                        spec_version: v1.spec_version,
                        spec_name: v1.spec_name,
                        base58_prefix: v1.base58_prefix,
                        decimals: v1.decimals,
                        token_symbol: v1.token_symbol,
                    }
                }
                true => MetadataDigest::Disabled,
            }
        }
    }

    impl From<MetadataDigest> for PyMetadataDigest {
        fn from(metadata_digest: MetadataDigest) -> Self {
            match metadata_digest {
                MetadataDigest::Disabled => PyMetadataDigest {
                    disabled: true,
                    v1: None,
                },
                MetadataDigest::V1 {
                    types_tree_root,
                    extrinsic_metadata_hash,
                    spec_version,
                    spec_name,
                    base58_prefix,
                    decimals,
                    token_symbol,
                } => PyMetadataDigest {
                    disabled: false,
                    v1: Some(PyMetadataDigestV1 {
                        types_tree_root,
                        extrinsic_metadata_hash,
                        spec_version,
                        spec_name,
                        base58_prefix,
                        decimals,
                        token_symbol,
                    }),
                },
            }
        }
    }

    #[pymethods]
    impl PyMetadataDigest {
        fn hash(&self) -> Vec<u8> {
            let metadata_digest: MetadataDigest = self.clone().into();

            metadata_digest.hash().to_vec()
        }
    }

    #[pyclass(name = "ExtrinsicMetadata")]
    #[derive(Clone)]
    pub struct PyExtrinsicMetadata {
        extrinsic_metadata: ExtrinsicMetadata<PortableForm>,
    }

    impl From<ExtrinsicMetadata<PortableForm>> for PyExtrinsicMetadata {
        fn from(ext_meta: ExtrinsicMetadata<PortableForm>) -> Self {
            PyExtrinsicMetadata {
                extrinsic_metadata: ext_meta,
            }
        }
    }

    impl From<PyExtrinsicMetadata> for ExtrinsicMetadata<PortableForm> {
        fn from(py_ext_meta: PyExtrinsicMetadata) -> Self {
            py_ext_meta.extrinsic_metadata
        }
    }

    #[pymethods]
    impl PyExtrinsicMetadata {
        fn encode(&self) -> Vec<u8> {
            self.extrinsic_metadata.encode().to_vec()
        }
    }

    #[pyfunction(name = "generate_proof_for_extrinsic")]
    #[pyo3(signature = (extrinsic, additional_signed, encoded_metadata_v15))]
    fn py_generate_proof_for_extrinsic(
        extrinsic: &[u8],
        additional_signed: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
    ) -> PyResult<PyProof> {
        let option_vec = Option::<Vec<u8>>::decode(&mut &encoded_metadata_v15[..])
            .ok()
            .flatten()
            .expect("Failed to Option metadata");

        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &option_vec[..])
            .expect("Failed to decode metadata")
            .1;

        let result = generate_proof_for_extrinsic(extrinsic, additional_signed, &metadata_v15);
        if result.is_err() {
            Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
                "Failed to generate proof for extrinsic: ".to_owned() + &result.unwrap_err(),
            ))
        } else {
            let proof = result.unwrap();
            Ok(proof.into())
        }
    }

    #[pyfunction(name = "generate_metadata_digest")]
    fn py_generate_metadata_digest(
        encoded_metadata_v15: &[u8],
        extra_info: PyExtraInfo,
    ) -> PyResult<PyMetadataDigest> {
        let option_vec = Option::<Vec<u8>>::decode(&mut &encoded_metadata_v15[..])
            .ok()
            .flatten()
            .expect("Failed to Option metadata");

        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &option_vec[..])
            .expect("Failed to decode metadata")
            .1;

        let extra_info_: ExtraInfo = extra_info.into();

        let result = generate_metadata_digest(&metadata_v15, extra_info_);
        if result.is_err() {
            Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
                "Failed to generate metadata digest",
            ))
        } else {
            let metadata_digest = result.unwrap();
            Ok(metadata_digest.into())
        }
    }

    #[pyfunction(name = "verify_proof")]
    #[pyo3(signature = (extrinsic, additional_signed, encoded_metadata_v15, proof))]
    fn py_verify_proof(
        extrinsic: &[u8],
        additional_signed: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
        proof: &PyProof,
    ) -> PyResult<()> {
        let option_vec = Option::<Vec<u8>>::decode(&mut &encoded_metadata_v15[..])
            .ok()
            .flatten()
            .expect("Failed to Option metadata");

        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &option_vec[..])
            .expect("Failed to decode metadata")
            .1;

        match verify_proof(
            extrinsic,
            additional_signed,
            &metadata_v15,
            &(proof.clone()).into(),
        ) {
            Ok(_) => Ok(()),
            Err(message) => Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(message)),
        }
    }

    #[pyfunction(name = "verify_metadata_proof")]
    #[pyo3(signature = (extrinsic, additional_signed, encoded_metadata_v15, proof))]
    fn py_verify_metadata_proof(
        extrinsic: &[u8],
        additional_signed: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
        proof: &MetadataProof,
    ) -> PyResult<()> {
        let proof_: PyProof = (*proof).clone().into();

        py_verify_proof(extrinsic, additional_signed, encoded_metadata_v15, &proof_)
    }

    #[pyfunction(name = "get_extrinsic_metadata_portable")]
    fn py_get_extrinsic_metadata_portable(
        encoded_metadata_v15: &[u8],
    ) -> PyResult<PyExtrinsicMetadata> {
        let option_vec = Option::<Vec<u8>>::decode(&mut &encoded_metadata_v15[..])
            .ok()
            .flatten()
            .expect("Failed to Option metadata");

        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &option_vec[..])
            .expect("Failed to decode metadata")
            .1;

        let runtime_metadata = match metadata_v15 {
            RuntimeMetadata::V15(metadata) => metadata,
            _ => panic!("Invalid metadata version"),
        };

        let ext_meta = runtime_metadata.extrinsic;

        Ok(ext_meta.into())
    }

    #[derive(Clone, Encode)]
    pub struct ExtraInfo_ {
        spec_version: u32,
        spec_name: String,
        base58_prefix: u16,
        decimals: u8,
        token_symbol: String,
    }

    impl From<ExtraInfo_> for ExtraInfo {
        fn from(extra_info: ExtraInfo_) -> Self {
            ExtraInfo {
                spec_version: extra_info.spec_version,
                spec_name: extra_info.spec_name,
                base58_prefix: extra_info.base58_prefix,
                decimals: extra_info.decimals,
                token_symbol: extra_info.token_symbol,
            }
        }
    }

    impl From<ExtraInfo> for ExtraInfo_ {
        fn from(extra_info: ExtraInfo) -> Self {
            ExtraInfo_ {
                spec_version: extra_info.spec_version,
                spec_name: extra_info.spec_name,
                base58_prefix: extra_info.base58_prefix,
                decimals: extra_info.decimals,
                token_symbol: extra_info.token_symbol,
            }
        }
    }

    #[pyclass(name = "MetadataProof")]
    #[derive(Clone, Encode)]
    pub struct MetadataProof {
        pub proof: Proof,
        pub extrinsic: ExtrinsicMetadata<PortableForm>,
        pub extra_info: ExtraInfo_,
    }

    #[pymethods]
    impl MetadataProof {
        #[pyo3(name = "encode")]
        fn py_encode(&self) -> Vec<u8> {
            self.encode().to_vec()
        }

        #[pyo3(name = "encode_proof")]
        fn encode_proof(&self) -> Vec<u8> {
            self.proof.encode().to_vec()
        }
    }

    impl From<MetadataProof> for PyProof {
        fn from(metadata_proof: MetadataProof) -> Self {
            PyProof {
                proof: metadata_proof.proof,
            }
        }
    }

    #[pyfunction(name = "construct_metadata_proof")]
    fn construct_metadata_proof(
        proof: &PyProof,
        extrinsic_metadata: &PyExtrinsicMetadata,
        extra_info: &PyExtraInfo,
    ) -> PyResult<MetadataProof> {
        let metadata_proof = MetadataProof {
            proof: proof.clone().into(),
            extrinsic: extrinsic_metadata.clone().into(),
            extra_info: Into::<ExtraInfo>::into(extra_info.clone()).into(),
        };

        Ok(metadata_proof)
    }

    #[pyfunction(name = "get_metadata_proof")]
    #[pyo3(signature = (extrinsic, additional_signed, encoded_metadata_v15, extra_info))]
    fn py_get_metadata_proof(
        extrinsic: &[u8],
        additional_signed: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
        extra_info: PyExtraInfo,
    ) -> PyResult<MetadataProof> {
        let option_vec = Option::<Vec<u8>>::decode(&mut &encoded_metadata_v15[..])
            .ok()
            .flatten()
            .expect("Failed to Option metadata");

        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &option_vec[..])
            .expect("Failed to decode metadata")
            .1;

        let proof_result =
            generate_proof_for_extrinsic(extrinsic, additional_signed, &metadata_v15);
        if proof_result.is_err() {
            Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
                "Failed to generate proof for extrinsic: ".to_owned() + &proof_result.unwrap_err(),
            ))
        } else {
            let proof = proof_result.unwrap();

            let runtime_metadata = match metadata_v15 {
                RuntimeMetadata::V15(metadata) => metadata,
                _ => panic!("Invalid metadata version"),
            };

            let ext_meta = runtime_metadata.extrinsic;

            let metadata_proof = MetadataProof {
                proof: proof.clone().into(),
                extrinsic: ext_meta.clone().into(),
                extra_info: Into::<ExtraInfo>::into(extra_info.clone()).into(),
            };

            Ok(metadata_proof)
        }
    }

    #[pyfunction(name = "get_metadata_proof_for_extrinsic_parts")]
    #[pyo3(signature = (call, included_in_extrinsic, included_in_signed_data, encoded_metadata_v15, extra_info))]
    fn py_get_metadata_proof_for_extrinsic_parts(
        call: &[u8],
        included_in_extrinsic: Option<&[u8]>,
        included_in_signed_data: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
        extra_info: PyExtraInfo,
    ) -> PyResult<MetadataProof> {
        let option_vec = Option::<Vec<u8>>::decode(&mut &encoded_metadata_v15[..])
            .ok()
            .flatten()
            .expect("Failed to Option metadata");

        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &option_vec[..])
            .expect("Failed to decode metadata")
            .1;

        let signed_ext_data = match included_in_signed_data {
            Some(signed_data) => match included_in_extrinsic {
                Some(extrinsic_data) => Some(SignedExtrinsicData {
                    included_in_extrinsic: extrinsic_data,
                    included_in_signed_data: signed_data,
                }),
                None => None,
            },
            None => None,
        };

        let proof_result = generate_proof_for_extrinsic_parts(call, signed_ext_data, &metadata_v15);
        if proof_result.is_err() {
            Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
                "Failed to generate proof for extrinsic: ".to_owned() + &proof_result.unwrap_err(),
            ))
        } else {
            let proof = proof_result.unwrap();

            let runtime_metadata = match metadata_v15 {
                RuntimeMetadata::V15(metadata) => metadata,
                _ => panic!("Invalid metadata version"),
            };

            let ext_meta = runtime_metadata.extrinsic;

            let metadata_proof = MetadataProof {
                proof: proof.clone().into(),
                extrinsic: ext_meta.clone().into(),
                extra_info: Into::<ExtraInfo>::into(extra_info.clone()).into(),
            };

            Ok(metadata_proof)
        }
    }

    #[pyfunction(name = "get_metadata_proof_for_extrinsic_parts_opaque_metadata")]
    #[pyo3(signature = (call, included_in_extrinsic, included_in_signed_data, encoded_metadata_v15, extra_info))]
    fn py_get_metadata_proof_for_extrinsic_parts_opaque_metadata(
        call: &[u8],
        included_in_extrinsic: Option<&[u8]>,
        included_in_signed_data: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
        extra_info: PyExtraInfo,
    ) -> PyResult<MetadataProof> {
        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &encoded_metadata_v15[..])
            .expect("Failed to decode metadata")
            .1;

        let signed_ext_data = match included_in_signed_data {
            Some(signed_data) => match included_in_extrinsic {
                Some(extrinsic_data) => Some(SignedExtrinsicData {
                    included_in_extrinsic: extrinsic_data,
                    included_in_signed_data: signed_data,
                }),
                None => None,
            },
            None => None,
        };

        let proof_result = generate_proof_for_extrinsic_parts(call, signed_ext_data, &metadata_v15);
        if proof_result.is_err() {
            Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
                "Failed to generate proof for extrinsic: ".to_owned() + &proof_result.unwrap_err(),
            ))
        } else {
            let proof = proof_result.unwrap();

            let runtime_metadata = match metadata_v15 {
                RuntimeMetadata::V15(metadata) => metadata,
                _ => panic!("Invalid metadata version"),
            };

            let ext_meta = runtime_metadata.extrinsic;

            let metadata_proof = MetadataProof {
                proof: proof.clone().into(),
                extrinsic: ext_meta.clone().into(),
                extra_info: Into::<ExtraInfo>::into(extra_info.clone()).into(),
            };

            Ok(metadata_proof)
        }
    }

    #[pyfunction(name = "generate_proof_for_extrinsic_opaque_metadata")]
    #[pyo3(signature = (extrinsic, additional_signed, encoded_metadata_v15))]
    fn py_generate_proof_for_extrinsic_opaque_metadata(
        extrinsic: &[u8],
        additional_signed: Option<&[u8]>,
        encoded_metadata_v15: &[u8],
    ) -> PyResult<PyProof> {
        let metadata_v15 = RuntimeMetadataPrefixed::decode(&mut &encoded_metadata_v15[..])
            .expect("Failed to decode metadata")
            .1;

        let result = generate_proof_for_extrinsic(extrinsic, additional_signed, &metadata_v15);
        if result.is_err() {
            Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
                "Failed to generate proof for extrinsic: ".to_owned() + &result.unwrap_err(),
            ))
        } else {
            let proof = result.unwrap();
            Ok(proof.into())
        }
    }
}
