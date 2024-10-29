import os
import psycopg2
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime
import json

# Load environment variables from .env file
load_dotenv()

# Retrieve the database URI and Groq API key from environment variables
DB_URI = os.getenv("DB_URI")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def fetch_texts_from_db(db_uri):
    """
    Fetches texts from the formatted_texts table in the database.

    Args:
        db_uri (str): The database URI.

    Returns:
        list: A list of texts fetched from the database.
    """
    try:
        connection = psycopg2.connect(db_uri)
        cursor = connection.cursor()

        # Fetch texts from the database
        select_query = "SELECT text FROM formatted_texts;"
        cursor.execute(select_query)
        texts = cursor.fetchall()

        cursor.close()
        connection.close()

        return [text[0] for text in texts]

    except Exception as e:
        print(f"An error occurred while fetching texts: {e}")
        return []

def summarize_with_groq(text):
    """
    Summarizes the text using the Groq API and structures it into a hierarchical multilevel knowledge graph.

    Args:
        text (str): The text to summarize.

    Returns:
        dict: The structured knowledge graph as a dictionary.
    """
    system_prompt = (
        "You are an assistant that structures data into a hierarchical multilevel knowledge graph in JSON format. "
        "The output should be a JSON object following this format: "
        "{ \"name\": \"Root\", \"children\": [ { \"name\": \"Child 1\", \"children\": [ { \"name\": \"Grandchild 1\" }, { \"name\": \"Grandchild 2\" } ] }, { \"name\": \"Child 2\", \"children\": [ { \"name\": \"Grandchild 3\" }, { \"name\": \"Grandchild 4\" } ] } ] }. "
        "Ensure that only 'name' and 'children' keys are used. "
        "Do not include any explanations, code snippets, or text outside the JSON. Provide only the JSON output."
    )

    client = Groq(api_key=GROQ_API_KEY)
    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

    # Assuming the API returns a structured response
    summarized_output = completion.choices[0].message.content

    # Debugging: Print the summarized output to inspect its format
    print("Summarized Output:", summarized_output)
    print("Output Length:", len(summarized_output))  # Print the length of the output

    try:
        # Trim any leading/trailing whitespace
        summarized_output = summarized_output.strip()

        # Check for unexpected trailing characters
        if len(summarized_output) > 0:
            print("Last Character:", repr(summarized_output[-1]))

        # Attempt to parse the JSON string directly
        knowledge_graph = json.loads(summarized_output)
        return knowledge_graph

    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        return None

def store_summary_in_db(db_uri, raw_text, summary):
    """
    Stores the structured knowledge graph in the graphs table in the database.

    Args:
        db_uri (str): The database URI.
        raw_text (str): The original text that was summarized.
        summary (dict): The structured knowledge graph to store.
    """
    try:
        connection = psycopg2.connect(db_uri)
        cursor = connection.cursor()

        # Add a timestamp to each entry
        timestamp = datetime.now()

        # Convert the summary to a JSON string
        summary_json = json.dumps(summary)

        # Ensure the table and column names match your database schema
        insert_query = "INSERT INTO graphs (raw_text, graph, created_at) VALUES (%s, %s, %s);"
        cursor.execute(insert_query, (raw_text, summary_json, timestamp))

        # Commit the transaction
        connection.commit()

        cursor.close()
        connection.close()

        print("Summary successfully stored in the database.")

    except Exception as e:
        print(f"An error occurred while storing the summary: {e}")

def main():
    """
    Main function to fetch, summarize, and store text.
    """
    texts = fetch_texts_from_db(DB_URI)
    combined_text = "\n".join(texts)

    # Generate a single summary for all combined texts
    unified_summary = summarize_with_groq(combined_text)

    if unified_summary:
        store_summary_in_db(DB_URI, combined_text, unified_summary)

if __name__ == "__main__":
    main()
