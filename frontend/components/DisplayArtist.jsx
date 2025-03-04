import React, { useContext, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';
import { SearchContext } from '../context/SearchContext';
import { assets } from '../assets/assets';

const DisplayArtist = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const artistData = location.state?.artist;
    const { playWithName, setSelectedTrack, selectedTrack } = useContext(PlayerContext);
    const { searchAlbum } = useContext(SearchContext);
    const [artistTracks, setArtistTracks] = useState([]);
    const [artistAlbums, setArtistAlbums] = useState([]);
    const [visibleTracks, setVisibleTracks] = useState(5);
    const [showAll, setShowAll] = useState(false);
    const [visibleAlbums, setVisibleAlbums] = useState(4); // Inicialmente mostra 5
    const [showAllAlbums, setShowAllAlbums] = useState(false);
    const [hoveredTrack, setHoveredTrack] = useState(null);
    const [selectedType, setSelectedType] = useState('album'); // Estado para armazenar o tipo de álbum selecionado

    if (!artistData) {
        return <p>Carregando...</p>;
    }

    const handleTrackClick = (track) => {
        playWithName(track.artists[0].name, track.name);
        setSelectedTrack(track.id); // Atualiza o estado de seleção para a faixa clicada
    };

    const handleAlbumClick = async (album) => {

        try {
            const albumData = await fetchAlbumData(album.id);
            const albumSongs = await searchAlbum(album.artists[0].name, album.name);
            navigate(`/album/${album.id}`, { state: { albumData, albumSongs } });
        } catch (error) {
            console.error("Erro ao buscar dados do álbum:", error);
        }
    };

    const fetchArtistData = async () => {
        try {
            const response = await fetch("http://localhost:3000/token");
            const data = await response.json();
            const token = data.access_token;
            const artistId = artistData.id;

            const [tracksResponse, albumsResponse] = await Promise.all([
                fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }),
                fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?market=US`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
            ]);

            const [tracksData, albumsData] = await Promise.all([
                tracksResponse.json(),
                albumsResponse.json()
            ]);

            setArtistTracks(tracksData.tracks);
            setArtistAlbums(albumsData.items);
        } catch (error) {
            console.error("Erro ao buscar dados do artista:", error);
        }
    };

    const fetchAlbumData = async (albumId) => {

        try {
            const response = await fetch("http://localhost:3000/token");
            const data = await response.json();
            const token = data.access_token;

            const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const albumData = await albumResponse.json();

            return {
                ...albumData,
                tracks: albumData.tracks?.items || [], // Garante que tracks seja uma lista, mesmo que vazia
            };
        } catch (error) {
            console.error("Erro ao buscar dados do álbum:", error);
        }
    }

    useEffect(() => {
        fetchArtistData();

        const handleResize = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth >= 1600) {
                setVisibleAlbums(10);
            } else if (screenWidth >= 1200) {
                setVisibleAlbums(8);
            } else if (screenWidth >= 992) {
                setVisibleAlbums(6);
            } else if (screenWidth >= 768) {
                setVisibleAlbums(5);
            } else {
                setVisibleAlbums(4);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    // Alterna entre mostrar mais ou menos músicas
    const toggleShowAll = () => {
        setShowAll(!showAll);
        setVisibleTracks(showAll ? 5 : artistTracks.length);
    };

    const toggleShowAllAlbums = () => {
        setShowAllAlbums(!showAllAlbums);
        setVisibleAlbums(showAllAlbums ? 5 : artistAlbums.length);
    };

    const filteredAlbums = artistAlbums
        .filter(album => album.album_type === selectedType)
        .slice(0, visibleAlbums);

    return (
        <>
            <Navbar />
            <div className="text-white">
                {/* <!-- Container do Artista --> */}
                <div className="relative p-4 flex items-center space-x-4 mt-2">
                    <img src={artistData.images[0].url} alt="Imagem do Artista" className="w-36 h-36 object-cover rounded-full" />
                    <div>
                        <h1 className="text-5xl font-bold">{artistData.name}</h1>
                        <p className="text-sm mt-2">{`${artistData.followers.total.toLocaleString('en-US')} monthly listeners`}</p>
                    </div>
                </div>

                {/* <!-- Principais Músicas --> */}
                <section className="py-4 px-4">
                    <h2 className="text-2xl font-semibold mb-4">Popular</h2>

                    {artistTracks.slice(0, visibleTracks).map((track, index) => (
                        <div
                            onMouseEnter={() => setHoveredTrack(index)}
                            onMouseLeave={() => setHoveredTrack(null)}
                            onClick={() => handleTrackClick(track)} // Chamando a função para tratar o clique
                            key={track.id}
                            className={`grid grid-cols-2 gap-2 pb-2 pt-2 text-[#a7a7a7] cursor-pointer rounded-sm items-center
                                ${hoveredTrack === index ? 'bg-[#ffffff2b]' : ''}
                                ${selectedTrack === track.id ? 'bg-[#ffffff2b]' : ''}`} // Aplica a cor de fundo para o clique
                        >
                            {/* Número da faixa e informações da música */}
                            <div className='flex items-center'>
                                <span className='text-[#a7a7a7] w-8 text-right mr-6'>
                                    {hoveredTrack === index || selectedTrack === track.id ? (
                                        <img className='w-4 ml-5' src={assets.play_icon} alt="Play" />
                                    ) : (
                                        index + 1
                                    )}
                                </span>
                                <div className='text-white flex items-center text-sm'>
                                    <img src={track.album.images[0].url} alt="Album Cover" className="w-12 h-12 object-cover rounded-md" />
                                    <span className="ml-4">{track.name}</span>
                                </div>
                            </div>
                            {/* Duração */}
                            <p className='text-sm text-right mr-6'>
                                {Math.floor((track.duration_ms || 0) / 60000)}:{(((track.duration_ms || 0) % 60000) / 1000).toFixed(0).padStart(2, '0')}
                            </p>
                        </div>
                    ))}

                    <div className="mt-4">
                        <button onClick={toggleShowAll} className="text-gray-400 hover:font-bold text-sm">
                            {showAll ? "See less" : "See more"}
                        </button>
                    </div>
                </section>

                {/* <!-- Discografia --> */}
                <section className="py-8 px-4">
                    <h2 className="text-2xl font-semibold mb-4">Discography</h2>

                    {/* Botões para Filtrar */}
                    <div className="flex gap-4 mb-6">
                        <button
                            className={`px-4 py-2 rounded-full text-sm transition-colors
                                ${selectedType === 'album' ? 'bg-white text-black' : 'bg-[#ffffff2b] text-gray-300 hover:bg-[#ffffff38]'}`}
                            onClick={() => setSelectedType('album')}
                        >
                            Albums
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full text-sm transition-colors
                                ${selectedType === 'single' ? 'bg-white text-black' : 'bg-[#ffffff2b] text-gray-300 hover:bg-[#ffffff38]'}`}
                            onClick={() => setSelectedType('single')}
                        >
                            Singles and EPs
                        </button>
                    </div>

                    {/* Grid de Álbuns */}
                    <div className="mt-2 grid gap-4"
                        style={{
                            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"
                        }}
                    >
                        {filteredAlbums.length > 0 ? (
                            filteredAlbums.map((album, index) => (
                                <div
                                    onClick={() => handleAlbumClick(album)}
                                    key={index}
                                    className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[#ffffff2b] items-center"
                                >
                                    <img
                                        src={album.images[0]?.url}
                                        alt={album.name}
                                        className="w-[150px] h-[150px] object-contain rounded-lg"
                                    />
                                    <h3 className="mt-2 text-sm text-white">{album.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {album.release_date.split('-')[0]} • {(album.album_type).charAt(0).toUpperCase() + album.album_type.slice(1)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Carregando álbuns...</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <button onClick={toggleShowAllAlbums} className="text-gray-400 hover:font-bold text-sm">
                            {showAllAlbums ? "See less" : "See more"}
                        </button>
                    </div>

                </section>

            </div>
        </>
    );
};

export default DisplayArtist;