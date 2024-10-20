import math
import re
import os
from typing import List
from dotenv import load_dotenv
import psycopg2  # Add this import for PostgreSQL

try:
    import tiktoken
except ImportError:
    raise ImportError("Please install the 'tiktoken' package to handle tokenization: pip install tiktoken")

# Load environment variables from .env file
load_dotenv()

# Retrieve the database URI and Groq API key from environment variables
DB_URI = os.getenv("DB_URI")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class PreProcessor:
    def __init__(
        self,
        max_tokens: int = 8000,
        overlap_tokens: int = 500,
        encoding_name: str = "cl100k_base"
    ):
        """
        Initializes the PreProcessor with token-based chunk size and overlap.

        Args:
            max_tokens (int): Maximum number of tokens per chunk.
            overlap_tokens (int): Number of tokens to overlap between chunks.
            encoding_name (str): Name of the encoding to use with tiktoken.
        """
        self.max_tokens = max_tokens
        self.overlap_tokens = overlap_tokens
        self.encoding = tiktoken.get_encoding(encoding_name)

    def clean_text(self, text: str) -> str:
        """
        Cleans the input text by removing unwanted characters and extra spaces.

        Args:
            text (str): The raw text to clean.

        Returns:
            str: The cleaned text.
        """
        # Remove multiple spaces, newlines, and tabs
        cleaned = re.sub(r'\s+', ' ', text)
        # Optionally, add more cleaning steps here
        return cleaned.strip()

    def chunk_text(self, text: str) -> List[str]:
        """
        Splits the text into chunks based on the max_tokens and overlap_tokens.

        Args:
            text (str): The text to be chunked.

        Returns:
            list: A list of text chunks.
        """
        cleaned_text = self.clean_text(text)
        tokens = self.encoding.encode(cleaned_text)
        total_tokens = len(tokens)
        chunks = []
        start = 0

        while start < total_tokens:
            end = start + self.max_tokens
            chunk_tokens = tokens[start:end]
            chunk_text = self.encoding.decode(chunk_tokens)

            # If not the first chunk, add overlap from the previous chunk
            if start != 0 and self.overlap_tokens > 0:
                overlap_start = start - self.overlap_tokens
                overlap_end = start
                overlap_tokens = tokens[overlap_start:overlap_end]
                overlap_text = self.encoding.decode(overlap_tokens)
                chunk_text = overlap_text + chunk_text

            chunks.append(chunk_text)
            start += self.max_tokens

        return chunks

    def process_text(self, text: str) -> str:
        """
        Processes the text by cleaning, chunking, and concatenating it.

        Args:
            text (str): The raw text to process.

        Returns:
            str: The fully processed and concatenated text.
        """
        chunks = self.chunk_text(text)
        # Concatenate all chunks into a single string
        return ' '.join(chunks)

def store_in_database(db_uri, text):
    """
    Stores the processed text in the database.

    Args:
        db_uri (str): The database URI.
        text (str): The text to store.
    """
    try:
        # Connect to the database
        connection = psycopg2.connect(db_uri)
        cursor = connection.cursor()

        # Ensure the table and column names match your database schema
        insert_query = "INSERT INTO formatted_texts (text) VALUES (%s);"
        cursor.execute(insert_query, (text,))

        # Commit the transaction
        connection.commit()

        # Close the connection
        cursor.close()
        connection.close()

        print("Text successfully stored in the database.")

    except Exception as e:
        print(f"An error occurred: {e}")

def main():
    """
    Main function to demonstrate text processing.
    """
    raw_text = """
    Life is a precious gift that is given to each and every one of us. It is a journey that is full of ups and downs, twists and turns, and moments of joy and sorrow. Despite its unpredictability, life is a beautiful and precious thing that should be cherished and appreciated every day.

One of the most important things in life is to find purpose and meaning. This can be achieved through our relationships with others, our work, our hobbies, or our passions. When we have a sense of purpose, we feel fulfilled and satisfied, and we are more likely to be happy and content.

Another important aspect of life is to learn and grow. Life is a journey of self-discovery, and it is full of opportunities to learn new things, develop new skills, and become the best version of ourselves. Whether it is through education, travel, or personal experiences, life is full of opportunities to learn and grow.

In addition to finding purpose and learning and growing, life is also about building strong relationships with others. Our relationships with family, friends, and loved ones are some of the most important things in life, and they can bring us joy, support, and a sense of belonging.

Of course, life is not always easy. There will be challenges and difficulties that we will face, and there will be times when we feel overwhelmed and unsure of what to do. But even in the midst of these challenges, there is always something to be grateful for, and there is always something to be learned.

In conclusion, life is a precious and beautiful thing that should be cherished and appreciated every day. It is a journey of self-discovery, growth, and relationships, and it is full of opportunities to learn and grow. While it is not always easy, it is always worth it, and it is always worth fighting for.

Here are some additional points that could be included in the essay:

The importance of living in the present moment and not taking life for granted
The importance of taking care of our physical and mental health
The importance of being kind and compassionate towards others
The importance of pursuing our passions and interests
The importance of being open-minded and willing to try new things
The importance of learning from our mistakes and failures
The importance of having a sense of humor and being able to laugh at ourselves
I hope this helps! Let me know if you have any other questions.
    """ # Replicate to create a large text

    processor = PreProcessor()
    processed_text = processor.process_text(raw_text)
    print("Processed Text:\n", processed_text)

    # Store `processed_text` in the database using DB_URI
    store_in_database(DB_URI, processed_text)

if __name__ == "__main__":
    main()
