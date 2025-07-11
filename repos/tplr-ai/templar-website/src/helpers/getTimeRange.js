/**
 * Maps timeRange parameter to actual Flux query timeRange value
 * @param {string} timeRange - One of 'latest', '1h', '24h', '1w', or a custom time range
 * @returns {Object} Object containing the mapped timeRange and boolean onlyLatestVersion
 */
export function getTimeRange(timeRange) {
  const timeRangeMap = {
    latest: { range: '-3d', onlyLatestVersion: true },
    '1h': { range: '-1h', onlyLatestVersion: false },
    '24h': { range: '-24h', onlyLatestVersion: false },
    '1w': { range: '-7d', onlyLatestVersion: false },
  };

  if (timeRange in timeRangeMap) {
    return timeRangeMap[timeRange];
  }

  // If not a predefined value, use as-is (fallback) with both versions
  return { range: timeRange || '-24h', onlyLatestVersion: false };
}