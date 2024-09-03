"""Module providing a function printing python version."""

import requests
import json

# URL of the JSON file
url = "https://github.com/Mojang/bedrock-samples/raw/preview/metadata/vanilladata_modules/mojang-items.json"

try:
    # Download the data from the URL
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception if the download fails

    # Parse the JSON content
    data = response.json()
except requests.RequestException as e:
    print(f"Error downloading or parsing the JSON: {e}")