import unittest
import json

import merkleized_metadata


def get_metadata() -> bytes:
    with open("tests/metadata_2.json", "r") as f:
        js_encoded_metadata = json.load(f)
    js_metadata_bytes = bytes.fromhex(js_encoded_metadata[2:])

    # Not sure why this differs from the python impl
    metadata_bytes = bytes.fromhex("01aa420a00") + js_metadata_bytes 

    return metadata_bytes

def get_metadata_hash() -> bytes:
    with open("tests/metadata_hash.json", "r") as f:
        js_encoded_metadata_hash = json.load(f)
    js_metadata_hash_bytes = bytes.fromhex(js_encoded_metadata_hash[2:])

    return js_metadata_hash_bytes


class TestGetExtrinsicMetadata(unittest.TestCase):
    def test_get_transfer_metadata(self):
        encoded_metadata = get_metadata()

        extra_info_bt = merkleized_metadata.ExtraInfo.__new__(
            merkleized_metadata.ExtraInfo,
            spec_version = 192,
            spec_name = "node-subtensor",
            base58_prefix = 42,
            decimals = 9,
            token_symbol = "TAO"
        )

        metadata_digest = merkleized_metadata.generate_metadata_digest(
            encoded_metadata,
            extra_info_bt,
        )

        # Add the metadata to the extrinsic
        if metadata_digest.disabled:
            self.give_error("Metadata is disabled")
        metadata_hash = bytes(metadata_digest.hash())

        js_hash = get_metadata_hash()

        self.assertEqual(metadata_hash, js_hash)


