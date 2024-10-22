from llama_index import SimpleDirectoryReader, GPTVectorStoreIndex
from llama_index.embeddings import OpenAIEmbedding
from groq import Groq

# 1. Load Documents
documents = SimpleDirectoryReader('path_to_documents').load_data()

# 2. Initialize Embedding Model
embedding = OpenAIEmbedding(api_key='your_openai_api_key')  # Replace with appropriate key

# 3. Create and Save Index
index = GPTVectorStoreIndex.from_documents(documents, embed_model=embedding)
index.save_to_disk('index.json')

# 4. Initialize Groq Client
client = Groq()

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
        stream=False,
        stop=None,
    )
    return completion.choices[0].message['content']

# 5. RAG Query Function
def rag_query(query):
    response = index.query(query, similarity_top_k=5)
    retrieved_docs = response.response  # Adjust based on actual response structure
    prompt = f"Use the following documents to answer the question:\n\n{retrieved_docs}\n\nQuestion: {query}\nAnswer:"
    answer = generate_response(prompt)
    return answer

# 6. Interactive Session
def main():
    while True:
        user_query = input("Enter your question (or 'exit' to quit): ")
        if user_query.lower() == 'exit':
            break
        answer = rag_query(user_query)
        print(f"Answer: {answer}\n")

if __name__ == "__main__":
    main()