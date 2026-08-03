import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

export function useAssignGroup() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeader = { Authorization: `Bearer ${user?.token}` };

  const assignGroup = async (listingId, groupId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/listing/${listingId}/assign-group`,
        { groupId, doClear: false },
        { headers: authHeader }
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearGroup = async (listingId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/listing/${listingId}/assign-group`,
        { doClear: true },
        { headers: authHeader }
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { assignGroup, clearGroup, loading, error };
}
