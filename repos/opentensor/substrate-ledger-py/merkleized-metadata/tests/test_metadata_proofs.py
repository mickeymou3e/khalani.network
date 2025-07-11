import unittest
import json

import merkleized_metadata


def get_metadata() -> bytes:
    with open("tests/metadata.json", "r") as f:
        js_encoded_metadata = json.load(f)
    js_metadata_bytes = bytes.fromhex(js_encoded_metadata[2:])

    # Not sure why this differs from the python impl
    metadata_bytes = bytes.fromhex("01aa420a00") + js_metadata_bytes 

    return metadata_bytes

def get_transfer_metadata_proof() -> bytes:
    with open("tests/transfer_metadata_proof.json", "r") as f:
        js_encoded_metadata_proof = json.load(f)
    js_metadata_proof_bytes = bytes.fromhex(js_encoded_metadata_proof[2:])

    return js_metadata_proof_bytes

class TestMetadataProofNoErrors(unittest.TestCase):
    def test_get_metadata_proof(self):
        encoded_metadata = get_metadata()

        extra_info_bt = merkleized_metadata.ExtraInfo.__new__(
            merkleized_metadata.ExtraInfo,
            spec_version = 192,
            spec_name = "node-subtensor",
            base58_prefix = 42,
            decimals = 9,
            token_symbol = "TAO"
        )

        encoded_ext_hex = "0xa404050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f"
        encoded_ext = bytes.fromhex(encoded_ext_hex[2:])

        _ = merkleized_metadata.get_metadata_proof(
            encoded_ext,
            None,
            encoded_metadata,
            extra_info_bt,
        )

    def test_get_metadata_proof_using_parts(self):
        encoded_metadata = get_metadata()

        extra_info_bt = merkleized_metadata.ExtraInfo.__new__(
            merkleized_metadata.ExtraInfo,
            spec_version = 192,
            spec_name = "node-subtensor",
            base58_prefix = 42,
            decimals = 9,
            token_symbol = "TAO"
        )

        encoded_call_hex = "0x050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f"
        encoded_call = bytes.fromhex(encoded_call_hex[2:])

        _ = merkleized_metadata.get_metadata_proof_for_extrinsic_parts(
            encoded_call,
            None,
            None,
            encoded_metadata,
            extra_info_bt,
        )

class TestMetadataProofVerify(unittest.TestCase):
    def test_get_metadata_proof_verify(self):
        encoded_metadata = get_metadata()

        extra_info_bt = merkleized_metadata.ExtraInfo.__new__(
            merkleized_metadata.ExtraInfo,
            spec_version = 192,
            spec_name = "node-subtensor",
            base58_prefix = 42,
            decimals = 9,
            token_symbol = "TAO"
        )

        encoded_ext_hex = "0xa404050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f"
        encoded_ext = bytes.fromhex(encoded_ext_hex[2:])

        proof = merkleized_metadata.get_metadata_proof(
            encoded_ext,
            None,
            encoded_metadata,
            extra_info_bt,
        )

        merkleized_metadata.verify_metadata_proof(
            encoded_ext,
            None,
            encoded_metadata,
            proof,
        )

    def test_get_metadata_proof_using_parts_verify(self):
        encoded_metadata = get_metadata()

        extra_info_bt = merkleized_metadata.ExtraInfo.__new__(
            merkleized_metadata.ExtraInfo,
            spec_version = 192,
            spec_name = "node-subtensor",
            base58_prefix = 42,
            decimals = 9,
            token_symbol = "TAO"
        )

        encoded_call_hex = "0x050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f"
        encoded_call = bytes.fromhex(encoded_call_hex[2:])

        proof = merkleized_metadata.get_metadata_proof_for_extrinsic_parts(
            encoded_call,
            None,
            None,
            encoded_metadata,
            extra_info_bt,
        )

        encoded_ext_hex = "0xa404050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f"
        encoded_ext = bytes.fromhex(encoded_ext_hex[2:])

        merkleized_metadata.verify_metadata_proof(
            encoded_ext, # Matches the call the proof was made from
            None,
            encoded_metadata,
            proof,
        )

class TestMetadataProofMatchesJavascriptImpl(unittest.TestCase):
    def test_get_metadata_proof_matches_impl(self):
        encoded_metadata = get_metadata()
        js_proof_bytes = get_transfer_metadata_proof()

        js_transfer_payload = bytes.fromhex("050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f00000001c00000000100000073bd9219bd97d2937a0ea7916a362656383c8bfa413c6597c8e0ac45a144d0823823302f25bbe09265c4df81df50eaaece242f05f724f5dfac8c6b87ffa5ef4001f806ed4d2fbb45d733c2dd12109424cdc776a32087aebfd65248ec54b90c7b2a")
        additional_from_js_transfer: bytes = js_transfer_payload[40:]

        extra_info_bt = merkleized_metadata.ExtraInfo.__new__(
            merkleized_metadata.ExtraInfo,
            spec_version = 192,
            spec_name = "node-subtensor",
            base58_prefix = 42,
            decimals = 9,
            token_symbol = "TAO"
        )

        encoded_ext_hex = "0xa404050300d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d034000b14f"
        encoded_ext = bytes.fromhex(encoded_ext_hex[2:])

        proof = merkleized_metadata.get_metadata_proof(
            encoded_ext,
            additional_from_js_transfer,
            encoded_metadata,
            extra_info_bt,
        )

        self.assertEqual(js_proof_bytes, bytes(proof.encode()))
