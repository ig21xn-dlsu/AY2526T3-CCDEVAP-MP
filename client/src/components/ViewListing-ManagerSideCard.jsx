// components/ManagerCard.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

function ManagerCard({ ownerId }) {
  const [manager, setManager] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!ownerId) return;
    const fetchManagerInfo = async () => {
      setLoading(true);
      try {
        const [userRes, cardRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/auth/${ownerId}`),
          axios.get(`${API_URL}/api/calling-card/${ownerId}`),
        ]);
        if (userRes.status === 'fulfilled') {
          setManager(userRes.value.data);
        }
        if (cardRes.status === 'fulfilled') {
          setCard(cardRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load manager info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerInfo();
  }, [ownerId, API_URL]);

  if (loading) return <div className="card shadow p-4">Loading manager info...</div>;
  if (!manager) return null;
  console.log("Manager object: ", manager);
  return (
    <div className="card shadow managerCard d-flex flex-column p-4 gap-3">
      <h4 className="border-bottom pb-2">Listed by</h4>
      <h5>{manager.firstName} {manager.lastName}</h5>
      {card ? (
        <>
          {card.phone && <p className="mb-1">📞 {card.phone}</p>}
          {card.email && <p className="mb-1">✉️ {card.email}</p>}
          {card.links?.length > 0 && (
            <div className="d-flex gap-2 flex-wrap mt-2">
              {card.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-muted mb-0">This manager hasn't set up contact info yet.</p>
      )
      }
    </div >
  );
}
export default ManagerCard
