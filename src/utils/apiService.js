// src/utils/apiService.js

// 🚨 FINAL FIX: The project ID 'trackopmn' is now injected into the base URL.
const API_BASE_URL = "https://us-central1-trackopmn.cloudfunctions.net/api";

/**
 * Executes a secure, authenticated request to a backend API endpoint.
 * This function handles the secure token and the full URL path.
 * @param {string} endpoint - The path after /api/ (e.g., 'roster/student')
 * @param {string} method - HTTP method ('GET', 'POST', 'PUT').
 * @param {Object} body - Request body object.
 * @param {Object} user - Firebase User object (to get the secure token).
 */
export async function secureFetch(endpoint, method = 'GET', body = null, user) {
    if (!user) throw new Error("Authentication required for API access.");

    const token = await user.getIdToken();
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            // CRITICAL: Passing the secure Authorization token
            'Authorization': `Bearer ${token}`, 
        },
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(url, options);
    // Attempt to parse JSON, providing a fallback error object if parsing fails
    const data = await response.json().catch(() => ({ error: 'Could not parse JSON response.' }));

    if (!response.ok) {
        // Throw server error message if response status is 4xx or 5xx
        throw new Error(data.error || `API Error: ${response.status} - Check function logs for details.`);
    }

    return data;
}
