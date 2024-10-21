# app/services/study_materials_service.py

import os
import requests
from googleapiclient.discovery import build
import logging

logger = logging.getLogger(__name__)

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CX = os.getenv("GOOGLE_CSE_ID")

class StudyMaterialsService:
    def fetch_youtube_videos(self, keyword: str) -> list:
        """Fetches YouTube videos based on the keyword."""
        try:
            youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
            req = youtube.search().list(
                q=keyword,
                part='snippet',
                type='video',
                maxResults=5
            )
            res = req.execute()
            videos = []
            for item in res.get('items', []):
                video_data = {
                    'title': item['snippet']['title'],
                    'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                }
                videos.append(video_data)
            return videos
        except Exception as e:
            logger.error(f"Error fetching YouTube videos: {e}")
            return []

    def fetch_google_search_results(self, keyword: str) -> list:
        """Fetches Google search results based on the keyword."""
        try:
            search_url = f"https://www.googleapis.com/customsearch/v1?key={GOOGLE_SEARCH_API_KEY}&cx={GOOGLE_CX}&q={keyword}"
            response = requests.get(search_url)
            results = response.json()
            search_results = []
            for item in results.get('items', []):
                result_data = {
                    'title': item['title'],
                    'snippet': item.get('snippet', ''),
                    'url': item['link']
                }
                search_results.append(result_data)
            return search_results
        except Exception as e:
            logger.error(f"Error fetching Google search results: {e}")
            return []

    def fetch_gemini_content(self, keyword: str) -> list:
        """Fetches content from the Gemini API (mock function for demonstration)."""
        try:
            # Placeholder implementation
            gemini_results = [{
                'title': f"Gemini Content for {keyword}",
                'content': f"Generated content based on {keyword}."
            }]
            return gemini_results
        except Exception as e:
            logger.error(f"Error fetching Gemini content: {e}")
            return []

    def get_study_materials(self, keyword: str) -> dict:
        """Fetches study materials from YouTube, Google, and Gemini APIs based on the keyword."""
        logger.info(f"Fetching study materials for keyword: {keyword}")

        youtube_videos = self.fetch_youtube_videos(keyword)
        google_results = self.fetch_google_search_results(keyword)
        gemini_results = self.fetch_gemini_content(keyword)

        combined_results = {
            'YouTube Videos': youtube_videos,
            'Google Search Results': google_results,
            'Gemini Generated Content': gemini_results
        }

        return combined_results
