import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [artists, setArtists] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);

    return (
        <SearchContext.Provider value={{ artists, setArtists, tracks, setTracks, albums, setAlbums }}>
            {children}
        </SearchContext.Provider>
    );
};
