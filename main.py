import os
from dotenv import load_dotenv
from groq import Groq
from llama_index import SimpleDirectoryReader, GPTVectorStoreIndex
from llama_index.embeddings import OpenAIEmbedding

# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from environment variables
groq_api_key = os.getenv('GROQ_API_KEY')

# Initialize Groq client with the API key
client = Groq(api_key=groq_api_key)

# 1. Load Documents from the specified folder
documents = SimpleDirectoryReader('./documents').load_data()

# 2. Initialize Embedding Model
embedding = OpenAIEmbedding(api_key='your_openai_api_key')  # Replace with appropriate key if not using OpenAI

# 3. Create and Save Index
index = GPTVectorStoreIndex.from_documents(documents, embed_model=embedding)
index.save_to_disk('index.json')

# 4. Function to generate responses using Groq's LLM
def generate_response(prompt):
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,  # Set to True if you want streaming responses
        stop=None,
    )
    
    # Assuming the API returns the full response when stream=False
    return completion.choices[0].message['content']

# 5. RAG Query Function
def rag_query(query):
    # Retrieve relevant documents
    response = index.query(query, similarity_top_k=5)
    retrieved_docs = response.response  # Adjust based on actual response structure
    
    # Construct the prompt with retrieved documents
    prompt = f"Use the following documents to answer the question:\n\n{retrieved_docs}\n\nQuestion: {query}\nAnswer:"
    
    # Generate the answer using Groq's LLM
    answer = generate_response(prompt)
    
    return answer

# 6. Interactive Session to query the system
def main():
    while True:
        user_query = input("Enter your question (or 'exit' to quit): ")
        if user_query.lower() == 'exit':
            break
        answer = rag_query(user_query)
        print(f"Answer: {answer}\n")

if __name__ == "__main__":
    main()