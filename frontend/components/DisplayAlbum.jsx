import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';

const DisplayAlbum = () => {
    const { id } = useParams(); // Obtém o ID do álbum da URL
    const location = useLocation(); // Acessa o estado da navegação
    const albumData = location.state?.album; // Obtém os dados do álbum passados na navegação
    const { playWithId } = useContext(PlayerContext);

    console.log('albumData', albumData); // Verifique a estrutura do objeto

    if (!albumData) {
        return <p>Carregando...</p>; // Exibe uma mensagem de carregamento se os dados não estiverem disponíveis
    }

    // Verifica se há faixas no álbum
    const tracks = albumData.tracks || [];

    return (
        <>
            <Navbar />
            <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
                <img className='w-48 rounded' src={albumData.images?.[0]?.url} alt={albumData.name} />
                <div className='flex flex-col'>
                    <p>Playlist</p>
                    <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{albumData.name}</h2>
                    <h4>{albumData.artists?.[0]?.name}</h4>
                    <p className='mt-1'>
                        <b>Spotify</b>
                        • {albumData.popularity} likes
                        • <b>{tracks.length} songs,</b>
                        about {Math.floor(tracks.reduce((acc, track) => acc + (track.duration_ms || 0), 0) / 60000)} min
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                <p><b className='mr-4'>#</b>Title</p>
                <p>Album</p>
                <p className='hidden sm:block'>Date Added</p>
                <img className='m-auto w-4' src="clock_icon.png" alt="Duration" />
            </div>
            <hr />
            {tracks.map((track, index) => (
                <div
                    onClick={() => playWithId(track.id)}
                    key={track.id}
                    className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'
                >
                    <p className='text-white'>
                        <b className='mr-4 text-[#a7a7a7]'>{index + 1}</b>
                        <img className='inline w-10 mr-5' src={albumData.images?.[0]?.url} alt={track.name} />
                        {track.name}
                    </p>
                    <p className='text-[15px]'>{albumData.name}</p>
                    <p className='text=[15px] hidden sm:block'>5 days ago</p>
                    <p className='text-[15px] text-center'>
                        {Math.floor((track.duration_ms || 0) / 60000)}:{(((track.duration_ms || 0) % 60000) / 1000).toFixed(0).padStart(2, '0')}
                    </p>
                </div>
            ))}
        </>
    );
};

export default DisplayAlbum;