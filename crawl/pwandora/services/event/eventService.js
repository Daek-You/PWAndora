const path = require('path');
const fs = require('fs');
const { extractEventLink } = require('../../utils/event/htmlUtil');
const {
  takeScreenshot,
  preprocessImage,
} = require('../../utils/event/imageUtil');
const { extractTextFromImage } = require('../../utils/event/ocrUtil');
const { summarizeEvent } = require('../../utils/event/aiUtil');
const PwaRepository = require('../../repositories/PwaRepository');
const EventRepository = require('../../repositories/EventRepository');
const ContentRepository = require('../../repositories/ContentRepository');
const EventContentRepository = require('../../repositories/EventContentRepository');
const getDominantColorFromUrl = require('../../utils/event/iconColorUtil');

async function handleEventProcessing(pwaId) {
  const pwa = await PwaRepository.findOneByPwaId(pwaId);
  if (!pwa) {
    return res.status(404).json({ message: 'PWA를 찾을 수 없습니다.' });
  }
  const { website_url: homepageUrl, icon_image: iconUrl } = pwa;

  const imagePath = path.resolve(
    __dirname,
    `../../eventScreenshots/${pwaId}.png`
  );

  let processedImagePath;

  try {
    const eventUrl = await extractEventLink(homepageUrl);
    if (!eventUrl) {
      console.error(
        `[Link Extraction Fail] No event link found at ${homepageUrl}`
      );
      throw new Error('No event link found');
    }

    await takeScreenshot(eventUrl, imagePath);
    processedImagePath = await preprocessImage(imagePath);
    const ocrText = await extractTextFromImage(processedImagePath);

    if (!ocrText || ocrText.trim() === '') {
      throw new Error('OCR failed to extract any text');
    }

    const content = await ContentRepository.findOneByPwaId({
      pwa_id: pwaId,
      language_id: 2,
    });

    const color = (await getDominantColorFromUrl(iconUrl)) || '#cccccc';

    const result = await summarizeEvent(ocrText, content.name);

    try {
      const event = await EventRepository.insertOrUpdate({
        pwa_id: pwaId,
        color,
        start_at: result.startAt || null,
        end_at: result.endAt || null,
      });

      const content_en = await EventContentRepository.insertOrUpdate({
        title: result.title_en,
        description: result.description_en,
        event_id: event.id,
        language_id: 1,
      });

      const content_ko = await EventContentRepository.insertOrUpdate({
        title: result.title_ko,
        description: result.description_ko,
        event_id: event.id,
        language_id: 2,
      });

      return { event, content_en, content_ko };
    } catch (error) {
      console.error('[Event Insert Error]', error);
      throw error;
    }
  } catch (err) {
    console.error('[Event Pipeline Error]', err.message);
    throw err;
  } finally {
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        fs.unlinkSync(processedImagePath);
        console.log(`[Cleanup] Deleted image file: ${imagePath}`);
      }
    } catch (cleanupErr) {
      console.warn(
        `[Cleanup Error] Failed to delete ${imagePath}:`,
        cleanupErr
      );
    }
  }
}

module.exports = { handleEventProcessing };
