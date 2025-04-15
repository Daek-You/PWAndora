const { handleEventProcessing } = require('../services/event/eventService');

const handleEventRequest = async (req, res) => {
  const { pwaId } = req.body;

  try {
    const result = await handleEventProcessing(pwaId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[Event Controller Error]', error);
    return res.status(500).json({
      success: false,
      message: '이벤트 처리 중 오류 발생',
      error: error.message,
    });
  }
};

module.exports = { handleEventRequest };
