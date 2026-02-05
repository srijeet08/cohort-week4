export const cache = new Map();
export const inFlightRequests = new Map();

/*
cache structure:
cache.set(url, {
    data,
    timestamp
})
*/
