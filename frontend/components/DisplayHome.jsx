import React, { useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import ArtistItem from "./ArtistItem";
import { SearchContext } from "../context/SearchContext";

const DisplayHome = () => {
    const { artists, tracks, albums, setAlbums } = useContext(SearchContext);
    const [recommendations, setRecommendations] = useState([]);
    const [searchActive, setSearchActive] = useState(false); // Estado para saber se a pesquisa foi realizada
    const [newReleases, setNewReleases] = useState([]); // Estado para armazenar os novos lançamentos

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
        setNewReleases(albumsWithTracks); // Atualiza os lançamentos recentes
    };

    const fetchRecommendations = async () => {
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

        setRecommendations(relatedArtistsData.tracks.items); // Atualiza os artistas relacionados
    };

    useEffect(() => {
        fetchRecommendations(); // Faz a requisição de recomendações assim que o componente for montado
    }, []);

    useEffect(() => {
        if (!searchActive) { // Só chama a função para buscar os novos lançamentos se não houver pesquisa ativa
            fetchNewReleases();
        }
    }, [searchActive]); // A requisição para novos lançamentos só acontece quando a pesquisa não está ativa

    useEffect(() => {
        // Sempre que uma pesquisa for realizada, a variável searchActive é setada como true
        if (artists.length > 0 || tracks.length > 0) {
            setSearchActive(true);
        } else {
            setSearchActive(false);
        }
    }, [artists, tracks]);

    return (
        <>
            <Navbar />
            {artists.length === 0 && tracks.length === 0 ? (
                <>
                    <div className="mb-4">
                        <h1 className="my-5 ml-2 font-bold text-2xl">New Releases</h1>
                        <div className="flex no-scrollbar overflow-auto">
                            {newReleases.length > 0 ? (
                                newReleases.map((item) => (
                                    <AlbumItem
                                        key={item.id}
                                        img={item.images?.[0]?.url || null}
                                        name={item.artists[0]?.name || null}
                                        desc={item.name}
                                        id={item.id}
                                        album={item}
                                    />
                                ))
                            ) : (
                                <p>Carregando álbuns...</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h1 className="my-5 ml-2 font-bold text-2xl">Recommendations</h1>
                        <div className="flex no-scrollbar overflow-auto">
                            {recommendations.length > 0 ? (
                                recommendations.map((track) => (
                                    <SongItem
                                        key={track.id}
                                        img={track.album.images?.[0]?.url || null}
                                        name={track.name}
                                        desc={track.artists[0]?.name || null}
                                        id={track.id}
                                    />
                                ))
                            ) : (
                                <p>Carregando recomendações...</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-4">
                        <h1 className="my-5 font-bold ml-2 text-2xl">Artists Found</h1>
                        <div className="flex no-scrollbar overflow-auto">
                            {artists.map((artist) => (
                                <ArtistItem
                                    key={artist.id}
                                    img={artist.images?.[0]?.url || null}
                                    name={artist.name}
                                    desc={artist.genres?.join(", ") || ""}
                                    id={artist.id}
                                    artist={artist}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h1 className="my-5 font-bold ml-2 text-2xl">Albums Found</h1>
                        <div className="flex no-scrollbar overflow-auto">
                            {albums.map((item) => (
                                <AlbumItem
                                    key={item.id}
                                    img={item.images?.[0]?.url || null}
                                    name={item.name}
                                    desc={item.artists[0]?.name || ""}
                                    id={item.id}
                                    album={item}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default DisplayHome;
