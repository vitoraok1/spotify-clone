import config from "../config";

export async function getSpotifyToken() {
    const response = await fetch(`${config.apiUrl}/token`);
    const data = await response.json();
    return data.access_token;
}
