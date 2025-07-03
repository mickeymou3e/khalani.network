from eth_abi.abi import encode
from eth_utils import keccak, to_canonical_address

class OutcomeAssetStructure:
    AnySingle = 0
    Any = 1
    All = 2

class FillStructure:
    Exactly = 0
    Minimum = 1
    PctFilled = 2
    ConcreteRange = 3

OUTCOME_ASSET_STRUCTURE_MAP = {
    "AnySingle": OutcomeAssetStructure.AnySingle,
    "Any": OutcomeAssetStructure.Any,
    "All": OutcomeAssetStructure.All
}

FILL_STRUCTURE_MAP = {
    "Exact": FillStructure.Exactly,
    "Minimum": FillStructure.Minimum,
    "PercentageFilled": FillStructure.PctFilled,
    "ConcreteRange": FillStructure.ConcreteRange
}

def encode_intent(intent_data: dict) -> bytes:
    """Encode an intent struct according to the Solidity ABI specification."""
    intent_types = ['(address,uint256,uint256,address,uint256,(address[],uint256[],uint8,uint8))']
    
    intent_values = [(
        to_canonical_address(intent_data['author']),
        intent_data['ttl'],
        intent_data['nonce'],
        to_canonical_address(intent_data['srcMToken']),
        intent_data['srcAmount'],
        (
            [to_canonical_address(addr) for addr in intent_data['outcome']['mTokens']],
            intent_data['outcome']['mAmounts'],
            OUTCOME_ASSET_STRUCTURE_MAP[intent_data['outcome']['outcomeAssetStructure']],
            FILL_STRUCTURE_MAP[intent_data['outcome']['fillStructure']]
        )
    )]
    
    return encode(intent_types, intent_values)

def hash_intent(intent_data: dict) -> str:
    """Compute the keccak256 hash of an intent struct.
    
    Args:
        intent_data: Dictionary containing the intent data
        
    Returns:
        Hex string of the keccak256 hash
    """
    abi_encoded = encode_intent(intent_data)
    return f"0x{keccak(abi_encoded).hex()}"


def test():
    """Test function to demonstrate hashing an intent."""
    # Example intent
    test_intent = {
        "author": "0x5f0cf4281348c9dfd71777d69a16dc5f7729e13d",
        "ttl": 2**256 - 1,
        "nonce": 1742284519,
        "srcMToken": "0xa749ca1094b19d7147f05a228bada1e3a7bbdaaf",
        "srcAmount": 10000000000000000000,
        "outcome": {
            "mTokens": [
                "0xfabc02024f7427c4a22ed44204e472602d821925"
            ],
            "mAmounts": [
                20000000000000000000
            ],
            "outcomeAssetStructure": "AnySingle",
            "fillStructure": "PercentageFilled"
        }
    }
    
    intent_hash = hash_intent(test_intent)
    assert intent_hash == "0x406df59a93f9ae4617a427c1c2d0c376c6fb2f31e69eace1548fe5df20c65915"

if __name__ == "__main__":
    test()