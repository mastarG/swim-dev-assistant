#!/bin/bash

# Test Gemini API
API_KEY="${1:-TEST_KEY}"
MODEL="gemini-1.5-flash"
BASE_URL="https://generativelanguage.googleapis.com/v1beta"

echo "Testing Gemini API..."
echo "Model: $MODEL"
echo "Base URL: $BASE_URL"
echo ""

curl -s -X POST \
  "${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, test message"
      }]
    }],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 100
    }
  }' | jq -r '.candidates[0].content.parts[0].text // .error.message // "Unknown error"'

