const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const { uploadToS3 } = require('../infra/s3Service');
const { getSiteStatusService } = require('../../services');
const {
  logSiteStepSuccess,
  logSiteStepFailed,
  logSiteStepTrace,
} = require('../../utils/logging/loggerTemplates');
const {
  getSafeName,
  downloadIconToPath,
} = require('../../utils/processing/packagingUtil');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');

const step = PipelineSteps.ANDROID;
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const execAsync = promisify(exec);
const statAsync = promisify(fs.stat);

const removeLocalDirectory = (targetPath) => {
  return fs.promises.rm(targetPath, { recursive: true, force: true });
};

const writeConfigXml = async (configPath, app) => {
  console.log('[config.xml] 수정 시작');
  let configXml = await readFileAsync(configPath, 'utf8');
  const platformConfig = `
<platform name="android">
  <icon src="www/res/icon/android/icon.png" />
  <preference name="ShowSplashScreenSpinner" value="false"/>
  <preference name="SplashMaintainAspectRatio" value="true"/>
  <preference name="SplashShowOnlyFirstTime" value="true"/>
  <preference name="SplashScreenDelay" value="3000"/>
  <preference name="AndroidWindowSplashScreenAnimatedIcon" value="www/res/icon/android/icon.png"/>
</platform>
<allow-navigation href="*" />
<allow-intent href="*" />
<access origin="*" />
<preference name="AndroidLaunchMode" value="singleTask"/>
<preference name="AndroidXEnabled" value="true"/>
<preference name="EnableViewportScale" value="true"/>
<preference name="MediaPlaybackRequiresUserAction" value="false"/>
<preference name="AllowInlineMediaPlayback" value="true"/>`;
  configXml = configXml.replace('</widget>', `${platformConfig}\n</widget>`);
  await writeFileAsync(configPath, configXml);
  console.log('[config.xml] 수정 완료');
};

const generateKeystore = async (outputDir) => {
  console.log('[keystore] 생성 시작');
  const keystoreFile = path.join(outputDir, 'release-key.keystore');
  const keystorePassword = process.env.KEYSTORE_PASSWORD;
  const alias = process.env.KEYSTORE_ALIAS;
  const dname = process.env.KEYSTORE_DNAME.replace(/, /g, ',');

  const command = `keytool -genkey -v -keystore "${keystoreFile}" -alias ${alias} -keyalg RSA -keysize 2048 -validity 10000 -storepass ${keystorePassword} -keypass ${keystorePassword} -dname ${dname}`;
  console.log('[keystore] 명령 실행:', command);
  await execAsync(command);
  console.log('[keystore] 생성 완료');

  return keystoreFile;
};

const writeBuildJson = async (outputDir, keystoreFile) => {
  console.log('[build.json] 작성 시작');
  const buildJson = {
    android: {
      release: {
        keystore: path.basename(keystoreFile),
        storePassword: process.env.KEYSTORE_PASSWORD,
        alias: process.env.KEYSTORE_ALIAS,
        password: process.env.KEYSTORE_PASSWORD,
        keystoreType: '',
      },
    },
  };
  const buildJsonPath = path.join(outputDir, 'build.json');
  console.log('[build.json] 파일 경로:', buildJsonPath);
  await writeFileAsync(buildJsonPath, JSON.stringify(buildJson, null, 2));
  console.log('[build.json] 작성 완료');
};

const buildAndroidApp = async (site) => {
  console.log('[DEBUG] 현재 환경 변수:');
  console.log('PATH:', process.env.PATH);
  console.log('JAVA_HOME:', process.env.JAVA_HOME);
  console.log('ANDROID_HOME:', process.env.ANDROID_HOME);
  console.log('TIZEN_STUDIO_HOME:', process.env.TIZEN_STUDIO_HOME);

  const siteStatusService = getSiteStatusService();
  const siteId = site.id;

  const app = await siteStatusService.getTempData(siteId, 'appInfo');
  const manifest = await siteStatusService.getTempData(siteId, 'manifest');

  if (!app || !manifest) {
    console.error('[오류] appInfo 또는 manifest 누락');
    logSiteStepFailed(site, step, {
      reason: 'Missing appInfo or manifest in temp storage',
    });
    await siteStatusService.markFailed(site, step);
    return false;
  }

  const baseOutputDir = process.env.ANDROID_OUTPUT_PATH;
  const safeName = getSafeName(app.name);
  const outputDir = path.join(baseOutputDir, safeName);

  try {
    const packageName = `com.example.app${app.id}`;
    console.log('[디렉토리] 생성 경로:', outputDir);
    await mkdirAsync(baseOutputDir, { recursive: true });

    if (await existsAsync(outputDir)) {
      console.log('[디렉토리] 기존 삭제 중:', outputDir);
      await fs.promises.rm(outputDir, { recursive: true, force: true });
    }

    console.log('[Cordova] 프로젝트 생성 중...');
    await execAsync(
      `cordova create "${outputDir}" "${packageName}" "${app.name}"`
    );

    const maxAttempts = 10;
    for (let i = 1; i <= maxAttempts; i++) {
      const wwwExists = await existsAsync(path.join(outputDir, 'www'));
      const configExists = await existsAsync(
        path.join(outputDir, 'config.xml')
      );
      if (wwwExists && configExists) break;
      if (i === maxAttempts)
        throw new Error('Cordova project creation timeout');
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log('[index.html] 생성 중');
    const indexHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${app.name}</title><script>window.location.href = "${app.url}";</script></head><body><h1>Loading ${app.name}...</h1></body></html>`;
    await writeFileAsync(path.join(outputDir, 'www', 'index.html'), indexHtml);

    if (!app.icon) throw new Error('App icon not provided');

    console.log('[아이콘] 다운로드 중:', app.icon);
    const iconDir = path.join(outputDir, 'www', 'res', 'icon', 'android');
    await mkdirAsync(iconDir, { recursive: true });
    await downloadIconToPath(app.icon, path.join(iconDir, 'icon.png'));

    await writeConfigXml(path.join(outputDir, 'config.xml'), app);
    const keystoreFile = await generateKeystore(outputDir);
    await writeBuildJson(outputDir, keystoreFile);

    // console.log('[Cordova] cordova-android@9.1.0 설치 중...');
    // await execAsync(`cd "${outputDir}" && cordova platform add android@9.1.0`);
    // console.log('[Cordova] 플랫폼 추가 완료');

    // console.log('[Cordova] cordova-android 플랫폼 추가 중...');
    // await execAsync(`cd "${outputDir}" && cordova platform add android@9.1.0 --searchpath=/app/plugin-cache --verbose`);
    // console.log('[Cordova] 플랫폼 추가 완료');

    // console.log('[npm] cordova-android 설치 및 플랫폼 추가 중...');
    // await execAsync(`cd "${outputDir}" && npm init -y && npm install cordova-android@9.1.0 && cordova platform add android`);
    // console.log('[Cordova] 플랫폼 추가 완료');

    console.log('[npm] 이전 버전 cordova-android 설치 및 플랫폼 추가 중...');
    await execAsync(`cd "${outputDir}" && npm init -y && npm install cordova-android@7.1.4 && cordova platform add android`);
    console.log('[Cordova] 플랫폼 추가 완료');

    const plugins = [
      'cordova-plugin-inappbrowser',
      'cordova-plugin-whitelist',
      'cordova-plugin-splashscreen',
    ];
    for (const plugin of plugins) {
      console.log('[Cordova Plugin] 추가 중:', plugin);
      await execAsync(
        `cd "${outputDir}" && cordova plugin add ${plugin} --searchpath=/app/plugin-cache --verbose`,
        {
          env: {
            ...process.env,
            HOME: process.env.HOME || '/home/ubuntu',
            PATH: process.env.PATH,
          },
        }
      );
    }

    // Gradle 파일 수정 부분 추가
    console.log('[Gradle] CordovaLib build.gradle 수정 중...');
    const cordovaLibBuildGradlePath = path.join(outputDir, 'platforms', 'android', 'CordovaLib', 'build.gradle');

    if (await existsAsync(cordovaLibBuildGradlePath)) {
    let cordovaLibBuildGradle = await readFileAsync(cordovaLibBuildGradlePath, 'utf8');
    
    // bintray 플러그인 적용 부분 제거
    cordovaLibBuildGradle = cordovaLibBuildGradle.replace(/apply plugin: ['"]com.jfrog.bintray['"]/, '// apply plugin: "com.jfrog.bintray"');
    
    // bintray 의존성 부분 제거
    cordovaLibBuildGradle = cordovaLibBuildGradle.replace(/classpath ['"]com.jfrog.bintray.gradle:gradle-bintray-plugin:1.7.3['"]/, '// classpath "com.jfrog.bintray.gradle:gradle-bintray-plugin:1.7.3"');
    
    // bintray 관련 태스크 제거 (있을 경우)
    if (cordovaLibBuildGradle.includes('bintray {')) {
        cordovaLibBuildGradle = cordovaLibBuildGradle.replace(/bintray \{[\s\S]*?\n\}/, '// bintray section removed');
    }
    
    await writeFileAsync(cordovaLibBuildGradlePath, cordovaLibBuildGradle);
    console.log('[Gradle] CordovaLib build.gradle 수정 완료');
    }


    console.log('[Cordova] 빌드 시작');
    await execAsync(
        `cd "${outputDir}" && cordova build android --release -- --packageType=apk`
    );
    logSiteStepTrace(site, step, 'APK build complete');

    const apkOutputDir = path.join(
      outputDir,
      'platforms',
      'android',
      'app',
      'build',
      'outputs',
      'apk',
      'release'
    );
    const originalApkPath = path.join(apkOutputDir, 'app-release.apk');
    const newApkName = `${safeName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')}.apk`;
    const newApkPath = path.join(apkOutputDir, newApkName);

    console.log('[APK] 파일 확인 중:', originalApkPath);
    if (!(await existsAsync(originalApkPath))) {
      throw new Error('APK file not generated: app-release.apk not found');
    }

    console.log('[APK] 이름 변경 중 →', newApkName);
    await fs.promises.rename(originalApkPath, newApkPath);

    console.log('[S3] 업로드 시작:', newApkName);
    const fileBuffer = await readFileAsync(newApkPath);
    const s3Url = await uploadToS3(app.name, newApkName, fileBuffer);

    const stats = await statAsync(newApkPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    const result = {
      file_size: `${fileSizeKB} KB`,
      download_url: s3Url,
    };

    await siteStatusService.setTempData(siteId, step, result);
    logSiteStepSuccess(site, step, result);
    await siteStatusService.markSuccess(site, step);

    console.log('[완료] APK 빌드 및 업로드 완료');
    return result;
  } catch (error) {
    console.error('[에러 발생]', error.message);
    console.error(error.stack);
    logSiteStepFailed(site, step, { reason: error.message });
    await siteStatusService.markFailed(site, step);
    return false;
  } finally {
    console.log('[정리] 임시 디렉토리 삭제 중:', outputDir);
    await removeLocalDirectory(outputDir);
  }
};

module.exports = { buildAndroidApp };
