import { createContext, useEffect, useRef, useState } from "react";
// import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const seekVolumeBg = useRef();
    const seekVolumeBar = useRef();

    let previousVolume = 0.5;

    const [track, setTrack] = useState();
    const [album, setAlbum] = useState();
    const [albumTracks, setAlbumTracks] = useState([]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            seconds: '00',
            minutes: 0,
        },
        totalTime: {
            seconds: '00',
            minutes: 0,
        }
    });

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const saveAlbum = async (album) => {
        if (!album) return;

        const albumInfo = {
            album: album.name,
            artist: album.artists[0].name,
            tracks: album.tracks.map(track => track.name)
        };

        setAlbum(albumInfo);

        console.log("Álbum:", albumInfo);

        try {
            const tracksPreviewUrls = [];

            for (let trackName of albumInfo.tracks) {
                const url = `http://localhost:3000/api/search?artist=${encodeURIComponent(albumInfo.artist)}&track=${encodeURIComponent(trackName)}`;
                const response = await fetch(url);
                const musicData = await response.json();

                if (musicData.data.length > 0) {
                    const previewUrl = musicData.data[0].preview;
                    tracksPreviewUrls.push(previewUrl);
                } else {
                    console.error(`Nenhuma música encontrada para: ${trackName}`);
                }
            }

            if (tracksPreviewUrls.length > 0) {
                setAlbumTracks(tracksPreviewUrls);
            }

            console.log("URLs dos previews do álbum:", tracksPreviewUrls);
        } catch (error) {
            console.error("Erro ao buscar músicas:", error);
        }
    };


    const playWithName = async (artist, track) => {
        try {
            const url = `http://localhost:3000/api/search?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`;
            const response = await fetch(url);
            const musicData = await response.json();

            console.log("Dados da música:", musicData);

            if (musicData.data.length > 0) {
                const previewUrl = musicData.data[0].preview;

                setTrack(musicData.data[0]); // Atualiza o estado com os dados da track
                audioRef.current.src = previewUrl; // Define a URL do áudio no elemento <audio>
                await audioRef.current.play(); // Toca a música
                setPlayStatus(true);
            } else {
                console.error("Nenhuma música encontrada");
            }
        } catch (error) {
            console.error("Erro ao buscar música:", error);
        }
    };

    const previous = async () => {
        // if (track.id > 0) {
        //     // await setTrack(songsData[track.id - 1])
        //     await audioRef.current.play();
        //     setPlayStatus(true);
        // }
        console.log('previous', track.id);
    }

    const next = async () => {
        // if (track.id < albumTracks.length - 1) {
        //     // await setTrack(songsData[track.id + 1])
        //     await audioRef.current.play();
        //     setPlayStatus(true);
        // }
        console.log('next', albumTracks.length - 1);
    }

    const seekSong = (e) => {
        const seekWidth = seekBg.current.clientWidth;
        const seekPosition = e.nativeEvent.offsetX;
        const seekPercentage = seekPosition / seekWidth;
        const seekTime = seekPercentage * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
    }

    const muteVolume = () => {
        const currentVolume = audioRef.current.volume;

        if (currentVolume === 0) {

            audioRef.current.volume = previousVolume || 0.5;
            seekVolumeBar.current.style.width = `${(previousVolume || 0.5) * 100}%`;
        } else {

            previousVolume = currentVolume;
            audioRef.current.volume = 0;
            seekVolumeBar.current.style.width = '0%';
        }
    };

    const seekVolume = (e) => {
        const seekWidth = seekVolumeBg.current.clientWidth;
        const seekPosition = e.nativeEvent.offsetX;
        const seekPercentage = seekPosition / seekWidth;

        audioRef.current.volume = seekPercentage;
        seekVolumeBar.current.style.width = `${seekPercentage * 100}%`;

        if (seekPercentage > 0) {
            previousVolume = seekPercentage;
        }
    };

    useEffect(() => {
        audioRef.current.ontimeupdate = () => {
            const currentSeconds = Math.floor(audioRef.current.currentTime % 60);
            const currentMinutes = Math.floor(audioRef.current.currentTime / 60);
            const totalSeconds = Math.floor(audioRef.current.duration % 60) || 0; // Evita NaN
            const totalMinutes = Math.floor(audioRef.current.duration / 60) || 0; // Evita NaN

            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100) || 0) + '%';

            setTime({
                currentTime: {
                    seconds: String(currentSeconds).padStart(2, '0'),
                    minutes: currentMinutes,
                },
                totalTime: {
                    seconds: String(totalSeconds).padStart(2, '0'),
                    minutes: totalMinutes,
                }
            });
        };
    }, [audioRef]);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        // setTrack,
        saveAlbum,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithName,
        previous,
        next,
        seekSong,
        seekVolume,
        seekVolumeBar,
        seekVolumeBg,
        muteVolume,
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;