// src/utils/apiService.js

// 🚨 CRITICAL FIX: Base URL must be defined. 
// REPLACE [YOUR-FIREBASE-PROJECT-ID] with your actual Firebase Project ID.
const API_BASE_URL = "https://us-central1-[YOUR-FIREBASE-PROJECT-ID].cloudfunctions.net/api";

/**
 * Executes a secure, authenticated request to a backend API endpoint.
 * This function abstracts the token and URL handling.
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
    const data = await response.json().catch(() => ({ error: 'Could not parse JSON response.' }));

    if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status} - Check function logs for details.`);
    }

    return data;
}
