import requests
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MAX_LENGTH = 4096

# OpenAI Client 초기화
client = OpenAI(api_key=OPENAI_API_KEY)

class GeneratedAppInfo(BaseModel):
    """
    Data model for storing extracted app information.
    """
    categories: list[str]
    description: str
    languages: list[str]
    age_rating: str

def get_openai_data(prompt: str) -> GeneratedAppInfo | None:
    """
    Sends a prompt to OpenAI and retrieves structured app information.

    :param prompt: The text prompt to send to OpenAI
    :return: An GeneratedAppInfo object with extracted information, or None if the request fails.
    """
    prompt = prompt[:MAX_LENGTH]  # 최대 길이 제한
    
    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format=GeneratedAppInfo
        )
        print(response)
        app_info = response.choices[0].message.parsed
        
        print(app_info)
        return app_info
    except requests.RequestException as e:
        print(f"OpenAI request failed: {e}")
    except AttributeError as e:
        print(f"Unexpected response structure: {e}")
    return None
