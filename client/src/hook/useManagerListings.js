// client/hooks/useManagerListings.js
import { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext.jsx'

function useManagerListings() {
  const { user } = useContext(AuthContext)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchListings = useCallback(async () => {
    if (!user?.token) return
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/listing/manager`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      console.log('API response:', response.data) // check shape here
      setListings(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return { listings, loading, error, refetch: fetchListings }
}

export default useManagerListings
