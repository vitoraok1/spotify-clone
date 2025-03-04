import React, { createContext, useState } from 'react';
import config from '../../config';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);

    const searchAlbum = async (artist, album) => {
        try {
            const url = `${config.apiUrl}/api/searchAlbum?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`;
            const response = await fetch(url);
            const albumData = await response.json();

            return albumData;

        } catch (error) {
            console.error("Erro ao buscar álbum:", error);
        }
    };

    return (
        <SearchContext.Provider value={{ artists, setArtists, tracks, setTracks, albums, setAlbums, searchAlbum }}>
            {children}
        </SearchContext.Provider>
    );
};
