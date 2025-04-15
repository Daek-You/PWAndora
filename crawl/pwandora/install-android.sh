#!/bin/bash
set -e  # 명령어가 실패하면 스크립트 중단

echo "Android SDK 명령줄 도구 설치 시작..."
echo "현재 사용자: $(whoami)"
echo "현재 작업 디렉토리: $(pwd)"

# 환경 변수 설정
ANDROID_SDK_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
ANDROID_SDK_DIR="/opt/android-sdk"
ANDROID_CMDLINE_TOOLS_DIR="$ANDROID_SDK_DIR/cmdline-tools"

# 필요한 디렉토리 생성
echo "필요한 디렉토리 생성 중..."
mkdir -p "$ANDROID_CMDLINE_TOOLS_DIR"
echo "디렉토리 생성 완료."

# Android SDK 명령줄 도구 다운로드
echo "Android SDK 명령줄 도구 다운로드 중..."
wget "$ANDROID_SDK_URL" -O android-sdk.zip

# 압축 풀기
echo "압축 해제 중..."
unzip -q android-sdk.zip -d "$ANDROID_CMDLINE_TOOLS_DIR"
mv "$ANDROID_CMDLINE_TOOLS_DIR/cmdline-tools" "$ANDROID_CMDLINE_TOOLS_DIR/latest"

# 압축 파일 삭제
rm android-sdk.zip

# 환경 변수 설정
export PATH="$ANDROID_CMDLINE_TOOLS_DIR/latest/bin:$PATH"

# 라이선스 동의
echo "Android SDK 라이선스 동의 중..."
yes | sdkmanager --licenses

# 필요한 SDK 패키지 설치
echo "Android SDK 패키지 설치 중..."
sdkmanager "platform-tools" "build-tools;35.0.0" "platforms;android-35" "platforms;android-27"

echo "Android SDK 설치 완료: $(date)"
echo "설치 경로: $ANDROID_SDK_DIR"

# 확인
echo "설치된 패키지 목록:"
sdkmanager --list | grep -i installed