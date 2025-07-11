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

from enum import Enum
from typing import Optional

from dataclasses import dataclass

LEDGER_POLKADOT_APP_SLIP44 = 0x162  # Appears to be only possible slip44. Should modulate the account derivation path instead.
# See: https://github.com/Zondax/ledger-substrate-js/blob/cc988aecb8f1d80a2f1af1c302598f5a208b1007/src/supported_apps.ts#L44
# Also: https://github.com/Zondax/ledger-substrate-js/blob/cc988aecb8f1d80a2f1af1c302598f5a208b1007/src/generic_legacy.ts#L66-L68


@dataclass
class BIP44_Path:
    """
    BIP44 Path representation
    """

    purpose: int = 44
    slip44: int = LEDGER_POLKADOT_APP_SLIP44
    account_id: int = 0  # Account Index
    change: int = 0
    address_offset: int = 0


class LedgerDeviceNames(Enum):
    """
    Maps the target_id integer to the device name

    Attribution:
        Taken from LedgerHQ/ledgerctl
        https://github.com/LedgerHQ/ledgerctl/blob/6bd85b62dc9eaf83f71e980f782a21b3a20cac1e/ledgerwallet/utils.py#L103
        License: https://github.com/LedgerHQ/ledgerctl/blob/6bd85b62dc9eaf83f71e980f782a21b3a20cac1e/LICENSE
    """

    LEDGER_NANO_S = "Ledger Nano S"
    LEDGER_NANO_X = "Ledger Nano X"
    LEDGER_NANO_SP = "Ledger Nano S+"
    LEDGER_BLUE = "Ledger Blue"
    LEDGER_STAX = "Ledger Stax"
    LEDGER_FLEX = "Ledger Flex"

    @classmethod
    def from_target_id(cls, target_id: int) -> Optional[str]:
        target_ids = {
            0x31100002: cls.LEDGER_NANO_S.value,  # firmware version <= 1.3.1
            0x31100003: cls.LEDGER_NANO_S.value,  # firmware version > 1.3.1
            0x31100004: cls.LEDGER_NANO_S.value,  # firmware version >= 1.5
            0x31000002: cls.LEDGER_BLUE.value,  # firmware version <= 2.0
            0x31010004: cls.LEDGER_BLUE.value,  # firmware version > 2.0
            0x33000004: cls.LEDGER_NANO_X.value,
            0x33100004: cls.LEDGER_NANO_SP.value,
            0x33200004: cls.LEDGER_STAX.value,
            0x33300004: cls.LEDGER_FLEX.value,
        }
        return target_ids.get(target_id)


@dataclass
class LedgerDeviceInfo:
    """
    Information about the Ledger device
    """

    device_name: Optional[LedgerDeviceNames]  # None if not recognized
    os_version: str
    mcu_version: str
