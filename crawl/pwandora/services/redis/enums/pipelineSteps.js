const PipelineSteps = {
  CHECK: 'checkPWA',
  TIZEN: 'tizenPackaging',
  ANDROID: 'androidPackaging',
  SCREENSHOT: 'takeScreenshots',
  AI: 'aiDataGeneration',
  INSPECTION: 'inspection',
  SAVE: 'savePWA',
};

module.exports = { PipelineSteps };
