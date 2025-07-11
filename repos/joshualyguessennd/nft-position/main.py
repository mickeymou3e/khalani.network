import requests
import os
import json

def load_graphql_query(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read()

def execute_graphql_query(query: str, variables: dict, endpoint: str = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3') -> dict:
    response = requests.post(endpoint, json={'query': query, 'variables': variables})
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"GraphQL query failed with status {response.status_code}: {response.content.decode()}")

if __name__ == "__main__":
    # Load GraphQL query from file
    query_path = os.path.join(os.getcwd(), 'queries', 'nft_positions_query.graphql')
    query = load_graphql_query(query_path)

    # Define variables for the GraphQL query
    variables = {
        'owner': '0x50ec05ade8280758e2077fcbc08d878d4aef79c3'
    }

    # Execute GraphQL query and get result
    result = execute_graphql_query(query, variables)
    print(json.dumps(result, indent=2))
    print("Variables:", variables)
