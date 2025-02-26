import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Pega a rota atual
    const [query, setQuery] = useState('');

    // Obtendo as funções para atualizar o estado global
    const { setArtists, setTracks, setAlbums } = useContext(SearchContext);

    const handleSearch = async () => {
        if (!query.trim()) return;

        const token = localStorage.getItem("spotify_token");
        if (!token) {
            console.error("Token do Spotify não encontrado!");
            return;
        }

        try {
            // Faz a busca inicial para obter artistas e álbuns
            let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,album&limit=10`;

            let response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            let res = await response.json();

            console.log("Resposta da API Spotify:", res);

            if (res.error) {
                console.error("Erro da API Spotify:", res.error);
                return;
            }

            setArtists(res.artists?.items || []);
            setTracks([]); // Limpa as tracks para evitar resultados anteriores

            // Se houver álbuns, faz uma requisição adicional para pegar as músicas
            const albumItems = res.albums?.items || [];

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

            console.log('Albums with tracks:', albumsWithTracks);

            // Atualiza o estado com os álbuns e suas músicas
            setAlbums(albumsWithTracks);

            navigate('/');

        } catch (error) {
            console.error("Erro ao buscar músicas:", error);
        }
    };

    const handleBack = () => {
        // Se houver uma pesquisa ativa, limpa os resultados e reseta o estado
        if (query.trim()) {
            setQuery('');
            setArtists([]);
            setAlbums([]);
            setTracks([]);
        } else {
            // Se estiver na home, o botão não faz nada
            if (location.pathname === '/') return;

            // Caso contrário, volta para a página anterior
            navigate(-1);
        }
    };

    // Verifica se o botão deve ser desativado:
    const isBackDisabled = location.pathname === '/' && !query.trim();

    return (
        <div className='w-full flex justify-between items-center font-semibold'>
            <div className='flex items-center gap-2'>
                <img
                    onClick={handleBack}
                    className={`w-8 bg-black p-2 rounded-2xl cursor-pointer ${isBackDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    src={assets.arrow_left}
                    alt="Voltar"
                />
                <img
                    onClick={() => navigate(+1)}
                    className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
                    src={assets.arrow_right}
                    alt="Avançar"
                />
            </div>

            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-3 pl-8 pr-4 py-2 bg-[#242424] rounded-full'>
                    <img className='w-6' src={assets.search_icon} alt="Search Icon" />

                    <input
                        className='flex-1 bg-transparent text-white placeholder-gray-400 outline-none max-w-[90px]'
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search"
                    />

                    <button
                        className={`ml-auto bg-green-800 hover:bg-green-900 text-white px-3 py-1 rounded-full transition max-w-[70px] cursor-pointer ${
                            !query.trim() && 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={handleSearch}
                        disabled={!query.trim()}
                    >
                        <p className='justify-center font-bold'>Go</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
