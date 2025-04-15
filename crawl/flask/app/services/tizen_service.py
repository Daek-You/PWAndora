import subprocess
import os
import requests
from urllib.parse import urlparse, urljoin
from lxml import etree

class TizenService:
    def __init__(self):
        # Tizen CLI 및 경로 설정
        self.TIZEN_CLI = "C:/tizen-studio/tools/ide/bin/tizen.bat"
        self.ROOT_PATH = "C:/Users/SSAFY/Documents/tizenApps"
        self.OUTPUT_PATH = os.path.join(self.ROOT_PATH, "output")

        # XML 네임스페이스 정의
        self.NAMESPACES = {
            '': 'http://www.w3.org/ns/widgets',
            'tizen': 'http://tizen.org/ns/widgets'
        }
    
    def package(self, app):
        """Tizen WebApp 빌드 및 패키징"""
        name = app.name
        start_url = app.website_url
        icon_url = app.icon_image

        project_path = self.prepare_project(name, start_url, icon_url)

        try:
            build_cmd = [self.TIZEN_CLI, "build-web", "--", project_path]
            subprocess.run(build_cmd, check=True)

            package_cmd = [self.TIZEN_CLI, "package", "-t", "wgt", "-o", self.OUTPUT_PATH, "--", project_path]
            subprocess.run(package_cmd, check=True)

            print("빌드 및 패키징 성공!")

            wgt_file_path = os.path.join(self.OUTPUT_PATH, f"{name}.wgt")
            if os.path.exists(wgt_file_path):
                file_size = os.path.getsize(wgt_file_path)
                return {
                    "file_size": f"{file_size / 1024:.2f} KB",
                    "download_url": wgt_file_path
                }
        except subprocess.CalledProcessError as e:
            print(f"빌드 오류: {e}")

        return None

    def download_icon(self, icon_url, project_path, base_url=None):
        """PWA 아이콘을 다운로드하여 프로젝트 폴더에 저장"""
        if not urlparse(icon_url).netloc and base_url:
            icon_url = urljoin(base_url, icon_url)

        icon_path = os.path.join(project_path, 'icon.png')
        os.makedirs(os.path.dirname(icon_path), exist_ok=True)

        try:
            response = requests.get(icon_url)
            if response.status_code == 200:
                with open(icon_path, 'wb') as f:
                    f.write(response.content)
                print(f"아이콘 다운로드 완료: {icon_path}")
            else:
                print(f"아이콘 다운로드 실패: {response.status_code} - {icon_url}")
        except Exception as e:
            print(f"아이콘 다운로드 오류: {str(e)}")

        return icon_path

    def update_config_xml(self, project_path, name, start_url):
        """config.xml 파일을 업데이트하여 Tizen 웹앱 설정을 변경"""
        config_file = os.path.join(project_path, 'config.xml')
        tree = etree.parse(config_file)
        root = tree.getroot()

        name_element = root.find('name', self.NAMESPACES)
        if name_element is not None:
            name_element.text = name

        start_url_element = root.find(".//tizen:content", self.NAMESPACES)
        if start_url_element is not None:
            start_url_element.set('src', start_url)

        tree.write(config_file, xml_declaration=True, encoding="UTF-8", pretty_print=True)
        print(f"config.xml 업데이트 완료: {config_file}")

    def prepare_project(self, name, start_url, icon_url):
        """프로젝트 폴더를 생성하고 초기 설정을 수행"""
        project_path = os.path.join(self.ROOT_PATH, name)
        os.makedirs(project_path, exist_ok=True)

        # 아이콘 다운로드
        self.download_icon(icon_url, project_path)

        # config.xml 템플릿 복사 및 수정
        config_template_path = os.path.join(self.ROOT_PATH, 'config.xml')
        config_copy_path = os.path.join(project_path, 'config.xml')

        with open(config_template_path, 'r') as template_file:
            config_content = template_file.read()

        with open(config_copy_path, 'w') as config_file:
            config_file.write(config_content)

        self.update_config_xml(project_path, name, start_url)

        return project_path

    def build(self, data):
        """Tizen WebApp 빌드 및 패키징"""
        name = data.name
        start_url = data.website_url
        icon_url = data.icon_image

        project_path = self.prepare_project(name, start_url, icon_url)

        try:
            build_cmd = [self.TIZEN_CLI, "build-web", "--", project_path]
            subprocess.run(build_cmd, check=True)

            package_cmd = [self.TIZEN_CLI, "package", "-t", "wgt", "-o", self.OUTPUT_PATH, "--", project_path]
            subprocess.run(package_cmd, check=True)

            print("빌드 및 패키징 성공!")

            wgt_file_path = os.path.join(self.OUTPUT_PATH, f"{name}.wgt")
            if os.path.exists(wgt_file_path):
                file_size = os.path.getsize(wgt_file_path)
                return {
                    "file_size": f"{file_size / 1024:.2f} KB",
                    "download_url": wgt_file_path
                }
        except subprocess.CalledProcessError as e:
            print(f"빌드 오류: {e}")

        return None
