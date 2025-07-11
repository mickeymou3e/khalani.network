poetry shell

openssl genrsa -out private.pem 

openssl rsa -in private.pem -pubout -out public.pem

# convert to jwks
python -c "from authlib.jose import JsonWebKey; key = JsonWebKey.import_key(open('public.pem', 'r').read(), {'kty': 'RSA'}); open('public.json', 'w').write(key.as_json())"

encoded_value="OIDC_PRIVATE_KEY=$(base64 < private.pem)"

echo "$encoded_value" > encoded_private_key.txt



