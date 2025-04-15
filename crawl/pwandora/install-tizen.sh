#!/bin/bash
set -e  # 명령어가 실패하면 스크립트 중단

echo "Tizen Studio 6.0 CLI 설치 시작..."
echo "현재 사용자: $(whoami)"
echo "현재 작업 디렉토리: $(pwd)"

# 환경 변수 설정
TIZEN_STUDIO_URL="https://download.tizen.org/sdk/Installer/tizen-studio_6.0/web-cli_Tizen_Studio_6.0_ubuntu-64.bin"
TIZEN_INSTALL_DIR="/home/tizen/tizen-studio"

# 필요한 디렉토리 생성
echo "필요한 디렉토리 생성 중..."
mkdir -p "$TIZEN_INSTALL_DIR"
mkdir -p /home/tizen/.package-manager/jdk
mkdir -p /home/tizen/tizen-studio-data
echo "디렉토리 생성 완료."

# 다운로드 디렉토리로 이동
cd /home/tizen

# Tizen Studio 6.0 CLI 설치 파일 다운로드
echo "Tizen Studio 설치 파일 다운로드 중..."
wget "$TIZEN_STUDIO_URL" -O tizen-studio-installer.bin
chmod +x tizen-studio-installer.bin

# 디스크 공간 확인
echo "디스크 공간 확인:"
df -h /home

# Tizen Studio CLI 설치 (라이선스 동의 및 Java 체크 건너뛰기)
echo "Tizen Studio 설치 시작: $(date)"
./tizen-studio-installer.bin --accept-license --no-java-check "$TIZEN_INSTALL_DIR"

# 설치 확인
if [ ! -d "$TIZEN_INSTALL_DIR/package-manager" ]; then
    echo "오류: Tizen Studio 설치 실패. package-manager 디렉토리가 없습니다."
    ls -la "$TIZEN_INSTALL_DIR"
    exit 1
fi
echo "Tizen Studio 설치 완료."

# 환경 변수 설정
export PATH="$TIZEN_INSTALL_DIR/tools/ide/bin:$PATH"

# 기본 tizen 명령어 확인
if [ -f "$TIZEN_INSTALL_DIR/tools/ide/bin/tizen" ]; then
    echo "Tizen CLI 명령어 확인:"
    "$TIZEN_INSTALL_DIR/tools/ide/bin/tizen" version || echo "버전 명령 실패"
    "$TIZEN_INSTALL_DIR/tools/ide/bin/tizen" list || echo "명령 목록 확인 실패"
else
    echo "경고: tizen 명령어를 찾을 수 없습니다. 기본 설치가 제대로 되었는지 확인하세요."
fi

echo "Tizen Studio 설치 완료: $(date)"
echo "설치 경로: $TIZEN_INSTALL_DIR"