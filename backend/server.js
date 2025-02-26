import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors()); // Permitir requisições do frontend

// Endpoint para gerar token
app.get("/token", async (req, res) => {
    const authHeader = "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials"
        });

        const data = await response.json();
        res.json(data); // Retorna o token ao frontend
    } catch (error) {
        console.error("Erro ao gerar o token:", error);
        res.status(500).json({ error: "Erro ao gerar o token de acesso" });
    }
});

app.get('/api/search', async (req, res) => {
    const { artist, track } = req.query;

    if (!artist || !track) {
        return res.status(400).json({ error: "Parâmetros 'artist' e 'track' são obrigatórios." });
    }

    try {
        const response = await fetch(`https://api.deezer.com/search?q=artist:"${encodeURIComponent(artist)}" track:"${encodeURIComponent(track)}"`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar música" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
