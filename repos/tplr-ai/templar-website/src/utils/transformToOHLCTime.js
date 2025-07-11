/**
 * Transforms an array of query rows into an OHLC series using the _time field.
 *
 * Each row should have at least:
 *   - _time: the timestamp in ISO format.
 *   - _value: the loss value (as a string or number).
 *
 * The function groups rows into time buckets (by default 30 minutes) and then computes:
 *   - open: the first loss value in the bucket.
 *   - close: the last loss value.
 *   - high: the maximum loss value.
 *   - low: the minimum loss value.
 *
 * The output format adheres to ApexCharts' candlestick specification:
 *   [{
 *     data: [
 *       [bucketTimestamp, [open, high, low, close]],
 *       ...
 *     ]
 *   }]
 *
 * @param {Array<Object>} data - The rows returned from your query.
 * @param {number} [bucketWidth=30*60*1000] - Bucket width in milliseconds (default 30 minutes).
 * @returns {Array<Object>} - An array containing one object with a "data" property.
 *
 * TODO:
 *  - Adjust bucketWidth if your data requires a different time resolution.
 *  - If the query returns one row per bucket already, you might bypass further grouping.
 */
export function transformToOHLCTime(data, bucketWidth = 30 * 60 * 1000) {
    const buckets = {};

    data.forEach((row) => {
        const timeMs = new Date(row._time).getTime();
        // Skip rows with invalid _time values.
        if (isNaN(timeMs)) return;

        // Bucket the time: all times within the same bucket will share the same key.
        const bucketKey = Math.floor(timeMs / bucketWidth) * bucketWidth;
        if (!buckets[bucketKey]) {
            buckets[bucketKey] = [];
        }
        buckets[bucketKey].push({
            time: timeMs, // used for ordering inside the bucket
            value: parseFloat(row._value),
        });
    });

    // Create the OHLC series.
    const seriesData = Object.keys(buckets)
        .map((key) => {
            // Sort bucket entries by time so that open and close are determined correctly.
            const bucketData = buckets[key].sort((a, b) => a.time - b.time);
            const open = bucketData[0].value;
            const close = bucketData[bucketData.length - 1].value;
            const high = Math.max(...bucketData.map((d) => d.value));
            const low = Math.min(...bucketData.map((d) => d.value));

            return [
                // Convert the bucketKey (epoch ms) to an ISO date string for a readable x-axis.
                new Date(Number(key)).toISOString(),
                [open, high, low, close].map((v) => Number(v.toFixed(4)))
            ];
        })
        .sort((a, b) => new Date(a[0]) - new Date(b[0]));

    return [{ data: seriesData }];
}