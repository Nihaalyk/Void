import wikipediaapi
import os
from googleapiclient.discovery import build
import requests

# Function to fetch Wikipedia article summary
def get_wikipedia_summary(keyword):
    # Define a user agent string with your application's name and contact information
    user_agent = "MyStudyApp/1.0 (your_email@example.com)"
    # The language is now passed as a keyword argument:
    wiki = wikipediaapi.Wikipedia(language='en', extract_format=wikipediaapi.ExtractFormat.WIKI, user_agent=user_agent)
    page = wiki.page(keyword)

    if page.exists():
        return {'title': page.title, 'summary': page.summary[:500], 'url': page.fullurl}
    else:
        return {'error': 'Wikipedia page not found'}

# ... (rest of your code remains the same)

# ... (rest of your code remains the same)

# Function to fetch related videos from YouTube
def get_youtube_videos(keyword, api_key):
    youtube = build('youtube', 'v3', developerKey=api_key)
    request = youtube.search().list(
        q=keyword,
        part="snippet",
        type="video",
        maxResults=5
    )
    response = request.execute()

    videos = []
    for item in response['items']:
        video_data = {
            'title': item['snippet']['title'],
            'description': item['snippet']['description'],
            'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}"
        }
        videos.append(video_data)

    return videos

# Function to fetch related websites using Google Custom Search
def get_related_websites(keyword, api_key, cse_id):
    service = build("customsearch", "v1", developerKey=api_key)
    res = service.cse().list(q=keyword, cx=cse_id, num=5).execute()

    websites = []
    if 'items' in res:
        for item in res['items']:
            website_data = {
                'title': item['title'],
                'snippet': item['snippet'],
                'url': item['link']
            }
            websites.append(website_data)

    return websites

# Main function to fetch all resources based on a keyword
def get_study_resources(keyword, youtube_api_key, google_api_key, cse_id):
    print(f"Fetching resources for: {keyword}\n")

    # Fetch Wikipedia summary
    wiki_data = get_wikipedia_summary(keyword)
    if 'error' not in wiki_data:
        print("Wikipedia Summary:")
        print(f"Title: {wiki_data['title']}")
        print(f"Summary: {wiki_data['summary']}")
        print(f"URL: {wiki_data['url']}\n")
    else:
        print(wiki_data['error'], "\n")

    # Fetch related YouTube videos
    print("Related YouTube Videos:")
    youtube_videos = get_youtube_videos(keyword, youtube_api_key)
    for video in youtube_videos:
        print(f"Title: {video['title']}")
        print(f"Description: {video['description']}")
        print(f"Watch: {video['url']}\n")

    # Fetch related websites
    print("Related Websites:")
    related_websites = get_related_websites(keyword, google_api_key, cse_id)
    for website in related_websites:
        print(f"Title: {website['title']}")
        print(f"Snippet: {website['snippet']}")
        print(f"URL: {website['url']}\n")


# Your API keys here
YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
GOOGLE_CSE_ID = os.environ.get('GOOGLE_CSE_ID')
