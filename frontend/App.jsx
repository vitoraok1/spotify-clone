import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Display from './components/Display';
import { PlayerContext } from './context/PlayerContext';
import { useContext } from 'react';
import { getSpotifyToken } from './spotifyService';

const App = () => {

  const { audioRef, track } = useContext(PlayerContext);
  const [token, setToken] = useState(null);

  useEffect(() => {
      async function fetchToken() {
          const storedToken = localStorage.getItem("spotify_token");
          const tokenExpiration = localStorage.getItem("spotify_token_expiration");

          console.log(storedToken);

          if (storedToken && tokenExpiration > Date.now()) {
              setToken(storedToken);
          } else {
              const newToken = await getSpotifyToken();
              setToken(newToken);
              localStorage.setItem("spotify_token", newToken);
              localStorage.setItem("spotify_token_expiration", Date.now() + 3600 * 1000); // Expira em 1h
          }
      }

      fetchToken();
  }, []);

  return (
    <div className='h-screen bg-black'>
      <div className='h-[90%] flex'>
        <Sidebar />
        <Display />
      </div>
      <Player />
      <audio ref={audioRef}/>
    </div>
  );
};

export default App;
