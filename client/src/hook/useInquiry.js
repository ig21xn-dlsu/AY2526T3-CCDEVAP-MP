import { useState, useCallback } from "react";

const getToken = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser?.token;
};

const useInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [sending, setSending] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const sendInquiry = async (listingId, messageBody) => {
    setSending(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ listingId, messageBody }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send inquiry.");
      }

      return data; // { message, inquiry }
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
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  }, []);

  const markAsRead = async (inquiryId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inquiries/${inquiryId}/read`,
        {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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
