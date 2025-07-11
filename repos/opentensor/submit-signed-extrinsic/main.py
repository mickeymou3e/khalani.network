import json
import requests
import sys
import argparse


def read_hex_extrinsic(file_path):
    with open(file_path, "r") as file:
        hex_extrinsic = file.read().strip()
    return hex_extrinsic


def submit_extrinsic(hex_extrinsic, node_url):
    headers = {"Content-Type": "application/json"}
    payload = {
        "jsonrpc": "2.0",
        "method": "author_submitExtrinsic",
        "params": [hex_extrinsic],
        "id": 1,
    }

    response = requests.post(node_url, data=json.dumps(payload), headers=headers)

    if response.status_code == 200 and response.json().get("result") is not None:
        tx_hash = response.json().get("result")
        print(f"Transaction submitted successfully. Tx Hash: {tx_hash}")
        return True
    elif response.status_code == 200 and response.json().get("error") is not None:
        if (
            response.json().get("error").get("message")
            == "Transaction is temporarily banned"
        ):
            print(f"Node rejected extrinsic: {response.json().get(
                'error')}. This specific message strongly indicates the transaction has already been submitted.")
        else:
            print(f"Node rejected extrinsic: {response.json().get(
                'error')}.")
        return False
    else:
        print(f"Error submitting extrinsic to the node: {
              response.status_code}, {response.text}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Submit a Substrate signed extrinsic.")
    parser.add_argument("node_url", type=str, help="The RPC URL of the Substrate node.")
    parser.add_argument(
        "extrinsic_file",
        type=str,
        help="The file containing the hex-encoded extrinsic.",
    )
    args = parser.parse_args()

    hex_extrinsic = read_hex_extrinsic(args.extrinsic_file)
    print(f"Hex Extrinsic: {hex_extrinsic}")

    success = submit_extrinsic(hex_extrinsic, args.node_url)
    if success:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
