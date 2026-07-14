import { useState } from "react";

const useInquiry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendInquiry = async (listingId, messageBody) => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

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
      setLoading(false);
    }
  };

  return { sendInquiry, loading, error };
};

export default useInquiry;
