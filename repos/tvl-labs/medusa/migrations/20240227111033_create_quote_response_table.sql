-- Add migration script here
CREATE TABLE quote_response (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(255) NOT NULL,
    quote_id VARCHAR(255) NOT NULL UNIQUE,
    chain_id INT NOT NULL,
    token_in VARCHAR(255) NOT NULL,
    amount_in VARCHAR(255) NOT NULL,
    token_out VARCHAR(255) NOT NULL,
    amount_out VARCHAR(255) NOT NULL,
    filler VARCHAR(255) NOT NULL,
    FOREIGN KEY (request_id) REFERENCES quote_request(request_id) ON DELETE CASCADE
);
