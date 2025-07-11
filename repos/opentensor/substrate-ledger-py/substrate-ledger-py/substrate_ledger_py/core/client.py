# The MIT License (MIT)
# Copyright © 2024 Opentensor Technologies Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the “Software”), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of
# the Software.
#
# THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
# THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

# Attribution for some of the code from spesmilo/electrum:
# https://raw.githubusercontent.com/spesmilo/electrum/d0693c311f44a0ccd33cd28785c069c26c4c3a41/electrum/plugins/ledger/ledger.py

# Some parts of this code are adapted from bitcoin-core/HWI:
# https://github.com/bitcoin-core/HWI/blob/e731395bde13362950e9f13e01689c475545e4dc/hwilib/devices/ledger.py

from typing import Optional, Tuple, Union, List, Any

from dataclasses import dataclass


import merkleized_metadata

import scalecodec
import substrateinterface
import substrateinterface.utils

import ledgercomm
import ledgercomm.transport

from .ledger_types import LedgerDeviceInfo, BIP44_Path
from .apdu_interface import LedgerAPDUInterface

SS58_FORMAT_DEFAULT = 42  # Bittensor format (and Substrate default)


@dataclass
class MetadataMerkleizationOptions:
    base58Prefix: int
    decimals: int
    specName: str
    specVersion: str
    tokenSymbol: str

@dataclass
class SignedExtensionMetadata:
    identifier: str
    includedInExtrinsic: Optional[int] = None
    includedInSignedData: Optional[int] = None

@dataclass
class SignedExtrinsicData:
    includedInExtrinsic: bytes
    includedInSignedData: bytes


def _get_signed_extension_metadata(substrate: substrateinterface) -> Optional[List[SignedExtensionMetadata]]:
    """
    Gets the signed extension metadata from the metadata.

    Args:
    - substrate: substrateinterface.SubstrateInterface (Substrate interface)

    Returns:
    - Optional[SignedExtensionMetadata]
    """
    signed_extension_metadata = None

    if 'signed_extensions' in substrate.metadata[1][1]['extrinsic']:
        signed_extension_metadata = []

        # Add signed extensions to payload
        signed_extensions = substrate.metadata.get_signed_extensions()

        for identifier in {
            "CheckMortality",
            "CheckEra",
            "CheckNonce",
            "ChargeTransactionPayment",
            "ChargeAssetTxPayment",
            "CheckMetadataHash",
            "CheckSpecVersion",
            "CheckTxVersion",
            "CheckGenesis",
        }:
            ext = None if identifier not in signed_extensions else int(signed_extensions[identifier]['extrinsic'].split('::')[1])
            additional_signed = None if identifier not in signed_extensions else int(signed_extensions[identifier]['additional_signed'].split('::')[1])

            signed_extension_metadata.append(
                SignedExtensionMetadata(
                    identifier=identifier,
                    includedInExtrinsic=ext,
                    includedInSignedData=additional_signed
                )
            )

    return signed_extension_metadata

def _convert_type_refs(type_refs: List[scalecodec.CompactU32]) -> bytes:
    """
    Converts type refs to bytes.

    Args:
    - type_refs: List[scalecodec.CompactU32] (type refs)

    Returns:
    - bytes (type refs)
    """
    type_refs_bytes = b""
    for type_ref in type_refs:
        type_refs_bytes += bytes(type_ref.data.data)

    return type_refs_bytes

def _get_signed_extrinsic_data(encoded_metadata: bytes) -> Optional[SignedExtrinsicData]:
    """
    Gets the signed extrinsic data from the metadata.

    Args:
    - encoded_metadata: bytes (encoded metadata)

    Returns:
    - Optional[SignedExtrinsicData]
    """

    included_in_extrinsic = []
    included_in_signed_data = []

    extrinsic_metadata_portable = merkleized_metadata.get_extrinsic_metadata_portable(encoded_metadata).encode()
    extrinsic_metadata_portable_bytes = bytes(extrinsic_metadata_portable)

    runtime_config = scalecodec.base.RuntimeConfiguration()
    runtime_config.update_type_registry(scalecodec.type_registry.load_type_registry_preset("legacy"))
    runtime_config.update_type_registry({
    "types": {
        "Type": "Compact<u32>",
        "SignedExtensionMetadata": {
            "type": "struct",
            "type_mapping": [
                ["identifier", "String"],
                ["ty", "Type"],
                ["additional_signed", "Type"],
            ],
        },
        "ExtrinsicMetadata": {
            "type": "struct",
            "type_mapping": [
                ["version", "u8"],
                ["address_ty", "Type"],
                ["call_ty", "Type"],
                ["signature_ty", "Type"],
                ["extra_ty", "Type"],
                ["signed_extensions", "Vec<SignedExtensionMetadata>"],
            ],
        },
    }
    })

    extrinsic_metadata_obj = runtime_config.create_scale_object("ExtrinsicMetadata", data=scalecodec.ScaleBytes(extrinsic_metadata_portable_bytes))
    extrinsic_metadata_obj.decode()

    for signed_ext in extrinsic_metadata_obj['signed_extensions']:
        ty = signed_ext['ty']
        additional_signed = signed_ext['additional_signed']

        included_in_extrinsic.append(ty)
        included_in_signed_data.append(additional_signed)

    signed_extrinsic_data = SignedExtrinsicData(
        includedInExtrinsic=_convert_type_refs(included_in_extrinsic),
        includedInSignedData=_convert_type_refs(included_in_signed_data)
    )

    return signed_extrinsic_data



def _get_additional_signed(encoded_metadata: bytes) -> Optional[bytes]:
    """
    Gets the additional signed data from the metadata.

    Args:
    - encoded_metadata: bytes (encoded metadata)

    Returns:
    - Optional[bytes] (additional signed data)
    """

    signed_extrinsic_data = _get_signed_extrinsic_data(encoded_metadata)
    if signed_extrinsic_data:
        additional_signed = signed_extrinsic_data.includedInSignedData

        return additional_signed

    return None

def _get_type_mapping(substrate: substrateinterface) -> Optional[List[List[str]]]:
    """
    Gets the type mapping from the metadata.

    Args:
    - substrate: substrateinterface.SubstrateInterface (Substrate interface)

    Returns:
    - Optional[List[List[str, str]]] (type mapping)
        This is a type mapping of types required for the metadata.    
    """
    type_mapping = None

    if 'signed_extensions' in substrate.metadata[1][1]['extrinsic']:
        # Base signature payload
        type_mapping = [['call', 'CallBytes']]

        # Add signed extensions to payload
        signed_extensions = substrate.metadata.get_signed_extensions()

        if 'CheckMortality' in signed_extensions:
            type_mapping.append(
                ['era', signed_extensions['CheckMortality']['extrinsic']]
            )

        if 'CheckEra' in signed_extensions:
            type_mapping.append(
                ['era', signed_extensions['CheckEra']['extrinsic']]
            )

        if 'CheckNonce' in signed_extensions:
            type_mapping.append(
                ['nonce', signed_extensions['CheckNonce']['extrinsic']]
            )

        if 'ChargeTransactionPayment' in signed_extensions:
            type_mapping.append(
                ['tip', signed_extensions['ChargeTransactionPayment']['extrinsic']]
            )

        if 'ChargeAssetTxPayment' in signed_extensions:
            type_mapping.append(
                ['asset_id', signed_extensions['ChargeAssetTxPayment']['extrinsic']]
            )

        if 'CheckMetadataHash' in signed_extensions:
            type_mapping.append(
                ['mode', signed_extensions['CheckMetadataHash']['extrinsic']]
            )

        if 'CheckSpecVersion' in signed_extensions:
            type_mapping.append(
                ['spec_version', signed_extensions['CheckSpecVersion']['additional_signed']]
            )

        if 'CheckTxVersion' in signed_extensions:
            type_mapping.append(
                ['transaction_version', signed_extensions['CheckTxVersion']['additional_signed']]
            )

        if 'CheckGenesis' in signed_extensions:
            type_mapping.append(
                ['genesis_hash', signed_extensions['CheckGenesis']['additional_signed']]
            )

        if 'CheckMortality' in signed_extensions:
            type_mapping.append(
                ['block_hash', signed_extensions['CheckMortality']['additional_signed']]
            )

        if 'CheckEra' in signed_extensions:
            type_mapping.append(
                ['block_hash', signed_extensions['CheckEra']['additional_signed']]
            )

        if 'CheckMetadataHash' in signed_extensions:
            type_mapping.append(
                ['metadata_hash', signed_extensions['CheckMetadataHash']['additional_signed']]
            )

    return type_mapping


@dataclass
class SignaturePayload:
    """
    Signature payload of the transaction to sign.
    """
    call: substrateinterface.base.GenericCall
    era: Union["00", Tuple[int, int]] = "00"
    nonce: int = 0
    tip: int = 0
    tip_asset_id: int = 0
    metadata_hash: Optional[bytes] = None
    mode: bool = False

    def encode(self, substrate: substrateinterface.SubstrateInterface) -> scalecodec.ScaleType:
        """
        Encode the signature payload.

        Args:
        - substrate: substrateinterface.SubstrateInterface (Substrate interface)

        Returns:
        - The signature payload (encoded signature payload)

        Attribution: https://github.com/polkascan/py-substrate-interface/blob/4dc73d695af00a69f53b6f25d37616891752380b/substrateinterface/base.py#L1434
        """
        genesis_hash = substrate.get_block_hash(0)

        era = self.era
        if not era:
            era = '00'

        if era == '00':
            # Immortal extrinsic
            block_hash = genesis_hash
        else:
            # Determine mortality of extrinsic
            era_obj = substrate.runtime_config.create_scale_object('Era')

            if isinstance(era, dict) and 'current' not in era and 'phase' not in era:
                raise ValueError('The era dict must contain either "current" or "phase" element to encode a valid era')

            era_obj.encode(era)
            block_hash = substrate.get_block_hash(block_id=era_obj.birth(era.get('current')))

        # Create signature payload
        signature_payload = substrate.runtime_config.create_scale_object('ExtrinsicPayloadValue')

        # Process signed extensions in metadata
        type_mapping = _get_type_mapping(substrate)
        if type_mapping:
            signature_payload.type_mapping = type_mapping

        call = self.call
        call_data = str(call.data)

        nonce = self.nonce
        tip = self.tip
        tip_asset_id = self.tip_asset_id
        metadata_hash = self.metadata_hash
        mode = self.mode

        payload_dict = {
            'call': call_data,
            'era': era,
            'nonce': nonce,
            'tip': tip,
            'spec_version': substrate.runtime_version,
            'genesis_hash': genesis_hash,
            'block_hash': block_hash,
            'transaction_version': substrate.transaction_version,
            'asset_id': {'tip': tip, 'asset_id': tip_asset_id},
            'metadata_hash': metadata_hash,
            'mode': 'Enabled' if mode else 'Disabled' # Whether to check metadata hash 
        }

        signature_payload.encode(payload_dict)

        return signature_payload
        
    def create_signed_extrinsic(self, substrate: substrateinterface.SubstrateInterface, keypair: substrateinterface.Keypair, signature: bytes ) -> substrateinterface.base.GenericExtrinsic:
        """
        Create a signed extrinsic from the signature payload, keypair, and signature.

        Args:
        - substrate: substrateinterface.SubstrateInterface (Substrate interface)
        - keypair: substrateinterface.Keypair ((public) keypair that signed the transaction)
        - signature: bytes (signature of the transaction)

        Returns:
        - substrateinterface.base.GenericExtrinsic (signed transaction)

        Attribution: https://github.com/polkascan/py-substrate-interface/blob/4dc73d695af00a69f53b6f25d37616891752380b/substrateinterface/base.py#L1557
        """

        substrate.init_runtime()

        # Check if extrinsic version is supported
        if substrate.metadata[1][1]['extrinsic']['version'] != 4:
            raise NotImplementedError(
                f"Extrinsic version {substrate.metadata[1][1]['extrinsic']['version']} not supported"
            )

        signature_version = signature[0]
        signature = signature[1:]


        # Create extrinsic
        extrinsic = substrate.runtime_config.create_scale_object(type_string='Extrinsic', metadata=substrate.metadata)

        call = self.call
        nonce = self.nonce
        era = self.era
        tip = self.tip
        tip_asset_id = self.tip_asset_id
        value = {
            'account_id': f'0x{keypair.public_key.hex()}',
            'signature': f'0x{signature.hex()}',
            'call_function': call.value['call_function'],
            'call_module': call.value['call_module'],
            'call_args': call.value['call_args'],
            'nonce': nonce,
            'era': era,
            'tip': tip,
            'asset_id': {'tip': tip, 'asset_id': tip_asset_id},
            'mode': 'Enabled' if self.mode else 'Disabled',
            'metadata_hash': self.metadata_hash,
        }

        # Check if ExtrinsicSignature is MultiSignature, otherwise omit signature_version
        signature_cls = substrate.runtime_config.get_decoder_class("ExtrinsicSignature")
        if issubclass(signature_cls, substrate.runtime_config.get_decoder_class('Enum')):
            value['signature_version'] = signature_version

        extrinsic.encode(value)

        return extrinsic

    def create_unsigned_extrinsic(self, substrate: substrateinterface.SubstrateInterface, keypair: substrateinterface.Keypair) -> substrateinterface.base.GenericExtrinsic:
        """
        Create an unsigned extrinsic from the signature payload and keypair.

        Args:
        - substrate: substrateinterface.SubstrateInterface (Substrate interface)
        - keypair: substrateinterface.Keypair ((public) keypair that signed the transaction)

        Returns:
        - substrateinterface.base.GenericExtrinsic (unsigned transaction)

        Attribution:
        https://github.com/polkascan/py-substrate-interface/blob/4dc73d695af00a69f53b6f25d37616891752380b/substrateinterface/base.py#L1652
        """
        substrate.init_runtime()

        # Create extrinsic
        extrinsic = substrate.runtime_config.create_scale_object(type_string='Extrinsic', metadata=substrate.metadata)

        extrinsic.encode({
            'call_function': self.call.value['call_function'],
            'call_module': self.call.value['call_module'],
            'call_args': self.call.value['call_args']
        })

        return extrinsic


class LedgerClient:
    """
    Client for the Ledger hardware wallet.
    Uses the LedgerComm library to communicate with the device.
    """

    inteface: ledgercomm.transport.TransportType
    debug: bool
    transport: ledgercomm.transport.Transport
    __device_info: LedgerDeviceInfo

    def __init__(
        self,
        interface: ledgercomm.transport.TransportType = ledgercomm.transport.TransportType.HID,
        debug: bool = False,
    ):
        self.interface = interface
        self.debug = debug

    def give_error(self, message):
        # TODO: throw errors
        raise message

    def close(self):
        if not hasattr(self, "transport"):
            return
        # Close transport
        self.transport.close()

    def _update_device_info(self) -> None:
        self.open()

        self._update_device_info()
        api = LedgerAPDUInterface()
        device_info = api.get_device_info(self.transport)
        self.__device_info = device_info

    def device_model_name(self) -> Optional[str]:
        self._update_device_info()

        return self.__device_info[0]

    def has_usable_connection_with_device(self):
        try:
            # Check if the device is connected
            return self.transport.com.__opened
        except BaseException:
            return False
        return True

    def open(self):
        # Set up the LedgerComm transport
        self.api = LedgerAPDUInterface()
        self.transport = ledgercomm.Transport(
            interface=self.interface.name.lower(), debug=self.debug
        )

        self.api.get_device_info(self.transport)  # Check if the device is connected

    def check_app_connection(self) -> None:
        self.close()
        self.open()

        self.api.get_version(self.transport)  # Check if the app is running and unlocked

    def show_address(
        self, path: BIP44_Path, ss58_format: int = SS58_FORMAT_DEFAULT, request_user_confirmation: bool = True
    ) -> Tuple[bytes, str]:
        self.check_app_connection()

        public_key, ss58_address = self.api.get_address(
            self.transport,
            path,
            ss58_format=ss58_format,
            request_user_confirmation=request_user_confirmation,
        )

        return public_key, ss58_address
    
    @classmethod
    def _get_metadata_proof_for_extrinsic_parts(
        cls,
        encoded_call: bytes,
        encoded_metadata: bytes,
        extra_info: merkleized_metadata.ExtraInfo,
        included_in_extrinsic: Optional[bytes] = None,
        included_in_signed_data: Optional[bytes] = None,
    ) -> merkleized_metadata.Proof:
        """
        Get the merkle proof for the extrinsic parts.

        Args:
        - encoded_call: bytes (the encoded call)
        - encoded_metadata: bytes (the encoded metadata)
        - extra_info: merkleized_metadata.ExtraInfo (extra info for the metadata)
        - included_in_extrinsic: Optional[bytes] (included in the extrinsic)
        - included_in_signed_data: Optional[bytes] (included in the signed data)

        Returns:
        - merkleized_metadata.Proof (merkle proof for the extrinsic parts)
        """
        metadata_proof = merkleized_metadata.get_metadata_proof_for_extrinsic_parts(
            encoded_call,
            included_in_extrinsic,
            included_in_signed_data,
            encoded_metadata,
            extra_info
        )

        return metadata_proof

    @classmethod
    def _get_proof_for_extrinsic(
        cls,
        encoded_extrinsic: bytes,
        additional_signed: Optional[bytes],
        encoded_metadata: bytes,
    ) -> merkleized_metadata.Proof:
        """
        Get the merkle proof for the extrinsic.

        Args:
        - encoded_extrinsic: bytes (the encoded extrinsic to get the proof for)
        - additional_signed: bytes (additional signed data)
        - encoded_metadata: bytes (the encoded metadata)

        Returns:
        -  merkleized_metadata.Proof (merkle proof for the extrinsic)
        """
        proof = merkleized_metadata.generate_proof_for_extrinsic(
            encoded_extrinsic,  # [u8]
            additional_signed,  # Option<[u8]>
            encoded_metadata,  # [u8]
        )

        return proof

    @classmethod
    def _get_v15_metadata(
        cls,
        substrate: substrateinterface.SubstrateInterface,
        block_hash: Optional[str] = None,
    ) -> bytes:
        """
        Get the V15 metadata from the chain, scale encoded.

        Returns:
        - bytes (metadata)
        """
        scale_u32 = scalecodec.U32()
        scale_u32.value = 15

        if block_hash is None:
            block_hash = substrate.get_chain_finalised_head()

        v15_metadata = substrate.rpc_request(
            "state_call",
            ["Metadata_metadata_at_version", scale_u32.encode().to_hex(), block_hash],
        )  # Option<OpaqueMetadata>

        encoded_metadata = bytes.fromhex(v15_metadata["result"][2:])

        return encoded_metadata
    
    @staticmethod
    def _get_extrinsic_metadata(encoded_metadata: bytes) -> merkleized_metadata.ExtrinsicMetadata:
        """
        Get the extrinsic metadata from the encoded metadata.

        Args:
        - encoded_metadata: bytes (the encoded metadata)

        Returns:
        - merkleized_metadata.ExtrinsicMetadata (extrinsic metadata)
        """
        extrinsic_metadata = merkleized_metadata.get_extrinsic_metadata_portable(encoded_metadata)

        return extrinsic_metadata
    
    @staticmethod
    def _get_metadata_digest(encoded_metadata: bytes, extra_info: merkleized_metadata.ExtraInfo) -> merkleized_metadata.MetadataDigest:
        """
        Get the metadata digest from the encoded metadata.

        Args:
        - encoded_metadata: bytes (the encoded metadata)
        - extra_info: merkleized_metadata.ExtraInfo (extra info to include in the digest)

        Returns:
        - merkleized_metadata.MetadataDigest (metadata digest)
        """
        metadata_digest = merkleized_metadata.generate_metadata_digest(encoded_metadata, extra_info)

        return metadata_digest
    
    @staticmethod
    def _get_metadata_proof(
        encoded_payload: bytes,
        additional_signed: Optional[bytes],
        encoded_metadata_v15: bytes,
        extra_info: merkleized_metadata.ExtraInfo,
    ) -> merkleized_metadata.MetadataProof:
        
        metadata_proof = merkleized_metadata.get_metadata_proof(
            encoded_payload,
            additional_signed,
            encoded_metadata_v15,
            extra_info
        )

        return metadata_proof

    def sign_transaction(
        self,
        substrate: substrateinterface.SubstrateInterface,
        signature_payload: SignaturePayload,
        path: BIP44_Path = BIP44_Path(),
        ss58_format: int = SS58_FORMAT_DEFAULT,
    ) -> substrateinterface.base.GenericExtrinsic:
        """
        Sign an extrinsic with the Ledger device.

        Args:
        - substrate: substrateinterface.SubstrateInterface (Substrate interface)
        - signature_payload: SignaturePayload (transaction to sign)
        - path: BIP44_Path (BIP44 path for the account)
        - ss58_format: int (SS58 format for the address; default is 42)

        Returns:
        - substrateinterface.base.GenericExtrinsic (signed transaction)
        """

        self.check_app_connection()

        public_key, ss58_address = self.show_address(path, request_user_confirmation=False)

        pub_keypair = substrateinterface.Keypair(
            public_key=public_key,
            ss58_address=ss58_address,
            private_key=None,
            ss58_format=ss58_format,
        )

        # Merkleize the metadata
        ## Init runtime to fill fields
        substrate.init_runtime()

        # Get the metadata
        ## Must be V15; Should match tx
        encoded_metadata: bytes = self._get_v15_metadata(substrate)

        # Setup extra info
        extra_info = merkleized_metadata.ExtraInfo(
            base58_prefix=ss58_format,
            decimals=substrate.token_decimals,
            spec_name=substrate.name.lower().replace(" ", "-"),
            spec_version=substrate.runtime_version,
            token_symbol=substrate.token_symbol,
        )

        # Get the metadata digest
        ## TODO: Verify this is correct
        metadata_digest = self._get_metadata_digest(
            encoded_metadata,
            extra_info
        )
        
        # Add the metadata to the extrinsic
        if metadata_digest.disabled:
            self.give_error("Metadata is disabled")
        metadata_digest_hash = bytes(metadata_digest.hash())

        # Get payload, adding metadata hash
        signature_payload.metadata_hash = metadata_digest_hash
        signature_payload.mode = True

        signature_payload_scale = signature_payload.encode(substrate)
        signature_payload_bytes: bytes = bytes(signature_payload_scale.data.data)

        # TODO: Not sure what this is
        additional_signed: Optional[bytes] = _get_additional_signed(encoded_metadata)

        # Get the metadata proof for the payload
        metadata_proof = self._get_metadata_proof(
            signature_payload_bytes,
            additional_signed,
            encoded_metadata,
            extra_info
        )
        metadata_proof_bytes = bytes(metadata_proof.encode())

        # Get signed output
        signature = self.api.sign_transaction(
            self.transport, path, signature_payload_bytes, metadata_proof_bytes
        )

        # Validate output
        if len(signature) != 65:
            self.give_error("Invalid signature length")

        # Add signature to transaction
        signed_tx = signature_payload.create_signed_extrinsic(
            substate=substrate, keypair=pub_keypair, signature=signature,
        )

        return signed_tx
    
    def sign_transaction_using_parts(
        self,
        substrate: substrateinterface.SubstrateInterface,
        signature_payload: SignaturePayload,
        path: BIP44_Path = BIP44_Path(),
        ss58_format: int = SS58_FORMAT_DEFAULT,
    ) -> substrateinterface.base.GenericExtrinsic:
        """
        Sign an extrinsic with the Ledger device.

        Args:
        - substrate: substrateinterface.SubstrateInterface (Substrate interface)
        - signature_payload: SignaturePayload (transaction to sign)
        - path: BIP44_Path (BIP44 path for the account)
        - ss58_format: int (SS58 format for the address; default is 42)

        Returns:
        - substrateinterface.base.GenericExtrinsic (signed transaction)
        """

        self.check_app_connection()

        public_key, ss58_address = self.show_address(path, request_user_confirmation=False)

        pub_keypair = substrateinterface.Keypair(
            public_key=public_key,
            ss58_address=ss58_address,
            private_key=None,
            ss58_format=ss58_format,
        )

        # Merkleize the metadata
        ## Init runtime to fill fields
        substrate.init_runtime()

        # Get the metadata
        ## Must be V15; Should match tx
        encoded_metadata: bytes = self._get_v15_metadata(substrate)

        # Setup extra info
        extra_info = merkleized_metadata.ExtraInfo(
            base58_prefix=ss58_format,
            decimals=substrate.token_decimals,
            spec_name=substrate.name.lower().replace(" ", "-"),
            spec_version=substrate.runtime_version,
            token_symbol=substrate.token_symbol,
        )

        # Get the metadata digest
        ## TODO: Verify this is correct
        metadata_digest = self._get_metadata_digest(
            encoded_metadata,
            extra_info
        )
        
        # Add the metadata to the extrinsic
        if metadata_digest.disabled:
            self.give_error("Metadata is disabled")
        metadata_digest_hash: bytes = bytes(metadata_digest.hash())

        # Get payload, adding metadata hash
        signature_payload.metadata_hash = metadata_digest_hash
        signature_payload.mode = True

        signature_payload_scale = signature_payload.encode(substrate)
        signature_payload_bytes: bytes = bytes(signature_payload_scale.data.data)

        call = signature_payload.call
        encoded_call = bytes(call.encode().data)

        
        # TODO: ?
        included_in_extrinsic: Optional[bytes] = None
        included_in_signed_data: Optional[bytes] = None

        # Get the metadata proof for the payload
        metadata_proof = self._get_metadata_proof_for_extrinsic_parts(
            encoded_call,
            encoded_metadata,
            extra_info,
            included_in_extrinsic,
            included_in_signed_data,
        )
        metadata_proof_bytes = bytes(metadata_proof.encode())

        # Get signed output
        signature = self.api.sign_transaction(
            self.transport, path, signature_payload_bytes, metadata_proof_bytes
        )

        # Validate output
        if len(signature) != 65:
            self.give_error("Invalid signature length")

        # Add signature to transaction
        signed_tx = signature_payload.create_signed_extrinsic(
            substate=substrate, keypair=pub_keypair, signature=signature,
        )

        return signed_tx
        
    
    def sign_transaction_using_extrinsic(
        self,
        substrate: substrateinterface.SubstrateInterface,
        signature_payload: SignaturePayload,
        path: BIP44_Path = BIP44_Path(),
        ss58_format: int = SS58_FORMAT_DEFAULT,
    ) -> substrateinterface.base.GenericExtrinsic:
        """
        Sign an extrinsic with the Ledger device.

        Args:
        - substrate: substrateinterface.SubstrateInterface (Substrate interface)
        - signature_payload: SignaturePayload (transaction to sign)
        - path: BIP44_Path (BIP44 path for the account)
        - ss58_format: int (SS58 format for the address; default is 42)

        Returns:
        - substrateinterface.base.GenericExtrinsic (signed transaction)
        """

        self.check_app_connection()

        public_key, ss58_address = self.show_address(path, request_user_confirmation=False)

        pub_keypair = substrateinterface.Keypair(
            public_key=public_key,
            ss58_address=ss58_address,
            private_key=None,
            ss58_format=ss58_format,
        )

        # Merkleize the metadata
        ## Init runtime to fill fields
        substrate.init_runtime()

        # Get the metadata
        ## Must be V15; Should match tx
        encoded_metadata: bytes = self._get_v15_metadata(substrate)

        # Setup extra info
        extra_info = merkleized_metadata.ExtraInfo(
            base58_prefix=ss58_format,
            decimals=substrate.token_decimals,
            spec_name=substrate.name.lower().replace(" ", "-"),
            spec_version=substrate.runtime_version,
            token_symbol=substrate.token_symbol,
        )

        # Get the metadata digest
        ## TODO: Verify this is correct
        metadata_digest = self._get_metadata_digest(
            encoded_metadata,
            extra_info
        )
        
        # Add the metadata to the extrinsic
        if metadata_digest.disabled:
            self.give_error("Metadata is disabled")
        metadata_digest_hash: bytes = bytes(metadata_digest.hash())

        # Get payload, adding metadata hash
        signature_payload.metadata_hash = metadata_digest_hash
        signature_payload.mode = True

        # Get unsigned extrinsic
        unsigned_ext = signature_payload.create_signed_extrinsic(
            substrate=substrate, keypair=pub_keypair, signature=bytes.fromhex("00" * 65) # Empty signature
        )
        unsigned_ext_bytes: bytes = bytes(unsigned_ext.encode().data)
        

        # TODO: Not sure what this is
        additional_signed: Optional[bytes] = _get_additional_signed(encoded_metadata)

        # Get the metadata proof for the payload
        metadata_proof = self._get_metadata_proof(
            unsigned_ext_bytes,
            additional_signed,
            encoded_metadata,
            extra_info
        )
        metadata_proof_bytes = bytes(metadata_proof.encode())

        # Get signed output
        signature = self.api.sign_transaction(
            self.transport, path, unsigned_ext_bytes, metadata_proof_bytes
        )

        # Validate output
        if len(signature) != 65:
            self.give_error("Invalid signature length")

        # Add signature to transaction
        signed_tx = signature_payload.create_signed_extrinsic(
            substate=substrate, keypair=pub_keypair, signature=signature,
        )

        return signed_tx
    
    
    def sign_message(
        self,
        message: Union[str, bytes, bytearray, int],
        path: BIP44_Path = BIP44_Path(),
    ) -> bytes:
        """
        Sign a message with the Ledger device.

        Args:
        - message: Union[str, bytes, bytearray, int] (message to sign)
        - path: BIP44_Path (BIP44 path for the account)

        Returns:
        - bytes (signed message)
        """
        if type(message) not in {str, bytes, bytearray, int}:
            self.give_error("Invalid message type, must be str, bytes, bytearray, or int")

        self.check_app_connection()

        # Get signed output
        signature = self.api.sign_message(
            self.transport, path, message
        )

        # Validate output
        if len(signature) != 65:
            self.give_error("Invalid signature length")

        return signature
