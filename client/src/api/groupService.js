const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, options = {}) {
  const storageString = localStorage.getItem('user') || sessionStorage.getItem('user');
  const storedUser = storageString ? JSON.parse(storageString) : null;
  const authHeader = storedUser?.token ? { Authorization: `Bearer ${storedUser.token}` } : {};

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...options.headers },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no/invalid JSON body — leave body as null
  }

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? `Request to ${path} failed with status ${res.status}`,
      res.status,
      body
    );
  }

  return body;
}

/**
 * Fetches the configuration needed to render the form:
 * available lifestyle tags, gender preference options, and the
 * min/max/step bounds for the budget range slider.
 *
 * Expected shape:
 * {
 *   lifestyleTags: [{ id, label, icon }],
 *   genderPreferences: [{ value, label }],
 *   budget: { min, max, step, defaultMin, defaultMax, currencySymbol },
 *   spots: { min, max, default }
 * }
 */
export function fetchGroupFormConfig(signal) {
  return request('/api/groups/form-config', { method: 'GET', signal });
}

/**
 * Submits a new group to the backend.
 * @param {object} payload - see useCreateGroupForm for the exact shape
 */
export function createGroup(payload, signal) {
  return request('/api/groups', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal,
  });
}

export function updateGroup(groupId, payload, signal) {
  return request(`/api/groups/${groupId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    signal,
  });
}

export function deleteGroup(groupId, signal) {
  return request(`/api/groups/${groupId}`, {
    method: 'DELETE',
    signal,
  });
}

export function fetchAvailableListings(signal) {
  return request('/api/shared-spaces', {
    method: 'GET',
    signal,
  });
}

export { ApiError };
