import openai
import os
from dotenv import load_dotenv
import requests

def test_openai_api_key():
  """Tests the validity of the OpenAI API key by making a simple request.

  Raises:
      ValueError: If the API key is not set in the environment or the request fails.
  """

  # Load the API key from the .env file
  load_dotenv()
  api_key = os.getenv("OPENAI_API_KEY")

  if not api_key:
    raise ValueError("Missing OPENAI_API_KEY environment variable. Please set it to your API key.")

  # Replace with a valid OpenAI API endpoint that returns data
  url = "https://api.openai.com/v1/embeddings"
  headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
  }
  data = {"input": "testing my api key",                   
         "model": "text-embedding-3-small"}

  try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()  # Raise an exception for non-200 status codes

    # Print the response (adjust based on the endpoint's response format)
    print("API request successful!")
    print(response.json())

  except requests.exceptions.RequestException as e:
    print(f"API request failed: {e}")

if __name__ == "__main__":
  test_openai_api_key()
