const API_URL = "http://localhost:3000/token"; // Backend Express

export async function getSpotifyToken() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.access_token;
}
