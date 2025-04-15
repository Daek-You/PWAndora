const connections = new Set();

const CONNECTION_TIMEOUT_MS = 1000 * 60 * 30; // 30분

const addSseConnection = (res) => {
  connections.add(res);

  // 연결 종료 시 자동 제거
  const cleanUp = () => {
    connections.delete(res);
    console.log('SSE 연결 종료됨. 현재 수:', connections.size);
  };

  res.on('close', cleanUp);
  res.on('error', cleanUp);

  // 30분 후 타임아웃 종료
  const timeout = setTimeout(() => {
    res.end();
    console.log('SSE 연결 타임아웃 종료');
  }, CONNECTION_TIMEOUT_MS);

  // 연결 종료 시 타이머도 제거
  res.on('close', () => clearTimeout(timeout));
};

const getAllSseConnections = () => {
  return Array.from(connections);
};

const clearAllConnections = () => {
  connections.forEach((res) => res.end());
  connections.clear();
};

module.exports = {
  addSseConnection,
  getAllSseConnections,
  clearAllConnections,
};
