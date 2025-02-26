import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';

const DisplayArtist = () => {
    const { id } = useParams(); // Obtém o ID do álbum da URL
    const location = useLocation(); // Acessa o estado da navegação
    const artistData = location.state?.artist; // Obtém os dados do álbum passados na navegação
    const { playWithName } = useContext(PlayerContext);

    if (!artistData) {
        return <p>Carregando...</p>; // Exibe uma mensagem de carregamento se os dados não estiverem disponíveis
    }

    console.log("Dados do artista:", artistData);

    return (
        <>
            <Navbar />
            <div className="text-white">
                {/* <!-- Container do Artista --> */}
                <div className="relative p-4 flex items-center space-x-4 mt-2">
                    {/* <!-- Imagem do Artista --> */}
                    <img src={artistData.images[0].url} alt="Imagem do Artista" className="w-36 h-36 object-cover rounded-full" />

                    {/* <!-- Informações do Artista --> */}
                    <div>
                        <p className="text-sm mt-2">Verified Artist</p>
                        <h1 className="text-5xl font-bold">{artistData.name}</h1>
                        <p className="text-sm mt-2">{`${artistData.followers.total.toLocaleString('en-US')} monthly listeners`}</p>
                    </div>
                </div>

                {/* <!-- Principais Músicas --> */}
                <section className="py-8 px-4">
                    <h2 className="text-2xl font-semibold">Popular</h2>
                    <ul className="mt-4 space-y-4">
                    <li className="flex items-center justify-between py-2">
                        <span className="text-lg">Nome da Música 1</span>
                        <span className="text-sm text-gray-400">Duração</span>
                    </li>
                    <li className="flex items-center justify-between py-2">
                        <span className="text-lg">Nome da Música 2</span>
                        <span className="text-sm text-gray-400">Duração</span>
                    </li>
                    <li className="flex items-center justify-between py-2">
                        <span className="text-lg">Nome da Música 3</span>
                        <span className="text-sm text-gray-400">Duração</span>
                    </li>
                    </ul>
                </section>

                {/* <!-- Discografia --> */}
                <section className="py-8 px-4">
                    <h2 className="text-3xl font-semibold">Discography</h2>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg">
                            <img src="" alt="Álbum" className="w-full h-[200px] object-cover rounded-lg" />
                            <h3 className="mt-2 text-lg">Nome do Álbum</h3>
                            <p className="text-sm text-gray-400">Ano de Lançamento</p>
                        </div>
                        <div className="p-4 rounded-lg">
                            <img src="" alt="Álbum" className="w-full h-[200px] object-cover rounded-lg" />
                            <h3 className="mt-2 text-lg">Nome do Álbum</h3>
                            <p className="text-sm text-gray-400">Ano de Lançamento</p>
                        </div>
                        <div className="p-4 rounded-lg">
                            <img src="" alt="Álbum" className="w-full h-[200px] object-cover rounded-lg" />
                            <h3 className="mt-2 text-lg">Nome do Álbum</h3>
                            <p className="text-sm text-gray-400">Ano de Lançamento</p>
                        </div>
                    </div>
                </section>
                </div>
        </>
    );
};

export default DisplayArtist;