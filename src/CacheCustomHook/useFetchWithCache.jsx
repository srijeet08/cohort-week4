import { useState, useEffect, useRef } from "react";
import { cache, inFlightRequests } from "./apiCache";

const DEFAULT_TTL = 60 * 1000; // 1min

/*
cache structure:
cache.set(url, {
    data,
    timestamp
})
*/

export function useFetchWithCache(url, options = {}, ttl = DEFAULT_TTL) {
  const [data, setData] = useState(() => cache.get(url)?.data || null);
  const [loading, setLoading] = useState(!cache.has(url));
  const [error, setError] = useState(null);

  // const abortControllerRef = useRef(null);

  const isCacheValid = () => {
    const cached = cache.get(url);
    if (!cached) {
      return false;
    }

    const isNotExpired = Date.now() - cached.timestamp < ttl;

    return isNotExpired;
  };

  const fetchData = async (forceRefresh = false) => {
    try {
      setError(null);

      //valid cache
      if (!forceRefresh && isCacheValid()) {
        setData(cache.get(url).data);
        setLoading(false);
        return;
      }

      //if request already running, reuse it
      if (!inFlightRequests.has(url)) {
        // if (!abortControllerRef.current) {
        //   abortControllerRef.current = new AbortController();
        // }

        const request = fetch(url, {
          ...options,
          // signal: abortControllerRef.current.signal,
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("API Error");
            }

            return res.json();
          })
          .then((result) => {
            cache.set(url, {
              data: result,
              timestamp: Date.now(),
            });

            inFlightRequests.delete(url);
            return result;
          })
          .catch((err) => {
            inFlightRequests.delete(url);
            throw err;
          });

        inFlightRequests.set(url, request);
      }

      setLoading(true);
      const result = await inFlightRequests.get(url);

      if (result) {
        setData(result);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // cleanup when component unmounts
    // return () => {
    //   abortControllerRef.current?.abort();
    // };
  }, [url]);

  const refresh = () => fetchData(true);

  const invalidate = () => {
    cache.delete(url);
    inFlightRequests.delete(url);
    fetchData(true);
  };

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
  };
}
