/**
 * Sends a structured SSE message to the client
 * @param {Response} res - Express Response with SSE headers
 * @param {string} event - SSE event name
 * @param {Object} payload - Data to send
 */
const sendSse = (res, event, payload) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

module.exports = { sendSse };
