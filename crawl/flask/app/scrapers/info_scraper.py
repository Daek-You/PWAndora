from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import json
import requests
import time
from app.consts.PROMPTS import PROMPT_EXTRACT
from app.consts.SCRAPER import LOAD_TIME
from .info.openai_helper import get_openai_data  # OpenAI 모듈 가져오기
from .info.app_info import AppInfo
import os

class ScrapResult:
    app: AppInfo
    isPWA: bool

    def __init__(self, isPWA: bool, app: AppInfo = None):
        self.isPWA = isPWA
        self.app = app

class PWAScraper:
    def __init__(self):
        options = Options()
        options.add_argument('lang=en') # 이걸 바꾸면서 지원 언어 탐색하기
        options.add_argument("--headless")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1080,1920")
        mobile_emulation = {
            "deviceName": "Nexus 5"
        }
        options.add_experimental_option("mobileEmulation", mobile_emulation)
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        self.scraping = False


    def scrape(self, url):
        app = AppInfo(url)
        
        # 페이지 로드
        self.driver.get(url)
        time.sleep(LOAD_TIME)  # JavaScript 로드를 위한 시간 허용
        html = self.driver.page_source

        # PWA인지 확인 (#2번 모듈)
        
        # manifest.json 가져오기
        manifest_url = self.extract_attribute('//link[@rel="manifest"]', "href", 'link[rel="manifest"]')
        print('manifesturl: ', manifest_url)

        if not manifest_url:
            manifest_url = "/manifest.webmanifest"

        manifest_url = app.get_absolute_url(manifest_url)
        try:
            manifest_data = requests.get(manifest_url, timeout=5).json()
            app.icons = [icon["src"] for icon in manifest_data.get("icons", [])]
            app.name = manifest_data.get("name", app.name)
            app.start_url = manifest_data.get("start_url")
            app.description = manifest_data.get("description", app.description)
        except requests.RequestException:
            print("Failed to fetch manifest.json")
            
        if not app.name or not app.start_url:
            return ScrapResult(isPWA=False)
        
        app.description = self.extract_attribute('//meta[@name="description"]', "content")

        # 스크린샷이 없으면 캡처
        if not app.screenshots:
            self.extract_screenshots(app)
        
        # 사이트에서 사용된 언어 가져오기
        if not app.languages:
            lang = self.extract_attribute('//html', "lang")
            if lang:
                app.languages.append(lang)
        
        # 카테고리, 설명 또는 연령 등급이 비어 있으면 OpenAI 요청 보내
        
        if not app.categories or not app.description or not app.age_rating or not app.languages:
            self.fill_ai_data(app, html)
        
        self.driver.quit()
        return ScrapResult(isPWA=True, app=app)
    
    def fill_ai_data(self, app, html):
        ai_info=get_openai_data(PROMPT_EXTRACT.format(html=html))
        if not app.categories:
            app.categories = ai_info.categories
        if not app.description:
            app.description = ai_info.description
        if not app.age_rating:
            app.age_rating = ai_info.age_rating
        if not app.languages:
            app.languages = ai_info.languages
    
    def extract_text(self, xpath):
        try:
            element = self.driver.find_element(By.XPATH, xpath)
            return element.text
        except:
            return ""
    
    def extract_attribute(self, xpath, attribute, css_selector=None):
        try:
            element = self.driver.find_element(By.XPATH, xpath)
            res = element.get_attribute(attribute)
            if(res or not css_selector):
                return res
            element = self.driver.find_element(By.CSS_SELECTOR, css_selector)
            res = element.get_attribute(attribute)
            return res
        except:
            return ""

    def extract_screenshots(self, app:AppInfo):
        # 디렉토리가 존재하지 않으면 생성
        
        try:
            os.mkdir('data')
        except FileExistsError:
            pass
        try:
            os.mkdir('data/'+app.get_dir_name())
        except FileExistsError:
            pass

        # 메인 페이지의 스크린샷 찍기
        index = 1
        self.capture(app, index)

        # 4개의 하위 페이지의 스크린샷 찍기
        subpages = self.driver.find_elements(By.XPATH, '//a')
        subpage_urls = [subpage.get_attribute("href") for subpage in subpages]
        visited = set()
        visited.add(app.url)    

        for subpage_url in subpage_urls[:4]:
            if not subpage_url:
                continue
            if subpage_url in visited:
                continue
            visited.add(subpage_url)
            self.driver.get(subpage_url)
            time.sleep(LOAD_TIME)
            index += 1
            self.capture(app, index)
        
        # 메인 페이지로 돌아가기
        self.driver.get(app.url)
        time.sleep(LOAD_TIME)
    
    def capture(self, app, index):
        screenshot_path = "data/{dir_name}/{dir_name}{index}.png".format(dir_name=app.get_dir_name(), index=index)
        self.driver.save_screenshot(screenshot_path)
        app.screenshots.append(screenshot_path)
        return screenshot_path
