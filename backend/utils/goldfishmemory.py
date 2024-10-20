import requests
import os

class GoldFishMemory:
    def __init__(self, api_key=None, api_endpoint=None):
        """
        Initializes the GoldFishMemory with optional API credentials.
        
        Args:
            api_key (str): Your GROQ API key. If not provided, it will be fetched from environment variables.
            api_endpoint (str): The GROQ API endpoint. If not provided, a default endpoint will be used.
        """
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        self.api_endpoint = api_endpoint or os.getenv('GROQ_API_ENDPOINT', 'https://api.groq.com/extract_keywords')
        
        if not self.api_key:
            raise ValueError("GROQ API key must be provided either as an argument or via the GROQ_API_KEY environment variable.")

    def create_goldfish_memory(self, text, num_keywords=5):
        """
        Creates a goldfish memory by extracting key keywords from the input text.
        
        Args:
            text (str): The input text to summarize.
            num_keywords (int): Number of keywords to extract. Defaults to 5.
        
        Returns:
            list: A list of extracted keywords.
        
        Raises:
            Exception: If the API request fails.
        """
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }
        payload = {
            'text': text,
            'num_keywords': num_keywords
        }
        
        try:
            response = requests.post(self.api_endpoint, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            keywords = data.get('keywords', [])
            return keywords
        except requests.exceptions.RequestException as e:
            # Log the exception as needed
            raise Exception(f"Failed to extract keywords: {e}")

    def create_goldfish_memory_flex(self, text, num_keywords=5, language='en'):
        """
        Flexible method to create a goldfish memory with additional parameters.
        
        Args:
            text (str): The input text to summarize.
            num_keywords (int): Number of keywords to extract. Defaults to 5.
            language (str): Language of the input text. Defaults to 'en'.
        
        Returns:
            list: A list of extracted keywords.
        
        Raises:
            Exception: If the API request fails.
        """
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }
        payload = {
            'text': text,
            'num_keywords': num_keywords,
            'language': language
        }
        
        try:
            response = requests.post(self.api_endpoint, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            keywords = data.get('keywords', [])
            return keywords
        except requests.exceptions.RequestException as e:
            # Log the exception as needed
            raise Exception(f"Failed to extract keywords with flexibility: {e}")