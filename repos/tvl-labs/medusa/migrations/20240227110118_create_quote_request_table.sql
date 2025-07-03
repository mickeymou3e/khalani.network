-- Add migration script here
CREATE TABLE quote_request (
    id SERIAL PRIMARY KEY,
    token_in_chain_id INT NOT NULL,
    token_out_chain_id INT NOT NULL,
    request_id VARCHAR(255) NOT NULL UNIQUE,
    quote_id VARCHAR(255) NOT NULL,
    token_in VARCHAR(255) NOT NULL,
    token_out VARCHAR(255) NOT NULL,
    amount VARCHAR(255) NOT NULL,
    swapper VARCHAR(255) NOT NULL
);
