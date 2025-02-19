import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

const DisplayHome = () => {
    const [relatedArtists, setRelatedArtists] = useState([]);   // Para armazenar as músicas
    const [albums, setAlbums] = useState([]); // Para armazenar os álbuns

    const fetchNewReleases = async () => {
        const response = await fetch("http://localhost:3000/token"); // Pega o token do backend
        const data = await response.json();
        const token = data.access_token;

        // Requisição para o endpoint de new releases (últimos lançamentos)
        const releasesResponse = await fetch("https://api.spotify.com/v1/browse/new-releases", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const releasesData = await releasesResponse.json();

        // Pega os 10 primeiros álbuns
        const albumItems = releasesData.albums.items.slice(0, 10);

        // Faz uma requisição adicional para cada álbum para pegar as músicas
        const albumsWithTracks = await Promise.all(albumItems.map(async (album) => {
            const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${album.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const albumData = await albumResponse.json();
            return {
                ...album,
                tracks: albumData.tracks?.items || [], // Garante que tracks seja uma lista, mesmo que vazia
            };
        }));

        console.log('albumsWithTracks', albumsWithTracks); // Verifique a estrutura dos álbuns

        setAlbums(albumsWithTracks); // Atualiza os álbuns com as faixas
    };

    const fetchRelatedArtists = async () => {
        const response = await fetch("http://localhost:3000/token"); // Pega o token do backend
        const data = await response.json();
        const token = data.access_token;

        // ID do artista "Bring Me The Horizon"
        const artistName = "bring";

        // Requisição para buscar artistas relacionados
        const relatedArtistsResponse = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist,track&limit=10`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const relatedArtistsData = await relatedArtistsResponse.json();

        console.log('relatedArtistsData', relatedArtistsData.tracks.items);

        setRelatedArtists(relatedArtistsData.tracks.items); // Atualiza os artistas relacionados
    };


    // Chamando a função quando o componente monta
    useEffect(() => {
        fetchNewReleases(); // Faz a requisição assim que o componente for montado
        fetchRelatedArtists(); // Faz a requisição assim que o componente for montado
    }, []);

    return (
        <>
            <Navbar />

            <div className="mb-4">
                <h1 className="my-5 ml-2 font-bold text-2xl">New Releases</h1>
                <div className="flex no-scrollbar overflow-auto">
                    {albums.length > 0 ? (
                        albums.map((item) => (
                            <AlbumItem
                                key={item.id}
                                img={item.images?.[0]?.url || ""}
                                name={item.artists[0]?.name || ""} // Imagem do álbum
                                desc={item.name}                   // Nome do álbum
                                id={item.id}                      // ID do álbum
                                album={item}                      // Dados do álbum
                            />
                        ))
                    ) : (
                        <p>Carregando álbuns...</p>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <h1 className="my-5 font-bold ml-2 text-2xl">Recommendations for you</h1>
                <div className="flex no-scrollbar overflow-auto">
                    {relatedArtists.length > 0 ? (
                        relatedArtists.map((item) => (
                            <SongItem
                                key={item.id}
                                img={item.album.images?.[0]?.url || ""}
                                name={item.name}
                                desc={item.artists[0]?.name || ""}
                                id={item.id}
                            />
                        ))
                    ) : (
                        <p>Carregando músicas...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default DisplayHome;
