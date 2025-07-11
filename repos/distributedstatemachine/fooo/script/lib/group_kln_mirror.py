import json

# Load kln_tokens_out.json
with open('./script/config/kln_tokens_out.json', 'r') as f:
    kln_tokens_out = json.load(f)

# Load mirror_tokens.json
with open('./script/config/mirror_tokens.json', 'r') as f:
    mirror_tokens = json.load(f)

# Prepare the output dictionary
output = {}

# Iterate over kln tokens
for kln_token, kln_address in kln_tokens_out["klnTokens"].items():

    # Add kln_token to output with an empty list
    output[kln_address] = []

    # Iterate over each chain in mirror_tokens.json
    for chain, data in mirror_tokens.items():
        if "symbols" in data:
            # Iterate over each symbol
            for index, symbol in enumerate(data["symbols"]):
                # Extract the prefix from the symbol
                prefix = symbol.split('.')[0]

                # Match kln[Suffix] with [Pefix].chainName
                if kln_token[3:] == prefix:
                    # If the suffix matches the prefix, append the mirrorToken to the list
                    output[kln_address].append(data["mirrorTokens"][index])

# Write the output to a new JSON file
with open('./script/config/kln_mirror_group.json', 'w') as f:
    json.dump(output, f, indent=2)
