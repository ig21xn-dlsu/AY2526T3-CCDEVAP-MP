const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, v));
    } else {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`PadPal API error (${res.status}): ${message || res.statusText}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

/**
 * GET /groups
 * Query params: search, campus, gender, maxBudget
 * Returns: Array<{
 *   id, name, school, budget, match, desc, tags: string[],
 *   members: Array<{ id, initials, color, imgUrl }>, tab: 'coliving'
 * }>
 */
export function fetchCoLivingGroups(filters = {}) {
  return request(
    `/groups${buildQuery({
      search: filters.search,
      campus: filters.campus,
      gender: filters.gender,
      maxBudget: filters.maxBudget,
    })}`
  );
}

/**
 * GET /shared-spaces
 * Query params: search, campus, maxDistanceKm, minPrice, maxPrice, occupancy[], amenities[]
 * Returns: Array<{
 *   id, name, school, price, address, desc, match, tags: string[],
 *   image, vacancy, roommates, distanceKm, amenities: string[], tab: 'shared'
 * }>
 */
export function fetchSharedSpaces(filters = {}) {
  return request(
    `/shared-spaces${buildQuery({
      search: filters.search,
      campus: filters.campus,
      maxDistanceKm: filters.maxDistanceKm,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      occupancy: filters.occupancy,
      amenities: filters.amenities,
    })}`
  );
}

/**
 * GET /campuses
 * Returns: Array<{ id, name }>
 * Used to populate the campus filter dropdown instead of a hardcoded list.
 */
export function fetchCampuses() {
  return request('/campuses');
}

/**
 * GET /me
 * Returns: { id, name, email, avatarUrl }
 */
export function fetchCurrentUser() {
  return request('/me');
}

/**
 * GET /me/group
 * Returns: { id } | null  — the signed-in user's current co-living group, if any.
 * Used by the "Your Group" nav button.
 */
export function fetchMyGroup() {
  return request('/me/group');
}

/**
 * GET /groups/:id
 * Returns the full group-profile payload: {
 *   id, name, badge, location, heroImg,
 *   members: Array<{ id, initials, color, imgUrl }>,
 *   vibe, tags: string[],
 *   listing: { name, img, meta, desc, url },
 *   preferences: Array<{ icon: 'clean'|'noise'|'social', label, value }>,
 *   budget, moveIn, lease
 * }
 * Used by the Group Profile page. A 404 should be treated as "not found" by the caller.
 */
export function fetchGroupById(id) {
  return request(`/groups/${id}`);
}

/**
 * POST /groups/:id/applications
 * Body: { name, age, gender, email, notes }
 * Returns: { id, status } (or whatever confirmation payload your backend sends back)
 * Used by the "Apply to Join" modal on the Group Profile page.
 */
export function submitGroupApplication(groupId, payload) {
  return request(`/groups/${groupId}/applications`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
