// hooks/useAnalytics.js
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAnalytics(days = 14) {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topicsData, setTopicsData] = useState({ topics: [], complaints: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [resOverview, resTrends, resTopics] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch(`/api/analytics/trends?days=${days}`),
        fetch('/api/analytics/topics'),
      ]);

      const [dataOverview, dataTrends, dataTopics] = await Promise.all([
        resOverview.json(),
        resTrends.json(),
        resTopics.json(),
      ]);

      if (!resOverview.ok || !dataOverview.success) {
        throw new Error(dataOverview.error || 'Failed to fetch overview analytics');
      }

      setOverview(dataOverview.data);
      setTrends(dataTrends.data || []);
      setTopicsData(dataTopics.data || { topics: [], complaints: [] });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    async function load() {
      try {
        const [resOverview, resTrends, resTopics] = await Promise.all([
          fetch('/api/analytics/overview'),
          fetch(`/api/analytics/trends?days=${days}`),
          fetch('/api/analytics/topics'),
        ]);

        const [dataOverview, dataTrends, dataTopics] = await Promise.all([
          resOverview.json(),
          resTrends.json(),
          resTopics.json(),
        ]);

        if (!resOverview.ok || !dataOverview.success) {
          throw new Error(dataOverview.error || 'Failed to fetch overview analytics');
        }

        setOverview(dataOverview.data);
        setTrends(dataTrends.data || []);
        setTopicsData(dataTopics.data || { topics: [], complaints: [] });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [days]);

  return {
    overview,
    trends,
    topicsData,
    loading,
    error,
    refresh: fetchAnalytics,
  };
}
