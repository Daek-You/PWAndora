# import json
# from bs4 import BeautifulSoup
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from webdriver_manager.chrome import ChromeDriverManager
# from urllib.parse import urljoin
# from app.model import PWA

# def _init_driver(self):
    #     """Web driver 옵션 설정"""
    #     options = Options()
    #     options.add_argument("--headless")  # 브라우저 창을 띄우지 않고 백그라운드에서 실행
    #     options.add_argument("--disable-blink-features=AutomationControlled")  # 자동화 감지 방지
        
    #     return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # def _get_page_source(driver, url):
    #     """URL로부터 페이지 소스를 가져오는 함수"""
    #     driver.get(url)
    #     return driver.page_source

    # def get_manifest_json(self, main_url):
    #     """웹사이트의 manifest.json 파일을 크롤링하는 함수"""
    #     print(f"크롤링 시작: {main_url}")
    
    #     try:
    #         # WebDriver 초기화
    #         driver = self._init_driver()
            
    #         # Manifest URL 가져오기
    #         manifest_url = self._get_manifest_url(driver, main_url)
    #         if not manifest_url:
    #             driver.quit()
    #             return None

    #         # Manifest 파일에서 JSON 데이터 파싱
    #         json_data = self._fetch_json_from_url(driver, manifest_url)
    #         driver.quit()
    #         return json_data

    #     except Exception as e:
    #         print(f"예상치 못한 에러 발생: {str(e)}")
    #         return None

    # def _get_manifest_url(self, driver, main_url):
    #     """웹사이트에서 manifest.json URL을 찾는 함수"""
    #     driver.get(main_url)
    #     try:
    #         manifest_element = driver.find_element(By.XPATH, '//link[@rel="manifest"]')
    #         return manifest_element.get_attribute("href")
    #     except Exception as e:
    #         print("Manifest 파일을 찾을 수 없습니다.", e)
    #         return None

    # def _fetch_json_from_url(self, driver, manifest_url):
    #     """Manifest URL에서 JSON 데이터를 가져오는 함수"""
    #     page_source = self._get_page_source(driver, manifest_url)
    #     soup = BeautifulSoup(page_source, "html.parser")
    #     pre_tag = soup.find("pre")
    #     if not pre_tag:
    #         print("JSON 데이터를 찾을 수 없습니다.")
    #         return None
        
    #     try:
    #         return json.loads(pre_tag.text)
    #     except json.JSONDecodeError:
    #         print("JSON 형식이 올바르지 않습니다.")
    #         return None

    # def check_pwa(self, manifest_data):
    #     """manifest.json 데이터가 PWA 요구사항을 충족하는지 확인하는 함수"""
    #     if not manifest_data:
    #         print("Manifest 데이터가 없습니다.")
    #         return False
        
    #     # PWA 필수 요소 확인
    #     name = manifest_data.get("name") or manifest_data.get("short_name")  # PWA 이름
    #     start_url = manifest_data.get("start_url")  # 시작 URL
        
    #     if name and start_url:
    #         print(f"PWA 확인 완료: {name}, {start_url}")
    #         return True
    #     else:
    #         print("PWA로 필요한 정보가 부족합니다.")
    #         return False

    # def save_pwa_info(self, manifest_data, app_info):
    #     """manifest.json에서 추출한 PWA 정보를 데이터베이스에 저장하는 함수"""
    #     if not manifest_data:
    #         print("Manifest 데이터가 없습니다.")
    #         return None
        
    #     try:
    #         # PWA URL 설정
    #         start_url = manifest_data.get('start_url', '')
    #         base_url = app_info.get('website_url', '')
    #         absolute_url = urljoin(base_url, start_url) if start_url else base_url

    #         # PWA 객체 생성
    #         pwa = PWA(
    #             icon_image=manifest_data.get('icons', [{}])[0].get('src') or app_info.get('icon_image', ''),
    #             website_url=absolute_url,
    #             version=manifest_data.get('version') or app_info.get('version', 'N/A'),
    #             company=app_info.get('company', ''),
    #             developer_site=app_info.get('developer_site', ''),
    #         )

    #         # 패키징 후 파일 경로 및 사이즈 저장
    #         file_info = self.tizenService.build(pwa)
    #         pwa.file_size = file_info["file_size"]
    #         pwa.download_url = file_info["download_url"]

    #         # DB 저장
    #         self.pwa_dao.save_pwa(pwa)
            
    #         return pwa

    #     except Exception as db_error:
    #         print(f"PWA 저장 중 오류: {str(db_error)}")
    #         return None
