const API_URL = "https://spotify-clone-zwjk.onrender.com/token"; // Backend Express

export async function getSpotifyToken() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.access_token;
}
