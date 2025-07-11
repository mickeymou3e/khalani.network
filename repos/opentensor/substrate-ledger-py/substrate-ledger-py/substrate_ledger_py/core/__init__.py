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

from .client import LedgerClient as LedgerClient, LedgerDeviceInfo as LedgerDeviceInfo, SignaturePayload as SignaturePayload
from .ledger_types import (
    BIP44_Path as BIP44_Path,
    LedgerDeviceNames as LedgerDeviceNames,
)
