import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const useInquiry = () => {
  const { user } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const sendInquiry = async (listingId, messageBody) => {
    setSending(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({ listingId, messageBody }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send inquiry.");
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSending(false);
    }
  };

  const fetchInquiries = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load inquiries.");
      }
      setInquiries(data.inquiries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  }, [user?.token]);

  const markAsRead = async (inquiryId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inquiries/${inquiryId}/read`,
        {
          method: "PATCH",
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark as read.");
      }
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, isRead: true } : inq))
      );
      return data;
    } catch (err) {
      console.error("Failed to mark as read:", err);
      return null;
    }
  };

  return {
    sendInquiry,
    sending,
    fetchInquiries,
    fetching,
    inquiries,
    markAsRead,
    error,
  };
};

export default useInquiry;
