#!/bin/sh
echo "Testing POST"
curl  -X POST http://localhost:8000/api/v1/hello-world/ \
      -H "Content-Type: application/json" \
      -d '{"user":{"phoneNumber": "+1626500400", "name": "John Doe", "password": "safepassword", "email": "johndoe@test.com"}}'

echo "\n\nTesting PUT"
curl  -X PUT http://localhost:8000/api/v1/hello-world/1/ \
      -H "Content-Type: application/json" \
      -d '{"user":{"phoneNumber": "+1626500400", "name": "John Doe", "password": "safepassword", "email": "johndoe@test.com"}}'