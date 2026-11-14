// hooks/useFeedback.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useFeedback(initialFilters = {}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    search: '',
    sentiment: 'all',
    source: 'all',
    status: 'all',
    rating: 'all',
    sort: 'newest',
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async () => {
    try {
      await Promise.resolve();
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const res = await fetch(`/api/feedback?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load feedbacks');
      }

      setFeedbacks(data.data || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      setTimeout(() => {
        fetchFeedback();
      }, 0);
    }
    return () => {
      isSubscribed = false;
    };
  }, [fetchFeedback]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 whenever any filter other than page changes
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete');
      }

      toast.success('Feedback deleted successfully');
      setFeedbacks((prev) => prev.filter((item) => item._id !== id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    feedbacks,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    refresh: fetchFeedback,
    deleteFeedback,
  };
}
