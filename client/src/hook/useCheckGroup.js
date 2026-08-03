import { useState } from "react";
import axios from "axios";

export function useCheckGroup() {
  const [checking, setChecking] = useState(false);
  const [group, setGroup] = useState(null);   // holds the found group object
  const [error, setError] = useState(null);

  const checkGroup = async (groupId) => {
    setChecking(true);
    setError(null);
    setGroup(null);
    try {
      const res = await axios.get(`/api/groups/${groupId}`);

      // Defensive check: even a 200 response should look like a real group.
      if (!res.data || !res.data._id) {
        const message = res.data?.message || "No group found with that ID";
        setError(message);
        throw new Error(message);
      }

      setGroup(res.data);
      return res.data;
    } catch (err) {
      setError((prev) =>
        prev
          ? prev
          : err.response?.status === 404
            ? "No group found with that ID"
            : err.response?.status === 400
              ? err.response?.data?.message || "Invalid group ID"
              : err.response?.data?.message || err.message
      );
      throw err;
    } finally {
      setChecking(false);
    }
  };

  const reset = () => {
    setGroup(null);
    setError(null);
  };

  return { checkGroup, checking, group, error, reset };
}
