# Run local opensearch container with hackathon username and password
local-opensearch:
	docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "OPENSEARCH_SECURITY_DISABLE_ENVVAR=true" -e "OPENSEARCH_USERNAME=hackathon" -e "OPENSEARCH_PASSWORD=hackathon" opensearchproject/opensearch:2.11.0

local-build:
	docker build -t opensearch-poc:latest .

local-run: local-build
	docker run -ti --env-file .env opensearch-poc:latest

local-run-detached: local-build
	docker run -d -p 8080:8080 --env-file .env opensearch-poc:latest

os-poc-post-test:
	curl -X POST https://os-poc.hackathon.test.opentensor.ai/index -H 'Content-Type: application/json' -d '{"index": "test-index", "id": "1", "body": { "name": "test"}}'

os-poc-get-test:
	curl -X GET https://os-poc.hackathon.test.opentensor.ai/document/test-index/1