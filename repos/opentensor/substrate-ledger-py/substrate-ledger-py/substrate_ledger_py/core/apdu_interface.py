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

from enum import Enum, IntEnum
from typing import Dict, List, Optional, Tuple, Union

from dataclasses import dataclass

import ledgercomm
import ledgercomm.transport

from .ledger_types import BIP44_Path, LedgerDeviceNames

# Constants

LEDGER_POLKADOT_APP_CLA = 0xF9
# See: https://github.com/Zondax/ledger-substrate-js/blob/cc988aecb8f1d80a2f1af1c302598f5a208b1007/src/generic_app.ts#L40C10-L40C14
# TODO: Appears to mismatch with APDU spec: https://github.com/Zondax/ledger-polkadot/issues/228
# See: https://github.com/Zondax/ledger-polkadot/blob/da683ae2fc150366680a5b31bd82c2dc845eb753/docs/APDUSPEC.md

LEDGER_POLKADOT_APP_CHUNK_SIZE = 250  # The chunk size for the transaction data
# See: https://github.com/Zondax/ledger-substrate-js/blob/cc988aecb8f1d80a2f1af1c302598f5a208b1007/src/common.ts#L27

SS58_FORMAT_DEFAULT = 42  # Bittensor format (and Substrate default)


class LedgerReturn(Enum):
    """
    Maps the return codes from the Ledger to human-readable
    TODO: Find documenation
    """

    LOCKED = 0x5515

    @classmethod
    def to_error_message(cls, return_code: int) -> str:
        _return_messages: Dict[int, str] = dict(
            {
                # TODO: grab all codes and messages
                cls.LOCKED.value: "Device is locked",
            }
        )

        message = _return_messages.get(return_code)
        if message is None:
            raise ValueError(f"Unknown return code: {return_code}")
        return message


class LedgerPolkadotAppInstruction(IntEnum):
    """
    Instruction codes for the Ledger Polkadot app
    See: https://github.com/Zondax/ledger-polkadot/blob/da683ae2fc150366680a5b31bd82c2dc845eb753/docs/APDUSPEC.md
    """

    GET_VERSION = 0x00
    INS_GET_ADDR = 0x01
    INS_SIGN = 0x02
    INS_SIGN_RAW = 0x03


class LedgerPolkadotAppReturn(Enum):
    """
    Maps the return codes from the Ledger Polkadot app to human-readable
    See: https://github.com/Zondax/ledger-polkadot/blob/da683ae2fc150366680a5b31bd82c2dc845eb753/docs/APDUSPEC.md#return-codes
    """

    EXECUTION = 0x6400
    WRONG_BUFFER_LENGTH = 0x6700
    EMPTY_BUFFER = 0x6982
    OUTPUT_BUFFER_TOO_SMALL = 0x6983
    DATA_IS_INVALID = 0x6984
    COMMAND_NOT_ALLOWED = 0x6986
    TX_NOT_INITIALIZED = 0x6987
    P1_P2_INVALID = 0x6B00
    INS_NOT_SUPPORTED = 0x6D00
    CLA_NOT_SUPPORTED = 0x6E00
    UNKNOWN = 0x6F00
    SIGN_VERIFY_ERROR = 0x6F01
    SUCCESS = 0x9000

    @classmethod
    def to_error_message(cls, return_code: int) -> str:
        _return_messages: Dict[int, str] = dict(
            {
                cls.EXECUTION.value: "Execution error",
                cls.WRONG_BUFFER_LENGTH.value: "Wrong buffer length",
                cls.EMPTY_BUFFER.value: "Empty buffer",
                cls.OUTPUT_BUFFER_TOO_SMALL.value: "Output buffer too small",
                cls.DATA_IS_INVALID.value: "Data is invalid",
                cls.COMMAND_NOT_ALLOWED.value: "Command not allowed",
                cls.TX_NOT_INITIALIZED.value: "Tx is not initialized",
                cls.P1_P2_INVALID.value: "P1/P2 are invalid",
                cls.INS_NOT_SUPPORTED.value: "INS not supported",
                cls.CLA_NOT_SUPPORTED.value: "CLA not supported",
                cls.UNKNOWN.value: "Unknown",
                cls.SIGN_VERIFY_ERROR.value: "Sign / verify error",
                cls.SUCCESS.value: "Success",
            }
        )

        message = _return_messages.get(return_code)

        return message


class LedgerError(ValueError):
    pass


@dataclass
class LedgerAPDU:
    CLA: int
    INS: Union[int, IntEnum]
    P1: int = 0
    P2: int = 0
    option: Optional[int] = None
    cdata: bytes = b""


class LedgerAPDUInterface:
    """
    APDU interface for the Ledger hardware wallet.
    Uses the passed transport to communicate with the device.
    Constructs the APDUs and messages to send to the device.

    See the APDU specification for the Ledger Generic Polkadot app, which
    we are using for this Ledger integration:
    https://github.com/Zondax/ledger-polkadot/blob/da683ae2fc150366680a5b31bd82c2dc845eb753/docs/APDUSPEC.md#general-structure
    """

    def __init__(self) -> None:
        pass

    @staticmethod
    def _call_apdu(
        transport: ledgercomm.transport.Transport, apdu: LedgerAPDU
    ) -> Tuple[int, bytes]:
        """
        Makes the APDU call to the Ledger device and returns the response.

        Note: This is a blocking call.

        Args:
        - transport: ledgercomm.transport.Transport
        - apdu: LedgerAPDU

        Returns:
        - return_code: int (return code for the call)
        - response: bytes (response bytes)
        """

        transport.send(
            cla=apdu.CLA,
            ins=apdu.INS,
            p1=apdu.P1,
            p2=apdu.P2,
            option=apdu.option,
            cdata=apdu.cdata,
        )

        # Blocking IO
        return_code, response = transport.recv()

        return return_code, response

    @staticmethod
    def _check_return_code(return_code: int) -> Tuple[bool, Optional[str]]:
        """
        Check the return code from the Ledger device and return an error message if necessary.
        Note: this only supports return codes from the Generic Polkadot Ledger app.
        """
        if return_code != LedgerPolkadotAppReturn.SUCCESS.value:
            error_message = LedgerPolkadotAppReturn.to_error_message(return_code)
            if error_message is None:
                # Try regular Ledger return codes
                error_message = LedgerReturn.to_error_message(return_code)
            return False, error_message
        return True, None

    def get_device_info(
        self, transport: ledgercomm.transport.Transport
    ) -> Tuple[Optional[LedgerDeviceNames], str, str]:
        """
        Get device information from the Ledger device.
        Returns the device name (or None), OS version, and MCU version
        """

        # Construct APDU
        """
        CLA 	byte (1) 	Application Identifier 	0xE0
        INS 	byte (1) 	Instruction ID 	0x01
        P1 	byte (1) 	Parameter 1 	0x00
        P2 	byte (1) 	Parameter 2 	0x00
        L 	byte (1) 	Bytes in payload 	0x00

        Reference:
        https://github.com/Zondax/ledger-polkadot/blob/da683ae2fc150366680a5b31bd82c2dc845eb753/docs/APDUSPEC.md#get_device_info
        """
        CLA = 0xE0
        INS = 0x01
        P1 = 0x00
        P2 = 0x00
        # L = 0x00 # Handled by LedgerComm

        # Blocking IO
        return_code, response = self._call_apdu(transport, LedgerAPDU(CLA, INS, P1, P2))

        # Check return code
        success, error_message = self._check_return_code(return_code)
        if not success:
            raise LedgerError(error_message)

        # Decode response
        """
        TARGET_ID 	byte (4) 	Target Id 	
        OS_LEN 	byte (1) 	OS version length 	0..64
        OS 	byte (?) 	OS version 	Non terminated string
        FLAGS_LEN 	byte (1) 	Flags length 	0
        MCU_LEN 	byte (1) 	MCU version length 	0..64
        MCU 	byte (?) 	MCU version 	Non terminated string
        SW1-SW2 	byte (2) 	Return code 	see list of return codes
        """
        target_id = response[:4]
        os_len = response[4]
        os_version = response[5 : 5 + os_len]
        mcu_len = response[5 + os_len]
        mcu_version = response[5 + os_len + 1 : 5 + os_len + 1 + mcu_len]
        # sw1_sw2 not in the response body

        return (
            LedgerDeviceNames.from_target_id(int.from_bytes(target_id, "big")),
            os_version.decode(),
            mcu_version.decode(),
        )

    def get_version(
        self, transport: ledgercomm.transport.Transport
    ) -> Tuple[bool, str, bool, Optional[LedgerDeviceNames]]:
        """
        Gets the Generic Polkdaot Ledger app version.

        Returns a tuple of:
        - test: bool (True if app is in test mode)
        - version: str (in semver format)
        - locked: bool (always False)
        - device_name: Optional[LedgerDeviceNames]
        """
        # Construct APDU
        """
        CLA 	byte (1) 	Application Identifier 	0x90
        INS 	byte (1) 	Instruction ID 	0x00
        P1 	byte (1) 	Parameter 1 	ignored
        P2 	byte (1) 	Parameter 2 	ignored
        L 	byte (1) 	Bytes in payload 	0   

        Reference:
        https://github.com/Zondax/ledger-polkadot/blob/da683ae2fc150366680a5b31bd82c2dc845eb753/docs/APDUSPEC.md#get_version
        """
        CLA = LEDGER_POLKADOT_APP_CLA
        INS = LedgerPolkadotAppInstruction.GET_VERSION
        # P1 = 0x00 # ignored
        # P2 = 0x00 # ignored
        # L = 0x00 # Handled by LedgerComm

        # Blocking IO
        return_code, response = self._call_apdu(transport, LedgerAPDU(CLA, INS))

        # Check return code
        success, error_message = self._check_return_code(return_code)
        if not success:
            raise LedgerError(error_message)

        # Decode response
        """
        TEST 	byte (1) 	Test Mode 	0x01 means test mode is enabled
        MAJOR 	byte (2) 	Version Major 	0..65535
        MINOR 	byte (2) 	Version Minor 	0..65535
        PATCH 	byte (2) 	Version Patch 	0..65535
        LOCKED 	byte (1) 	Device is locked 	It'll always be 0
        TARGET_ID 	byte (4) 	Target Id 	
        SW1-SW2 	byte (2) 	Return code 	see list of return codes
        """
        test = bool(response[0])
        major = int.from_bytes(response[1:3], "big")
        minor = int.from_bytes(response[3:5], "big")
        patch = int.from_bytes(response[5:7], "big")
        locked = bool(response[7])
        target_id = response[8:12]
        # sw1_sw2 not in the response body

        return (
            test,
            f"{major}.{minor}.{patch}",
            locked,
            LedgerDeviceNames.from_target_id(int.from_bytes(target_id, "big")),
        )
    
    @staticmethod
    def _harden_bip44_path_segment(path_segment: int) -> int:
        """
        Hardens the BIP44 path segment by adding the hardened bit.
        """

        return 0x80000000 | path_segment

    @classmethod
    def _serialize_bip44_path(cls, path: BIP44_Path) -> bytes:
        """
        Serialize the BIP44 path for the Ledger Polkadot app.
        The path is serialized as a byte array of 5 4-byte integers.

        Takes a BIP44_Path object and returns bytes of the serialized path.
        """

        """
        JS Implementation: Notice the use of Little Endian encoding

            const buf = Buffer.alloc(20)
            buf.writeUInt32LE(0x8000002c, 0)
            buf.writeUInt32LE(slip0044, 4)
            buf.writeUInt32LE(account, 8)
            buf.writeUInt32LE(change, 12)
            buf.writeUInt32LE(addressIndex, 16)
            return buf
        
        Attribution:
        Zondax/ledger-substrate-js
        License: https://github.com/Zondax/ledger-substrate-js/blob/cc988aecb8f1d80a2f1af1c302598f5a208b1007/LICENSE
        https://github.com/Zondax/ledger-substrate-js/blob/cc988aecb8f1d80a2f1af1c302598f5a208b1007/src/common.ts#L279C3-L285C13
        """

        inputs = bytearray()
        masked_bip44 = cls._harden_bip44_path_segment(path.purpose)
        inputs += int.to_bytes(
            masked_bip44, length=4, byteorder="little"
        )  # BIP44 Purpose
        masked_slip44 = cls._harden_bip44_path_segment(path.slip44)
        inputs += int.to_bytes(
            masked_slip44, length=4, byteorder="little"
        )  # Polkadot slip44
        masked_account_index = cls._harden_bip44_path_segment(path.account_id)
        inputs += int.to_bytes(
            masked_account_index, length=4, byteorder="little"
        )  # Account Index
        masked_change = cls._harden_bip44_path_segment(path.change)
        inputs += int.to_bytes(masked_change, length=4, byteorder="little")  # Change
        masked_address_offset = cls._harden_bip44_path_segment(path.address_offset)
        inputs += int.to_bytes(
            masked_address_offset, length=4, byteorder="little"
        )  # Address Index/Offset

        return bytes(inputs)

    def get_address(
        self,
        transport: ledgercomm.transport.Transport,
        path: BIP44_Path,
        ss58_format: int = SS58_FORMAT_DEFAULT,
        request_user_confirmation: bool = False,
    ) -> Tuple[bytes, str]:
        """
        Gets the Generic Polkdaot Ledger app version.

        Note: Only the `slip44` for Polkadot (`0x162`) is supported.

        Args:
        - transport: ledgercomm.transport.Transport
        - path: BIP44_Path
        - ss58_format: int (default: 42)
        - request_user_confirmation: bool (default: False)
            Ask the user for confirmation on the device, displaying the address.

        Returns a tuple of:
        - public_key: bytes (32 bytes)
        - address: str (SS58 encoded)
        """

        # Construct APDU
        """
        CLA 	byte (1) 	Application Identifier 	0x90
        INS 	byte (1) 	Instruction ID 	0x01
        P1 	byte (1) 	Request User confirmation 	No = 0 / Yes = 1
        P2 	byte (1) 	Parameter 2 	ignored
        L 	byte (1) 	Bytes in payload 	22 bytes
        Path[0] 	byte (4) 	Derivation Path Data 	0x80000000 | 44
        Path[1] 	byte (4) 	Derivation Path Data 	0x80000000 | 354
        Path[2] 	byte (4) 	Derivation Path Data 	?
        Path[3] 	byte (4) 	Derivation Path Data 	?
        Path[4] 	byte (4) 	Derivation Path Data 	?
        SS58 	byte (2) 	SS58 for addr encoding 	?

        Reference:
        https://github.com/Zondax/ledger-polkadot/blob/main/docs/APDUSPEC.md#ins_get_addr
        """
        CLA = LEDGER_POLKADOT_APP_CLA
        INS = LedgerPolkadotAppInstruction.INS_GET_ADDR.value
        P1 = int(request_user_confirmation)
        # P2 = 0x00 # ignored
        # L = 22 # Handled by LedgerComm

        # Serialize BIP44 path
        inputs = self._serialize_bip44_path(path)
        # Add SS58 format bytes
        inputs += int.to_bytes(ss58_format, length=2, byteorder="little")  # SS58 Format

        # Blocking IO
        return_code, response = self._call_apdu(
            transport, LedgerAPDU(CLA, INS, P1, cdata=bytes(inputs))
        )

        # Check return code
        success, error_message = self._check_return_code(return_code)
        if not success:
            raise LedgerError(error_message)

        # Decode response
        """
        PK 	byte (32) 	Public Key 	
        ADDR 	byte (??) 	address 	
        SW1-SW2 	byte (2) 	Return code 
            see list of return codes  # TODO: incorrect return. No code is returned.
        """
        public_key = response[:32]
        address = response[32:]
        # sw1_sw2 not in the response body

        return public_key, address.decode()

    @staticmethod
    def _chunk_bytes(bytes: bytes, chunk_size: int) -> List[bytes]:
        """
        Chunks a bytes into a list of chunks of `chunk_size` bytes.

        Args:
        - bytes: bytes (data to chunk)
        - chunk_size: int (size of each chunk)
        """
        chunks = []
        for i in range(0, len(bytes), chunk_size):
            # Stops at the end of bytes if the chunk size is larger than the remaining bytes
            chunks.append(bytes[i : i + chunk_size])
        return chunks

    @classmethod
    def _chunk_path_tx_and_metadata(
        cls, path_bytes: bytes, tx_bytes: bytes, metadata_bytes: bytes
    ) -> List[bytes]:
        chunks = []
        # First chunk
        chunk = path_bytes + len(tx_bytes).to_bytes(2, "little")
        chunks.append(chunk)

        # Other chunks
        tx_chunks = cls._chunk_bytes(
            tx_bytes + metadata_bytes, LEDGER_POLKADOT_APP_CHUNK_SIZE
        )

        chunks.extend(tx_chunks)

        return chunks

    @staticmethod
    def _create_chunk_APDU(
        CLA: int, INS: int, chunk_idx: int, chunks: int, chunk: bytes
    ) -> LedgerAPDU:
        """
        Constructs an APDU for a chunk of transcation data to send to the Ledger device.

        Args:
        - CLA: int
        - INS: int
        - chunk_idx: int (index of the chunk)
        - chunks: int (total number of chunks)
        - chunk: bytes (chunk of transaction data)

        Returns:
        - LedgerAPDU (APDU for the chunk)
        """

        """
        CLA 	byte (1) 	Application Identifier 	0x90
        INS 	byte (1) 	Instruction ID 	0x02
        P1 	byte (1) 	Payload desc 	0 = init
                                        1 = add
                                        2 = last
        P2 	byte (1) 	Parameter 2 	ignored
        L 	byte (1) 	Bytes in payload 	(depends)

        The first packet/chunk includes only the derivation path and tx length.

        All other packets/chunks contain data chunks that are described below. 
        Blob + metadata should be concatenated without spacing.

        ## First Packet
        Path[0] 	byte (4) 	Derivation Path Data 	0x80000000 | 44
        Path[1] 	byte (4) 	Derivation Path Data 	0x80000000 | 354
        Path[2] 	byte (4) 	Derivation Path Data 	?
        Path[3] 	byte (4) 	Derivation Path Data 	?
        Path[4] 	byte (4) 	Derivation Path Data 	?
        BLOB L 	byte (2) 	Length of blob (excluding metadata) 	?

        ## Other Chunks/Packets
        Message 	bytes... 	Message to Sign 	

        Reference:
        https://github.com/Zondax/ledger-polkadot/blob/0760d8cf8491b5cf356dc7a09d29ec7de8d273a8/docs/APDUSPEC.md#ins_sign
        """
        # P1 # Different per chunk, handled below
        # P2 = 0x00 # ignored

        # Construct APDU
        if chunk_idx == 0:
            # First chunk
            chunk_type = 0
        elif chunk_idx < chunks - 1:
            # Middle chunk
            chunk_type = 1
        else:
            # Last chunk
            chunk_type = 2

        P1 = chunk_type

        return LedgerAPDU(CLA, INS, P1, cdata=bytes(chunk))

    @classmethod
    def _sign(
        cls,
        transport: ledgercomm.transport.Transport,
        path_bytes: bytes,
        tx_bytes: bytes,
        metadata_bytes: bytes,
    ) -> bytes:
        """
        Gets the Generic Polkdaot Ledger app version.

        Note: Only the `slip44` for Polkadot (`0x162`) is supported.

        Args:
        - transport: ledgercomm.transport.Transport
        - path_bytes: bytes (serialized BIP44 path)
        - tx_bytes: bytes (transaction bytes)
        - metadata_bytes: bytes (metadata)

        Returns a tuple of:
        - sig: bytes (65 bytes) (transaction signature)
        """
        # Construct APDU
        """
        CLA 	byte (1) 	Application Identifier 	0x90
        INS 	byte (1) 	Instruction ID 	0x02
        P1 	byte (1) 	Payload desc 	0 = init
                                        1 = add
                                        2 = last
        P2 	byte (1) 	Parameter 2 	ignored
        L 	byte (1) 	Bytes in payload 	(depends)

        The first packet/chunk includes only the derivation path and tx length.

        All other packets/chunks contain data chunks that are described below. 
        Blob + metadata should be concatenated without spacing.

        ## First Packet
        Path[0] 	byte (4) 	Derivation Path Data 	0x80000000 | 44
        Path[1] 	byte (4) 	Derivation Path Data 	0x80000000 | 354
        Path[2] 	byte (4) 	Derivation Path Data 	?
        Path[3] 	byte (4) 	Derivation Path Data 	?
        Path[4] 	byte (4) 	Derivation Path Data 	?
        BLOB L 	byte (2) 	Length of blob (excluding metadata) 	?

        ## Other Chunks/Packets
        Message 	bytes... 	Message to Sign 	

        Reference:
        https://github.com/Zondax/ledger-polkadot/blob/0760d8cf8491b5cf356dc7a09d29ec7de8d273a8/docs/APDUSPEC.md#ins_sign
        """
        CLA = LEDGER_POLKADOT_APP_CLA
        INS = LedgerPolkadotAppInstruction.INS_SIGN.value
        # P1 # Different per chunk, handled below
        # P2 = 0x00 # ignored

        # Chunk all the path and tx data
        chunks = cls._chunk_path_tx_and_metadata(path_bytes, tx_bytes, metadata_bytes)
        # Send each chunk
        for i, chunk in enumerate(chunks):
            apdu = cls._create_chunk_APDU(CLA, INS, i, len(chunks), chunk)
            # Blocking IO
            return_code, response = cls._call_apdu(transport, apdu)

            # Check return code
            success, error_message = cls._check_return_code(return_code)
            if not success:
                raise LedgerError(error_message)

        # Decode response from the last chunk
        """
        SIG 	byte (65) 	Signature 	
        SW1-SW2 	byte (2) 	Return code 	see list of return codes
        """
        sig = response[:65]  # Should be all the buffer
        # sw1_sw2 not in the response body

        return sig

    @classmethod
    def _sign_raw(
        cls, transport: ledgercomm.transport.Transport, path_bytes: bytes, data: bytes
    ) -> bytes:
        """
        Gets the Generic Polkdaot Ledger app version.

        Note: Only the `slip44` for Polkadot (`0x162`) is supported.

        Args:
        - transport: ledgercomm.transport.Transport
        - path_bytes: bytes (serialized BIP44 path)
        - data: bytes (data bytes)

        Returns a tuple of:
        - sig: bytes (65 bytes) (data signature)
        """
        # Construct APDU
        """
        CLA 	byte (1) 	Application Identifier 	0x90
        INS 	byte (1) 	Instruction ID      	0x03
        P1 	    byte (1) 	Payload desc 	    0 = init
                                                1 = add
                                                2 = last
        P2 	    byte (1) 	Parameter 2 	        ignored
        L 	    byte (1) 	Bytes in payload 	    (depends)

        The first packet/chunk includes only the derivation path

        All other packets/chunks contain data chunks that are described below

        ## First Packet
        Path[0] 	byte (4) 	Derivation Path Data 	0x80000000 | 44
        Path[1] 	byte (4) 	Derivation Path Data 	0x80000000 | 354
        Path[2] 	byte (4) 	Derivation Path Data 	?
        Path[3] 	byte (4) 	Derivation Path Data 	?
        Path[4] 	byte (4) 	Derivation Path Data 	?
        MSG L 	    byte (2) 	Length of message 	    ?

        ## Other Chunks/Packets
        Message 	bytes... 	Message to Sign 	

        Reference:
        https://github.com/Zondax/ledger-polkadot/blob/0760d8cf8491b5cf356dc7a09d29ec7de8d273a8/docs/APDUSPEC.md#ins_sign_raw
        """
        CLA = LEDGER_POLKADOT_APP_CLA
        INS = LedgerPolkadotAppInstruction.INS_SIGN_RAW.value
        # P1 # Different per chunk, handled below
        # P2 = 0x00 # ignored

        # Add prefix and postfix to data
        ## Required for signing raw data. Perhaps to prevent signing valid transactions.
        ## See: https://github.com/Zondax/ledger-polkadot/blob/0760d8cf8491b5cf356dc7a09d29ec7de8d273a8/app/src/common/tx.c#L74
        prefix = "<Bytes>".encode()
        postfix = "</Bytes>".encode()

        data = prefix + data + postfix

        chunks = []
        # First chunk 
        ## Length Not needed ???
        first_chunk = path_bytes + len(data).to_bytes(2, "little") 
        
        chunks.append(first_chunk)

        # Other chunks
        data_chunks = cls._chunk_bytes(
            data, LEDGER_POLKADOT_APP_CHUNK_SIZE
        )

        chunks.extend(data_chunks)

        # Send each chunk
        for i, chunk in enumerate(chunks):
            apdu = cls._create_chunk_APDU(CLA, INS, i, len(chunks), chunk)
            # Blocking IO
            return_code, response = cls._call_apdu(transport, apdu)

            # Check return code
            success, error_message = cls._check_return_code(return_code)
            if not success:
                raise LedgerError(error_message)

        # Decode response from the last chunk
        """
        SIG 	byte (65) 	Signature 	
        SW1-SW2 byte (2) 	Return code 	
            see list of return codes
        """
        sig = response[:65]  # Should be all the buffer
        # sw1_sw2 not in the response body

        return sig

    def sign_message(
        self, transport: ledgercomm.transport.Transport, path: BIP44_Path, message: Union[str, bytes, bytearray, int]
    ) -> bytes:
        """
        Signs a message with the Ledger device.
        This is a raw message signature, not a transaction signature.

        Args:
        - transport: ledgercomm.transport.Transport
        - path: BIP44_Path (path to sign with)
        - message: Union[str, bytes, bytearray, int] (message to sign)

        Returns:
        - sig: bytes (65 bytes) (message signature)
        """

        message_bytes: bytes
        if isinstance(message, int):
            message_bytes = message.to_bytes(4, "little")
        elif isinstance(message, bytes):
            message_bytes = message
        elif isinstance(message, bytearray):
            message_bytes = bytes(message)
        elif isinstance(message, str):
            message_bytes = message.encode()
        else:
            raise ValueError("Sequence must be an int, bytes, or str")

        sig = self._sign_raw(
            transport, self._serialize_bip44_path(path), message_bytes
        )

        return sig

    def sign_transaction(
        self,
        transport: ledgercomm.transport.Transport,
        path: BIP44_Path,
        serialized_tx: bytes,
        metadata_bytes: bytes,
    ) -> bytes:
        sig = self._sign(
            transport, self._serialize_bip44_path(path), serialized_tx, metadata_bytes
        )

        return sig
