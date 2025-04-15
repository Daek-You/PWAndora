const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const crypto = require('crypto');
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

const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);
const writeFileAsync = promisify(fs.writeFile);
const execAsync = promisify(exec);
const statAsync = promisify(fs.stat);

const step = PipelineSteps.TIZEN;
const TIZEN_CLI = process.env.TIZEN_CLI;
const ROOT_PATH = process.env.TIZEN_OUTPUT_PATH;
const OUTPUT_PATH = path.join(ROOT_PATH, 'output');

const removeLocalDirectory = async (targetPath) => {
  return fs.promises.rm(targetPath, { recursive: true, force: true });
};

const writeConfigXml = async (configPath, app) => {
  const siteStatusService = getSiteStatusService();

  const safeName = getSafeName(app.name);
  const hash = crypto
    .createHash('md5')
    .update(app.url + Date.now())
    .digest('hex')
    .substring(0, 6);
  const packageId = `pwa0${hash}`;
  const appId = `${packageId}.app`;
  const url = app.start_url || app.url;

  const configXml = `<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://pwandora/apps/${safeName}" version="1.0.0">
  <name>${app.name}</name>
  <icon src="icon.png"/>
  <feature name="http://tizen.org/feature/screen.size.all"/>
  <tizen:setting screen-orientation="auto-rotation"/>
  <tizen:content src="${url.replace(/&(?!amp;)/g, '&amp;')}"/>
  <tizen:application id="${appId}" package="${packageId}" required_version="7.0"/>
  <tizen:profile name="tizen"/>
  <tizen:privilege name="http://tizen.org/privilege/internet"/>
  <tizen:privilege name="http://tizen.org/privilege/network.get"/>
  <tizen:privilege name="http://tizen.org/privilege/network.set"/>
  <tizen:privilege name="http://tizen.org/privilege/alarm"/>
  <tizen:privilege name="http://tizen.org/privilege/content.read"/>
  <tizen:privilege name="http://tizen.org/privilege/content.write"/>
  <tizen:privilege name="http://tizen.org/privilege/download"/>
  <tizen:privilege name="http://tizen.org/privilege/filesystem.read"/>
  <tizen:privilege name="http://tizen.org/privilege/filesystem.write"/>
  <tizen:privilege name="http://tizen.org/privilege/location"/>
  <tizen:privilege name="http://tizen.org/privilege/notification"/>
  <tizen:privilege name="http://tizen.org/privilege/audiorecorder"/>
  <tizen:privilege name="http://tizen.org/privilege/camera"/>
  <tizen:privilege name="http://tizen.org/privilege/fullscreen"/>
  <access origin="*" subdomains="true"/>
</widget>`;

  await writeFileAsync(configPath, configXml, 'utf8');
  await siteStatusService.setTempData(app.id, 'appId', packageId);
  return packageId;
};

const prepareTizenProject = async (site, app) => {
  const safeName = getSafeName(app.name);
  const projectPath = path.join(ROOT_PATH, safeName);
  if (!(await existsAsync(projectPath))) {
    await mkdirAsync(projectPath, { recursive: true });
  }

  const configPath = path.join(projectPath, 'config.xml');
  const appId = await writeConfigXml(configPath, app);

  await downloadIconToPath(app.icon, path.join(projectPath, 'icon.png'));

  return { projectPath, appId, safeName };
};

const buildTizenApp = async (site) => {
  const siteStatusService = getSiteStatusService();
  const siteId = site.id;
  let projectPath = null;
  let wgtFilePath = null;

  try {
    const appInfo = await siteStatusService.getTempData(siteId, 'appInfo');
    console.log(appInfo);
    if (!appInfo) {
      throw new Error('appInfo not found');
    }
    const {
      projectPath: pathCreated,
      appId,
      safeName,
    } = await prepareTizenProject(site, appInfo);
    projectPath = pathCreated;

    if (!appId) throw new Error(`appId generation failed for site ${siteId}`);

    if (!(await existsAsync(OUTPUT_PATH))) {
      await mkdirAsync(OUTPUT_PATH, { recursive: true });
    }

    const buildCommand = `"${TIZEN_CLI}" build-web -- "${projectPath}"`;
    const buildOutput = await execAsync(buildCommand);

    const packageCommand = `"${TIZEN_CLI}" package -t wgt -o "${OUTPUT_PATH}" -- "${projectPath}"`;
    const packageOutput = await execAsync(packageCommand);

    const files = await fs.promises.readdir(OUTPUT_PATH);
    const wgtFile = files.find(
      (f) => f.endsWith('.wgt') && f.includes(safeName)
    );
    if (!wgtFile) throw new Error('WGT file not found');

    wgtFilePath = path.join(OUTPUT_PATH, wgtFile);
    const stats = await statAsync(wgtFilePath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    const buffer = await fs.promises.readFile(wgtFilePath);
    const s3Url = await uploadToS3(appInfo.name, `${safeName}.wgt`, buffer);

    const result = {
      file_size: `${fileSizeKB} KB`,
      download_url: s3Url,
    };

    await siteStatusService.setTempData(siteId, step, result);
    logSiteStepSuccess(site, step);
    await siteStatusService.markSuccess(site, step);
    return result;
  } catch (error) {
    console.error('[Tizen Build] Detailed error:', {
      message: error.message,
      stack: error.stack,
      command: error.cmd,
      output: error.output,
      projectPath,
      outputPath: OUTPUT_PATH,
      tizenCli: TIZEN_CLI,
    });
    logSiteStepFailed(site, step, { reason: error.message });
    await siteStatusService.markFailed(site, step);
    return false;
  } finally {
    try {
      if (projectPath) await removeLocalDirectory(projectPath);
      if (wgtFilePath) await fs.promises.unlink(wgtFilePath);
      logSiteStepTrace(site, step, 'Local build files removed');
    } catch (cleanupErr) {
      logSiteStepTrace(site, step, 'Local cleanup failed', {
        reason: cleanupErr.message,
      });
    }
  }
};

module.exports = {
  buildTizenApp,
  writeConfigXml,
  removeLocalDirectory,
};
