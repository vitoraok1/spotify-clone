import React, { useContext, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';

const DisplayAlbum = () => {
    const { id } = useParams(); // Obtém o ID do álbum da URL
    const location = useLocation(); // Acessa o estado da navegação
    const [hoveredTrack, setHoveredTrack] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null); // Estado para armazenar a faixa selecionada
    const albumData = location.state?.album; // Obtém os dados do álbum passados na navegação
    const { playWithName } = useContext(PlayerContext);

    if (!albumData) {
        return <p>Carregando...</p>; // Exibe uma mensagem de carregamento se os dados não estiverem disponíveis
    }

    console.log("Dados do álbum:", albumData);

    // Verifica se há faixas no álbum
    const tracks = albumData.tracks || [];

    console.log("Álbum tracks:", tracks);

    const handleTrackClick = (track) => {
        playWithName(track.artists[0].name, track.name);
        setSelectedTrack(track.id); // Atualiza o estado de seleção para a faixa clicada
    };

    return (
        <>
            <Navbar />
            <div className='mt-4 flex gap-5 p-8 flex-col md:flex-row md:items-end rounded-sm'>
                <img className='w-48 rounded' src={albumData.images?.[0]?.url} alt={albumData.name} />
                <div className='flex flex-col'>
                    <p>{(albumData.album_type).charAt(0).toUpperCase() + albumData.album_type.slice(1)}</p>
                    <h2 className='text-5xl font-bold mb-4 md:text-6xl'>{albumData.name}</h2>
                    <p className='mt-1'>
                        <b>{albumData.artists?.[0]?.name}</b>
                        {` • ${tracks.length} songs, `}
                        {Math.floor(tracks.reduce((acc, track) => acc + (track.duration_ms || 0), 0) / 60000)} min
                    </p>
                </div>
            </div>

            <div className='flex justify-between items-center mt-6 mb-3 pl-8 text-[#a7a7a7]'>
                <p className="text-sm">#&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title</p>
                <img className='w-4 mr-10' src={assets.clock_icon} alt="Duration" />
            </div>
            <hr className="text-[#3f3f3f] mt-2"/>
            {tracks.map((track, index) => (
                <div
                    onMouseEnter={() => setHoveredTrack(index)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    onClick={() => handleTrackClick(track)} // Chamando a função para tratar o clique
                    key={track.id}
                    className={`grid grid-cols-2 gap-2 p-2 text-[#a7a7a7] cursor-pointer rounded-sm
                        ${hoveredTrack === index ? 'bg-[#ffffff2b]' : ''}
                        ${selectedTrack === track.id ? 'bg-[#ffffff2b]' : ''}`} // Aplica a cor de fundo para o clique
                >
                    {/* Número da faixa e informações da música */}
                    <div className='flex items-center mt-2'>
                        <span className='text-[#a7a7a7] w-8 text-right mr-6'>
                            {hoveredTrack === index || selectedTrack === track.id ? (
                                <img className='w-4 ml-5' src={assets.play_icon} alt="Play" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <div className='text-white flex flex-col text-sm'>
                            <span>{track.name}</span>
                            <span className='text-[#a7a7a7]'>{track.artists[0]?.name}</span>
                        </div>
                    </div>
                    {/* Duração */}
                    <p className='text-sm text-right mt-3 mr-6'>
                        {Math.floor((track.duration_ms || 0) / 60000)}:{(((track.duration_ms || 0) % 60000) / 1000).toFixed(0).padStart(2, '0')}
                    </p>
                </div>
            ))}
        </>
    );
};

export default DisplayAlbum;