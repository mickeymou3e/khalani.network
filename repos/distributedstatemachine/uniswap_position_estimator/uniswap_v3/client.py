import requests

class GraphQLClient:
    """Serves as the client to the GraphQL data source.
    This class connects to a GraphQL endpoint and retrieves
    the data requested by the query.
    """
    def __init__(self, endpoint: str, headers: dict = None):
        """
        :param endpoint: The GraphQL endpoint.
        :param headers: Any headers that need to be set for the request.
        """
        self.endpoint = endpoint
        self.headers = headers or {}

    def get(self, query: str, variables: dict = None):
        """
        :param query: The GraphQL query string.
        :param variables: Any variables for the query.
        :return: The response from the GraphQL endpoint.
        """
        payload = {
            "query": query,
            "variables": variables
        }

        try:
            response = requests.post(
                self.endpoint,
                json=payload,
                headers=self.headers
            )
            
            # This will raise an HTTPError if the HTTP request returned an unsuccessful status code
            response.raise_for_status()

            return response.json()
        
        except requests.HTTPError:
            raise Exception(f"GraphQL query failed with status code {response.status_code}: {response.text}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred: {str(e)}")
