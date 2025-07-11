import os

dir_path = os.path.dirname(os.path.realpath(__file__))

def load_graphql_query(file_path: str) -> str:
    with open(file_path, "r") as file:
        return file.read()