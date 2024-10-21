import wikipediaapi
import os
from googleapiclient.discovery import build
import requests
from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url="https://2061cfb9-c6c8-47ae-8efe-65dcc6af4538.europe-west3-0.gcp.cloud.qdrant.io:6333", 
    api_key=os.getenv("QDRANT_API_KEY"),
)

# Define Qdrant collection name and embedding dimensions
QDRANT_COLLECTION_NAME = "new_collection"
EMBEDDING_DIMENSION = 1536  # Example dimension

# YouTube Search Function
def fetch_youtube_videos(keyword, youtube_api_key):
    """Fetches videos from YouTube based on the keyword."""
    youtube = build('youtube', 'v3', developerKey=youtube_api_key)
    req = youtube.search().list(
        q=keyword,
        part='snippet',
        type='video',
        maxResults=5  # Adjust based on your needs
    )
    res = req.execute()
    videos = []

    # Iterate through the response and collect video data
    for item in res['items']:
        video_data = {
            'title': item['snippet']['title'],
            'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}"
        }
        videos.append(video_data)

    return videos

# Google Search API Function
def fetch_google_search_results(keyword, google_api_key, google_cx):
    """Fetches search results from Google based on the keyword."""
    search_url = f"https://www.googleapis.com/customsearch/v1?key={google_api_key}&cx={google_cx}&q={keyword}"
    response = requests.get(search_url)
    results = response.json()
    search_results = []

    # Iterate through the response and collect search results
    if 'items' in results:
        for item in results['items']:
            result_data = {
                'title': item['title'],
                'snippet': item.get('snippet', ''),
                'url': item['link']
            }
            search_results.append(result_data)

    return search_results

# Gemini API Function (Placeholder for now)
def fetch_gemini_content(keyword):
    """Fetches content from the Gemini API (mock function for demonstration)."""
    # Since actual implementation is unknown, let's mock a response
    gemini_results = []

    # Mock result for demonstration
    gemini_results.append({
        'title': f"Gemini Content for {keyword}",
        'content': f"Generated content based on {keyword}."
    })

    return gemini_results

# Function to intelligently combine and return results
def get_study_materials(keyword, youtube_api_key, google_api_key, google_cx):
    """Fetches study materials from YouTube, Google, and Gemini APIs based on the keyword."""
    print(f"\nFetching study materials for keyword: {keyword}\n" + "-" * 40)

    # Fetch results from each API
    youtube_videos = fetch_youtube_videos(keyword, youtube_api_key)
    google_results = fetch_google_search_results(keyword, google_api_key, google_cx)
    gemini_results = fetch_gemini_content(keyword)

    # Combine the results into a structured dictionary
    combined_results = {
        'YouTube Videos': youtube_videos,
        'Google Search Results': google_results,
        'Gemini Generated Content': gemini_results
    }

    return combined_results
