import React, {useState} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();
    const [artists, setArtists] = useState('');
    const [tracks, setTracks] = useState('');
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return; // Evita requisição com input vazio

        const token = localStorage.getItem("spotify_token");
        if (!token) {
            console.error("Token do Spotify não encontrado!");
            return;
        }

        try {
            let url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,track&limit=10`;

            let response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            let res = await response.json();

            if (res.error) {
                console.error("Erro da API Spotify:", res.error);
                return;
            }

            console.log("Resposta da API Spotify:", res);

            setArtists(res.artists?.items || []);
            setTracks(res.tracks?.items || []);

            console.log("Artistas:", res.artists?.items);
            console.log("Músicas:", res.tracks?.items);

        } catch (error) {
            console.error("Erro ao buscar músicas:", error);
        }
    };

  return (
    <>
        <div className='w-full flex justify-between items-center font-semibold'>
            <div className='flex items-center gap-2'>
                <img onClick={() => navigate(-1)}className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt="" />
                <img onClick={() => navigate(+1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt="" />
            </div>

            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-3 pl-8 pr-4 py-2 bg-[#242424] rounded-full'>
                    <img className='w-6' src={assets.search_icon} alt="Search Icon" />

                    <input
                        className='flex-1 bg-transparent text-white placeholder-gray-400 outline-none max-w-[90px]'
                        type="text"
                        id="searchInput"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search"
                    />

                    <button
                        className={`ml-auto bg-green-800 hover:bg-green-900 text-white px-3 py-1 rounded-full transition max-w-[70px] cursor-pointer ${
                            !query.trim() && 'opacity-50 cursor-not-allowed' // Desabilita se vazio
                        }`}
                        onClick={handleSearch}
                        disabled={!query.trim()} // Desabilita o botão se o input estiver vazio
                    >
                        <p className='justify-center font-bold'>Go</p>
                    </button>
                </div>
                <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer'>Explore Premium</p>
                <p className='bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer'>Install App</p>
                <p className='bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center'>S</p>
            </div>
        </div>

        <div className='flex items-center gap-2 mt-4'>
            <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
            <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer'>Music</p>
            <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer'>Podcasts</p>
        </div>
    </>
  )
}

export default Navbar
