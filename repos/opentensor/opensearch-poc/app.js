const express = require('express');
const { Client } = require('@opensearch-project/opensearch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
    node: process.env.OPENSEARCH_ENDPOINT,
    auth: {
        username: process.env.OPENSEARCH_USERNAME,
        password: process.env.OPENSEARCH_PASSWORD
    }
});

app.post('/index', async (req, res) => {
    try {
        const { index, id, body } = req.body;
        const response = await client.index({
            index,
            id,
            body
        });
        res.status(200).send(response.body);
    } catch (error) {
        console.error('Error indexing document:', error);
        res.status(500).send('Error indexing document');
    }
});

app.get('/document/:index/:id', async (req, res) => {
    try {
        const { index, id } = req.params;
        const response = await client.get({
            index,
            id
        });
        res.status(200).send(response.body);
    } catch (error) {
        console.error('Error retrieving document:', error);
        res.status(500).send('Error retrieving document');
    }
});

// Liveness probe
app.get('/liveness', (req, res) => {
    res.status(200).send('Liveness check OK');
});

// Readiness probe
app.get('/readiness', async (req, res) => {
    try {
        // Simple query to check if OpenSearch is available
        const response = await client.cluster.health();
        if (response.body.status) {
            res.status(200).send('Readiness check OK');
        } else {
            res.status(500).send('Readiness check failed');
        }
    } catch (error) {
        console.error('Error checking readiness:', error);
        res.status(500).send('Readiness check failed');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
